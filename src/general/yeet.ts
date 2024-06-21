/**
 * A throw expression polyfill with a funny name
 */
export function yeet(msg: string): never;
export function yeet<T extends any[]>(
  err: { new (...args: T): any },
  ...args: T
): never;

export function yeet<T extends any[]>(
  a: string | { new (...args: T): any },
  ...args: T
): never {
  if (typeof a === "string") throw new Error(a);
  throw new a(...args);
}
