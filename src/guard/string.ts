/**
 * A type guard that checks whether a string starts with a specified
 * substring, and if it does, modifies its type accordingly.
 */
export const startsWith = <T extends string>(
  subject: string,
  searchString: T
): subject is `${T}${string}` => subject.startsWith(searchString);

/**
 * A type guard that checks whether a string starts with a specified
 * substring, and if it does, modifies its type accordingly.
 */
export const endsWith = <T extends string>(
  subject: string,
  searchString: T
): subject is `${string}${T}` => subject.endsWith(searchString);
