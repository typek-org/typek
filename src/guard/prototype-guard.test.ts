/// <reference lib="deno.ns" />

import { assertTypeEquals } from "../mod.ts";
import { assertEquals } from "../test/mod.ts";
import { prototypeGuard } from "./prototype-guard.ts";

Deno.test("prototypeGuard", () => {
  const { isDate, isResponse } = prototypeGuard({ Date, Response });

  assertEquals(isDate(new Date()), true);
  assertEquals(isDate(new Response()), false);
  assertEquals(isDate({}), false);
  assertEquals(isDate(10), false);
  assertEquals(isDate(null), false);

  assertEquals(isResponse(new Response()), true);
  assertEquals(isResponse(new Date()), false);
  assertEquals(isDate({}), false);
  assertEquals(isDate(10), false);
  assertEquals(isDate(null), false);

  assertTypeEquals<typeof isDate, (x: unknown) => x is Date>();
  assertTypeEquals<typeof isResponse, (x: unknown) => x is Response>();
});
