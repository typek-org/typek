/// <reference lib="deno.ns" />

import { assertTypeEquals } from "../mod.ts";
import { assertEquals } from "../test/assert.ts";
import { toPipable, pipe } from "./pipe.ts";

Deno.test("pipe", () => {
  Deno.test("function", () => {
    const fourtyFour = pipe(42, (x) => x + 2);
    assertEquals(fourtyFour, 44);
    assertTypeEquals<typeof fourtyFour, number>();

    const bigGuy = pipe(
      "joe",
      (x) => x.toUpperCase(),
      (x) => `Hey, ${x}!`,
      (x) => ({ value: x, repeat: 3 }),
      ({ value, repeat }) =>
        Array.from<typeof value>({ length: repeat }).fill(value),
      (x) => {
        assertTypeEquals<typeof x, string[]>();
        return x.join(" ");
      },
    );
    assertEquals(bigGuy, "Hey, JOE! Hey, JOE! Hey, JOE!");
    assertTypeEquals<typeof bigGuy, string>();
  });

  Deno.test("method", () => {
    const a = [1, 2, 3, 4, 5];
    const map =
      <S, T>(fn: (v: S) => T): ((a: S[]) => T[]) =>
      (arr) =>
        arr.map(fn);

    const b = toPipable(a).pipe(
      (x) => [0, ...x],
      map((x) => 2 * x),
      map((x) => x.toString()),
      ([x, y, z]) => [z, y, x] as const,
    );
    assertEquals(b, ["4", "2", "0"]);
    assertTypeEquals<typeof b, readonly [string, string, string]>();
  });
});
