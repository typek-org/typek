import type { AnyConstructor, AnyFunction, Primitive } from "./common.ts";

/**
 * Normalizes object types, turning types like
 * `Omit<{ foo: 1, bar: 2 }, 'foo'> & { qux: 42 }`
 * into `{ bar: 2, qux: 42 }`.
 *
 * If the type is callable or assignable to a primitive, it
 * leaves it as is in order to not break overloads and types
 * like `string & {}`.
 */
export type SimplifyType<T> = T extends Primitive | AnyFunction | AnyConstructor
  ? T
  : { [K in keyof T]: SimplifyType<T[K]> };

/**
 * Given a union of objects, returns keys that will be valid
 * for at least one subsequent object.
 */
export type KeysUnion<Objs> = Objs extends any ? keyof Objs : never;

/**
 * Given a union of objects, returns keys that will be valid
 * for all subsequent objects.
 */
export type KeysIntersection<Objs> = keyof Objs;

/**
 * Given a union of objects, returns a union of all values that
 * may be present in any prop of any one of the subsequent objects.
 */
export type ValuesUnion<Objs> = Objs extends any ? Objs[keyof Objs] : never;

/**
 * Given an object and a pattern, returns the keys whose corresponding
 * values are assignable to the provided patern.
 */
export type FindMatching<Obj, Value> = {
  [Key in keyof Obj]: Obj[Key] extends Value ? Key : never;
}[keyof Obj];

/**
 * Given an object and a value, returns the keys whose corresponding
 * values are exactly equal to the provided value.
 */
export type FindEqual<Obj, Value> = {
  [Key in keyof Obj]: Obj[Key] extends Value
    ? Value extends Obj[Key]
      ? Key
      : never
    : never;
}[keyof Obj];

export type DeepReadonly<T> = T extends Primitive
  ? T
  : unknown extends T
  ? unknown
  : T extends Date
  ? Readonly<Date>
  : T extends (...args: infer _Args) => infer _Ret
  ? T
  : {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    };
