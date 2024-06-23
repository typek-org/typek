import type { AnyConstructor } from "../mod.ts";

export type PrototypeGuards<T extends Record<string, AnyConstructor>> = {
  [K in string & keyof T as `is${K}`]: (x: unknown) => x is InstanceType<T[K]>;
};

export function prototypeGuard<T extends Record<string, AnyConstructor>>(
  constructors: T
): PrototypeGuards<T> {
  return <any>(
    Object.fromEntries(
      Object.entries(constructors).map(([key, constructor]) => [
        `is${key}`,
        (x: unknown) => x instanceof constructor,
      ])
    )
  );
}
