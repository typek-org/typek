import { pipe, type PipeOf } from "../mod.ts";

class OptionClass<
  IsSome extends boolean,
  Inner extends IsSome extends true ? unknown : never
> implements Iterable<Inner>
{
  private constructor(
    /**
     * For `Some(value)` returns `true`; for `None` returns `false`.
     */
    public readonly isSome: IsSome,

    /**
     * For `Some(value)` returns the value; for `None` returns `undefined`.
     */
    public readonly inner?: Inner
  ) {}

  declare pipe: PipeOf<Option<Inner>>["pipe"];

  *[Symbol.iterator](): IterableIterator<Inner> {
    if (this.isSome) yield this.inner!;
  }

  /**
   * Returns the “no value” variant of Option.
   */
  static None: Option.None = Object.freeze(new OptionClass(false));

  /**
   * Constructs an Option containing the value.
   */
  static Some<T>(value: T): Option.Some<T> {
    return new OptionClass(true, value);
  }

  /**
   * Converts a possibly undefined value into an Option.
   * Values strictly equal to `undefined` are turned into `None`,
   * all other values are returned as `Some`.
   */
  static from<T>(value: T | undefined): Option<T> {
    return new OptionClass(value !== undefined, value) as Option<T>;
  }

  get isNone(): boolean {
    return !this.isSome;
  }

  map<S>(fn: (value: Inner) => S): Option<S> {
    if (this.isSome) return Option.Some(fn(this.inner!));
    else return Option.None;
  }

  /**
   * If `opt` is `Some(value)`, returns `Some(fn(value))`, else returns `None`.
   */
  static map<T, S>(opt: Option<T>, fn: (value: T) => S): Option<S>;
  /**
   * If `val` is `undefined`, returns `undefined`, else returns `fn(val)`.
   *
   * Same as `Option.from(val).map(fn).inner`.
   */
  static map<T, S>(val: T | undefined, fn: (value: T) => S): S | undefined;
  static map<T, S>(
    val: Option<T> | T | undefined,
    fn: (value: T) => S
  ): Option<S> | S | undefined {
    if (isOption(val)) return val.map(fn);
    if (val === undefined) return undefined;
    return fn(val);
  }
}
OptionClass.prototype.pipe = function <T>(this: Option<T>, ...fns: any[]) {
  return pipe(this, ...fns);
};

/**
 * Type `Option` represents an optional value: every `Option`
 * is either `Some` and contains a value, or `None`, and does not.
 *
 * `Option<T>` is similar to TypeScript's idiomatic `T | undefined`,
 * in fact each one can be constructed from the other using `Option.from`
 * and `o.inner`.
 */
type Option<T> = (Option.None | Option.Some<T>) & PipeOf<Option<T>>;
const Option = OptionClass;

namespace Option {
  /**
   * No value.
   */
  export type None = OptionClass<false, never>;

  /**
   * Some value of type T.
   */
  export type Some<T> = OptionClass<true, T>;

  /**
   * For `Some<T>` returns `T`; for `None` returns `undefined`
   */
  export type Inner<O extends Option<any>> = O extends Option.Some<infer T>
    ? T
    : undefined;
}

export { Option };

export const isOption = (x: unknown): x is Option<unknown> =>
  x instanceof Option;
