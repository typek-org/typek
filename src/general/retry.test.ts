import {
  assertEquals,
  assertThrows,
  assertRejects,
  yeet,
  assert,
  delay,
} from "../mod.ts";
import { retry, retrySync } from "./retry.ts";

const failTimesFactory =
  <T>(count: number, result: T) =>
  () =>
    count-- <= 0 ? result : yeet(`Expected zero, got ${count}`);

Deno.test("failTimesFactory", () => {
  const f = failTimesFactory(3, "success");
  assertThrows(f);
  assertThrows(f);
  assertThrows(f);
  assertEquals(f(), "success");
});

Deno.test("retrySync success", () => {
  const getName = failTimesFactory(4, "bob");
  const name = retrySync(5, getName);
  assertEquals(name, "bob");
});

Deno.test("retrySync failure", () => {
  const getName = failTimesFactory(5, "bob");
  assertThrows(() => retrySync(4, getName));
});

Deno.test("retry basic", async () => {
  let attempt = 0;
  const result = await retry(3, async () => {
    if (attempt < 2) {
      attempt++;
      await delay(100);
      throw new Error("fail");
    }
    return "success";
  });

  assertEquals(result, "success");
});

Deno.test("retry exponential backoff", async () => {
  let attempt = 0;
  const delays: number[] = [];

  const result = await retry(
    {
      count: 3,
      delay: 100,
      exponentialBackoff: 2,
    },
    async () => {
      delays.push(Date.now());
      if (attempt < 2) {
        attempt++;
        await delay(50);
        throw new Error("fail");
      }
      return "success";
    }
  );

  assertEquals(result, "success");

  assert(delays[1] - delays[0] >= 150);
  assert(delays[2] - delays[1] >= 250);
});

Deno.test("retry abort signal", async () => {
  const controller = new AbortController();
  const { signal } = controller;

  const promise = retry({ count: 5, delay: 100, signal }, () => {
    throw new Error("fail");
  });

  setTimeout(() => controller.abort(), 150);

  await assertRejects(() => promise, "The signal has been aborted");
});
