import type {
  Primitive,
  AnyConstructor,
  AnyFunction,
  SimplifyType,
} from "../type/mod.ts";
import { filter, map, zip } from "./iter.ts";

// Ideally, we'd have a Replacer function instead of Substitue everywhere.
// Then we could replace values generically, without loosing details about
// their specific type. However, this is currently impossible to implement:
// https://github.com/microsoft/TypeScript/issues/58779

export type DeeplyMapped<Subject, Pattern, Substitute> = Subject extends Pattern
  ? Substitute
  : Subject extends Primitive | AnyFunction | AnyConstructor
  ? Subject
  : Subject extends any[]
  ? DeeplyMapped.Array<Subject, Pattern, Substitute>
  : DeeplyMapped.Object<Subject, Pattern, Substitute>;

export namespace DeeplyMapped {
  export type Object<Subject, Pattern, Substitute> = {
    [K in keyof Subject]: DeeplyMapped<Subject[K], Pattern, Substitute>;
  };

  export type Array<
    Subject extends any[],
    Pattern,
    Substitute
  > = Subject extends [infer Item]
    ? [DeeplyMapped<Item, Pattern, Substitute>]
    : Subject extends [infer Head, ...infer Tail]
    ? [
        DeeplyMapped<Head, Pattern, Substitute>,
        ...DeeplyMapped.Array<Tail, Pattern, Substitute>
      ]
    : DeeplyMapped<Subject[number], Pattern, Substitute>[];
}

export function deeplyMap<Subject, Pattern, Substitute>(
  subject: Subject,
  which: (x: unknown) => x is Pattern,
  transformer: (x: Pattern) => Substitute
): DeeplyMapped<Subject, Pattern, Substitute> {
  if (which(subject)) return <any>transformer(subject);
  if (Array.isArray(subject))
    return <any>subject.map((x) => deeplyMap(x, which, transformer));
  if (typeof subject === "object" && subject !== null)
    return <any>(
      Object.fromEntries(
        Object.entries(subject).map(([key, value]) => [
          key,
          deeplyMap(value, which, transformer),
        ])
      )
    );
  return <any>subject;
}

type PromiseLike = {
  then(onfulfilled: (value: any, ...args: any) => any, ...args: any): any;
};
const toPromise = async <T>(value: T): Promise<Awaited<T>> => await value;

export type DeeplyAwaited<Subject> = Subject extends PromiseLike
  ? DeeplyAwaited.NotPromise<Awaited<Subject>>
  : DeeplyAwaited.NotPromise<Subject>;

export namespace DeeplyAwaited {
  export type NotPromise<Subject> = Subject extends Primitive
    ? Subject
    : Subject extends any[]
    ? DeeplyAwaited.Array<Subject>
    : DeeplyAwaited.Object<Subject>;

  export type Object<Subject> = {
    [K in keyof Subject]: DeeplyAwaited<Subject[K]>;
  };

  export type Array<Subject extends any[]> = Subject extends [infer Item]
    ? [DeeplyAwaited<Item>]
    : Subject extends [infer Head, ...infer Tail]
    ? [DeeplyAwaited<Head>, ...DeeplyAwaited.Array<Tail>]
    : DeeplyAwaited<Subject[number]>[];
}

export async function deeplyAwait<Subject>(
  subject: Subject
): Promise<DeeplyAwaited<Subject>> {
  subject = await subject;
  if (Array.isArray(subject))
    return <any>await Promise.all(subject.map(deeplyAwait));
  if (typeof subject === "object" && subject !== null) {
    const values = await Promise.all(Object.values(subject).map(deeplyAwait));
    return <any>Object.fromEntries(zip(Object.keys(subject), values));
  }
  return <any>subject;
}

class _ObjectEntries<T extends object> {
  #type!: T;

  private constructor(private entries: Iterable<[keyof T, T[keyof T]]>) {}
  static fromObject<T extends object>(target: T): ObjectEntries<T> {
    return new _ObjectEntries<any>(Object.entries(target));
  }

  omit<Key extends keyof T>(key: Key): ObjectEntries<Omit<T, Key>>;
  omit<Keys extends (keyof T)[]>(
    keys: Keys
  ): ObjectEntries<Omit<T, Keys[number]>>;
  omit<Pattern extends string>(
    which: (key: unknown) => key is Pattern
  ): ObjectEntries<Omit<T, Pattern>>;
  omit(
    which: string | string[] | ((key: unknown) => boolean)
  ): ObjectEntries<any> {
    if (typeof which === "string") {
      return new _ObjectEntries(filter(this.entries, ([key]) => key !== which));
    }
    if (Array.isArray(which)) {
      const keySet = new Set(which);
      return new _ObjectEntries(
        filter(this.entries, ([key]) => !keySet.has(key as any))
      );
    }
    return new _ObjectEntries(filter(this.entries, ([key]) => !which(key)));
  }

  deepTransform<S, R>(
    which: (x: unknown) => x is S,
    transformer: (x: S) => R
  ): ObjectEntries<DeeplyMapped.Object<T, S, R>> {
    return new _ObjectEntries<any>(
      map(this.entries, ([key, value]) => [
        key,
        deeplyMap(value, which, transformer),
      ])
    );
  }

  deepAwait(): AsyncObjectEntries<DeeplyAwaited.Object<T>> {
    return AsyncObjectEntries.fromObjectEntries(this.entries).deepAwait();
  }

  collect(): SimplifyType<T> {
    return Object.fromEntries(this.entries) as any;
  }
}

export const ObjectEntries = _ObjectEntries.fromObject;
export type ObjectEntries<T extends object> = _ObjectEntries<T>;

class AsyncObjectEntries<T extends object> {
  #type!: T;

  constructor(private entries: Iterable<[keyof T, Promise<T[keyof T]>]>) {}
  static fromObjectEntries<T extends object>(
    entries: Iterable<[keyof T, T[keyof T]]>
  ): AsyncObjectEntries<T> {
    return new AsyncObjectEntries<T>(
      map(entries, ([key, value]) => [key, toPromise(value)])
    );
  }

  deepTransform<S, R>(
    which: (x: unknown) => x is S,
    transformer: (x: S) => R
  ): AsyncObjectEntries<DeeplyMapped.Object<T, S, R>> {
    return new AsyncObjectEntries<any>(
      map(this.entries, ([key, value]) => [
        key,
        value.then((v) => deeplyMap(v, which, transformer)),
      ])
    );
  }

  deepAwait(): AsyncObjectEntries<DeeplyAwaited.Object<T>> {
    return new AsyncObjectEntries<any>(
      map(this.entries, ([key, value]) => [key, deeplyAwait(value)])
    );
  }

  async collect(): Promise<SimplifyType<T>> {
    const entries = Array.from(this.entries);
    const keys = entries.map(([k]) => k);
    const values = await Promise.all(entries.map(([_, v]) => v));
    return Object.fromEntries(zip(keys, values)) as any;
  }
}

export type { AsyncObjectEntries };
