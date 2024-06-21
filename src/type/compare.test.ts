import { assertType, assertTypeEquals } from "../test/assert-type.ts";
import type { Equals, Satisfies } from "./compare.ts";

Deno.test("Satisfies", () => {
  type _1 = Satisfies<[1, 2, 3, 4], number[]>;

  type _2 = Satisfies<
    {
      name: "John";
      surname: "Doe";
      age: 42;
    },
    Record<string, string | number>
  >;

  type _3 = Satisfies<
    {
      title: "Rich Harris Poor Harris";
      author: "Robert T. Kiyosaki";
    },
    {
      author: string;
      title: string;
    }
  >;

  // @ts-expect-error should throw on wider type
  type _4 = Satisfies<number | string, number>;

  type _5 = Satisfies<
    // @ts-expect-error should throw on property omission
    {
      foo: "bar";
    },
    { foo: string; bar: number }
  >;
});

Deno.test("Equals", () => {
  assertType<Equals<number, number>>();
  assertType<Equals<number | string, number | string>>();
  assertType<
    Equals<{ foo: string; bar: number }, { bar: number; foo: string }>
  >();
  assertType<Equals<never, never>>();

  assertTypeEquals<Equals<any, number>, false>();
  assertTypeEquals<Equals<any, never>, false>();
  assertTypeEquals<Equals<{ foo: string }, { foo?: string }>, false>();
});
