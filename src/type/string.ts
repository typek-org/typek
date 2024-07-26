/**
 * Split string literal type into atoms.
 * Atoms are either individual characters, or `string`, or `${number}`.
 */
export type Chars<T extends string> = string extends T
  ? string[]
  : T extends ""
  ? []
  : T extends `${infer A}${infer B}`
  ? [A, ...Chars<B>]
  : [];

/**
 * `true` if the provided string is known to be a single character,
 * `false` if the provided string is known to be multiple characters,
 * `null` if it is not known whether the provided string is a single character.
 */
export type IsSingleChar<T extends string> = Chars<T> extends [infer Atom]
  ? string extends Atom
    ? null
    : `${number}` extends Atom
    ? null
    : true
  : false;

/**
 * Adds all the elements of the provided list into a template string,
 * separated by the specified separator string literal.
 *
 * @experimental The behavior if `List` contains a rest element
 * in the middle (eg. `["a", ...string[], "b"]`) is not fixed
 * and is subject to change in future versions.
 *
 * @example
 * ```ts
 * type Foo = Join<'.', ['a', 'b', 'c']>; // 'a.b.c'
 * ```
 */
export type Join<
  Separator extends string,
  List extends string[]
> = List extends []
  ? ""
  : List extends [infer Item extends string]
  ? Item
  : List extends [infer Head extends string, ...infer Tail extends string[]]
  ? `${Head}${Separator}${Join<Separator, Tail>}`
  : string;

/**
 * Splits a string literal type into substrings using the specified separator
 * and returns them as a tuple.
 *
 * @experimental The behavior if `Source` contains `${string}`
 * or `${number}` is not fixed and is subject to change in future versions.
 *
 * @example
 * ```ts
 * type Foo = Split<'/', '/usr/bin/env'>; // ['', 'usr', 'bin', 'env']
 * ```
 */
export type Split<
  Separator extends string,
  Source extends string
> = SplitHelper<Separator, Source, "", []>;

type SplitHelper<
  Separator extends string,
  Source extends string,
  StringAggregator extends string,
  ResultAggregator extends string[]
> = Source extends "" // If reached the end of source...
  ? [...ResultAggregator, StringAggregator] // ... return the aggregated result!
  : Source extends `${Separator}${infer Tail extends string}` // If reached a separator...
  ? SplitHelper<Separator, Tail, "", [...ResultAggregator, StringAggregator]> // ... append current aggregated string to the result.
  : Source extends `${infer Head}${infer Tail}` // If reached a non-separator character...
  ? SplitHelper<Separator, Tail, `${StringAggregator}${Head}`, ResultAggregator> // ... append it to aggregated string.
  : // Edge case if source ends with `${string}`:
    SplitHelper<
      Separator,
      "",
      `${StringAggregator}${Source}`,
      ResultAggregator
    >;
