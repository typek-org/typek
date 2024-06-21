import { assertTypeEquals } from "../mod.ts";
import type { SimplifyType } from "./object.ts";

Deno.test("SimplifyType", () => {
  // @ts-expect-error object intersection not normalized automatically
  assertTypeEquals<
    Omit<{ foo: 1; bar: 2 }, "foo"> & { qux: 42 },
    { bar: 2; qux: 42 }
  >();

  assertTypeEquals<
    SimplifyType<Omit<{ foo: 1; bar: 2 }, "foo"> & { qux: 42 }>,
    { bar: 2; qux: 42 }
  >();

  assertTypeEquals<
    SimplifyType<string & NonNullable<unknown>>,
    string & NonNullable<unknown>
  >();
});
