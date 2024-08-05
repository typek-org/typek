/// <reference lib="deno.ns" />

import {
  assertType,
  assertTypeEquals,
  assertTypeSatisfies,
} from "./assert-type.ts";

Deno.test("assertType", () => {
  assertType<true>();

  // @ts-expect-error should fail with false
  assertType<false>();

  // @ts-expect-error should fail with type assignable to true
  assertType<boolean>();

  // @ts-expect-error should fail with never
  assertType<never>();

  // @ts-expect-error should fail with any
  assertType<any>();

  // @ts-expect-error should throw with no type argument
  assertType();
});

Deno.test("assertTypeEquals", () => {
  assertTypeEquals<1, 1>();
  assertTypeEquals<number, number>();
  assertTypeEquals<boolean, boolean>();
  assertTypeEquals<{ foo: [] }, { foo: [] }>();

  assertTypeEquals<any, any>();
  assertTypeEquals<never, never>();
  assertTypeEquals<unknown, unknown>();

  // @ts-expect-error should fail with subtype
  assertTypeEquals<1, number>();

  // @ts-expect-error should fail with supertype
  assertTypeEquals<number, 1>();

  // @ts-expect-error should not conflate any with other types
  assertTypeEquals<any, number>();

  // @ts-expect-error should not conflate other types with any
  assertTypeEquals<number, any>();

  // @ts-expect-error should not conflate never with other types
  assertTypeEquals<never, number>();

  // @ts-expect-error should not conflate other types with never
  assertTypeEquals<number, never>();

  // @ts-expect-error should throw with one type argument
  assertTypeEquals<number>();

  // @ts-expect-error should throw without type arguments
  assertTypeEquals();
});

Deno.test("assertTypeSatisfies", () => {
  assertTypeSatisfies<number, number>();
  assertTypeSatisfies<1 | 2, number>();
  assertTypeSatisfies<number, number | boolean | object>();

  assertTypeSatisfies<{ foo: 42; bar: [] }, { foo: number }>();

  assertTypeSatisfies<any, number>();
  assertTypeSatisfies<never, number>();
  assertTypeSatisfies<number, any>();
  assertTypeSatisfies<number, unknown>();

  // @ts-expect-error should not accept wider type
  assertTypeSatisfies<number | string, number>();

  // @ts-expect-error should not accept wider type
  assertTypeSatisfies<number, never>();

  // @ts-expect-error should not accept wider type
  assertTypeSatisfies<unknown, number>();
});
