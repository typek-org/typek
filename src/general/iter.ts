export function* concat<T>(...iters: Iterable<T>[]): Iterable<T> {
  for (const iter of iters) {
    yield* iter;
  }
}

export function count<T>(iter: Iterable<T>): number {
  let n = 0;
  for (const _ of iter) n++;
  return n;
}

export function* enumerate<T>(iter: Iterable<T>): Iterable<[number, T]> {
  let i = 0;
  for (const el of iter) yield [i++, el];
}

export function every<T>(iter: Iterable<T>, f: (value: T) => boolean): boolean {
  for (const value of iter) if (!f(value)) return false;
  return true;
}

export function filter<S, T extends S>(
  iter: Iterable<S>,
  fn: (value: S) => value is T
): Iterable<T>;
export function filter<T>(
  iter: Iterable<T>,
  fn: (value: T) => boolean
): Iterable<T>;

export function* filter<T>(
  iter: Iterable<T>,
  fn: (value: T) => boolean
): Iterable<T> {
  for (const el of iter) {
    if (fn(el)) yield el;
  }
}
export function find<S, T extends S>(
  gen: Iterable<S>,
  which: (x: S) => x is T
): T | undefined;
export function find<T>(
  gen: Iterable<T>,
  which: (x: T) => boolean
): T | undefined;

export function find<T>(
  iter: Iterable<T>,
  which: (x: T) => boolean
): T | undefined {
  for (const x of iter) if (which(x)) return x;
  return undefined;
}

export function first<T>(iter: Iterable<T>): T | undefined {
  for (const x of iter) return x;
}

export function* flat<T>(iter: Iterable<Iterable<T>>): Iterable<T> {
  for (const x of iter) yield* x;
}

export function* flatMap<S, T>(
  iter: Iterable<S>,
  f: (value: S) => Iterable<T>
): Iterable<T> {
  for (const el of iter) yield* f(el);
}

export function fold<T, R>(
  iter: Iterable<T>,
  f: (acc: R, x: T) => R,
  init: R
): R {
  let acc = init;
  for (const x of iter) acc = f(acc, x);
  return acc;
}

export function* map<T, R>(iter: Iterable<T>, f: (x: T) => R): Iterable<R> {
  for (const x of iter) yield f(x);
}

export function some<T>(gen: Iterable<T>, f: (x: T) => boolean): boolean {
  for (const x of gen) if (f(x)) return true;

  return false;
}

export function* unique<T>(iter: Iterable<T>, used?: Set<T>): Iterable<T> {
  used ??= new Set<T>();

  for (const el of iter) {
    if (used.has(el)) continue;
    used.add(el);
    yield el;
  }
}

export function* zip<S, T>(
  iterable1: Iterable<S>,
  iterable2: Iterable<T>
): Iterable<[S, T]> {
  const iter1 = iterable1[Symbol.iterator]();
  const iter2 = iterable2[Symbol.iterator]();
  while (true) {
    const next1 = iter1.next();
    const next2 = iter2.next();
    if (next1.done || next2.done) return;
    yield [next1.value, next2.value];
  }
}
