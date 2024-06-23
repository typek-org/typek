export type Primitive =
  | string
  | number
  | symbol
  | bigint
  | boolean
  | null
  | undefined;

export type PositiveInfinity = typeof Infinity;

// Bug in JSR: https://github.com/jsr-io/jsr/issues/617
// export type NegativeInfinity = -1e999;

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
