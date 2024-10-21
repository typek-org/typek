export type Primitive =
  | string
  | number
  | symbol
  | bigint
  | boolean
  | null
  | undefined;

export type PositiveInfinity = typeof Infinity;
export type NegativeInfinity = -1e999;

export type Tuple<N extends number, T> = N extends number
  ? number extends N
    ? T[]
    : Tuple_Helper<N, T>
  : T[];

type Tuple_Helper<
  N extends number,
  T,
  Aggregate extends T[] = []
> = Aggregate["length"] extends N
  ? Aggregate
  : Tuple_Helper<N, T, [...Aggregate, T]>;

export interface AnyFunction {
  (...args: any): any;
}

export interface AnyConstructor {
  new (...args: any): any;
}

export type Guard<T> = (x: unknown) => x is T;
export type AnyGuard = (x: any) => x is any;

export type GuardType<T extends AnyGuard> = T extends (x: any) => x is infer R
  ? R
  : never;

export type TypedArray =
  | Int8Array
  | Int16Array
  | Int32Array
  | BigInt64Array
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array
  | BigUint64Array;

/**
 * Construct a type with the properties of T except for those in type K.
 *
 * The `Omit<T>` from TypeScript's standard library is utterly broken
 * on union types, as per [#54451](https://github.com/microsoft/TypeScript/issues/54451).
 */
export type Omit<T, K extends keyof any> = T extends infer S
  ? Pick<S, Exclude<keyof S, K>>
  : never;
