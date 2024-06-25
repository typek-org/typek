import type { Guard, Primitive, TypedArray } from "../type/mod.ts";

export const isPrimitive = (x: unknown): x is Primitive =>
  x === null || (typeof x !== "object" && typeof x !== "function");

export const isObject = (x: unknown): x is object =>
  typeof x === "object" && x !== null;

export const isBigInt = (x: unknown): x is bigint => typeof x === "bigint";
export const isBoolean = (x: unknown): x is boolean => typeof x === "boolean";
export const isNumber = (x: unknown): x is number => typeof x === "number";
export const isString = (x: unknown): x is string => typeof x === "string";
export const isSymbol = (x: unknown): x is symbol => typeof x === "symbol";

export const isArray = (x: unknown): x is unknown[] => Array.isArray(x);

export const isInt8Array = (x: unknown): x is Int8Array =>
  x instanceof Int8Array;

export const isInt16Array = (x: unknown): x is Int16Array =>
  x instanceof Int16Array;

export const isInt32Array = (x: unknown): x is Int32Array =>
  x instanceof Int32Array;

export const isBigInt64Array = (x: unknown): x is BigInt64Array =>
  x instanceof BigInt64Array;

export const isUint8Array = (x: unknown): x is Uint8Array =>
  x instanceof Uint8Array;

export const isUint8ClampedArray = (x: unknown): x is Uint8ClampedArray =>
  x instanceof Uint8ClampedArray;

export const isUint16Array = (x: unknown): x is Uint16Array =>
  x instanceof Uint16Array;

export const isUint32Array = (x: unknown): x is Uint32Array =>
  x instanceof Uint32Array;

export const isBigUint64Array = (x: unknown): x is BigUint64Array =>
  x instanceof BigUint64Array;

const typedArrayPrototypes = new Set([
  Int8Array.prototype,
  Int16Array.prototype,
  Int32Array.prototype,
  BigInt64Array.prototype,
  Uint8Array.prototype,
  Uint8ClampedArray.prototype,
  Uint16Array.prototype,
  Uint32Array.prototype,
  BigUint64Array.prototype,
]);
export const isTypedArray: Guard<TypedArray> = (x): x is any =>
  typedArrayPrototypes.has(Object.getPrototypeOf(x));

export const isPlainObject = (x: unknown): x is object => {
  if (!isObject(x)) return false;

  const proto = Object.getPrototypeOf(x);
  return proto === null || proto === Object.prototype;
};
