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
