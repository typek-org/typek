/**
 * A `satisfies` operator for types. Returns `T` as is, as long
 * as it is a subtype of `U`; otherwise throws an error.
 *
 * @see [TS #52222](https://github.com/microsoft/TypeScript/issues/52222)
 */
export type Satisfies<T extends U, U> = T;

/**
 * Type-level equality check. Returns `true` if the type `X` strictly
 * equals the type `Y`, otherwise returns `false`.
 *
 * @see [TS #27024](https://github.com/Microsoft/TypeScript/issues/27024)
 */
export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;
