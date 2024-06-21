import type { Equals } from "../type/compare.ts";

declare const Mismatch: unique symbol;
type Mismatch = { [Mismatch]: true };

/**
 * Passes if the provided type argument is exactly `true`,
 * otherwise throws a type checking error.
 */
export const assertType: {
  <T>(..._: Equals<T, true> extends true ? [] : [Mismatch]): void;
} = () => void 0;

/**
 * Passes if the two provided type arguments are equal,
 * otherwise throws a type checking error.
 */
export const assertTypeEquals: {
  <S, T = Mismatch>(..._: Equals<S, T> extends true ? [] : [Mismatch]): void;
} = () => void 0;

/**
 * Passes if the first provided type argument is assignable
 * to the second type argument, otherwise throws.
 */
export const assertTypeSatisfies: {
  <S, T = Mismatch>(..._: [S] extends [T] ? [] : [Mismatch]): void;
} = () => void 0;
