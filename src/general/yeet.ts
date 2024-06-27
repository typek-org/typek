/**
 * Throw from an expression.
 *
 * @example
 * ```ts
 * function save(filename = yeet("Argument required")) { ... }
 *
 * const encoder =
 *     encoding === "utf8" ? new UTF8Encoder()
 *   : encoding === "utf16le" ? new UTF16Encoder(false)
 *   : encoding === "utf16be" ? new UTF16Encoder(true)
 *   : yeet(TypeError, "Unsupported encoding");
 *
 * class Product {
 *   get id() { return this._id; }
 *   set id(value) {
 *     this._id = value ?? yeet("Invalid value");
 *   }
 * }
 * ```
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
