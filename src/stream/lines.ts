import { streamToAsyncIterator } from "./to-iterable.ts";

export interface LinesParams {
  newline?: string | RegExp;
}
const defaultParams: Required<LinesParams> = {
  newline: /\r?\n/g,
};

function linesFromString(str: string, { newline }: LinesParams): string[] {
  return str.split(newline ?? defaultParams.newline);
}

function* linesFromIterable(
  iter: Iterable<string>,
  { newline }: LinesParams
): Iterable<string> {
  let buffer = "";

  for (const value of iter) {
    buffer += value;

    const lines = buffer.split(newline ?? defaultParams.newline);
    buffer = lines.pop()!;
    yield* lines;
  }

  yield buffer;
}

async function* linesFromAsyncIterable(
  iter: AsyncIterable<string>,
  { newline }: LinesParams
): AsyncIterable<string> {
  let buffer = "";

  for await (const value of iter) {
    buffer += value;

    const lines = buffer.split(newline ?? defaultParams.newline);
    buffer = lines.pop()!;
    yield* lines;
  }

  yield buffer;
}

function linesFromStream(
  stream: ReadableStream<string>,
  params: LinesParams
): AsyncIterable<string> {
  return linesFromAsyncIterable(streamToAsyncIterator(stream), params);
}

/**
 * Takes a text input and returns it line by line. The newline character
 * is configurable – by default the function matches both `\n` and `\r\n`.
 */
export function lines(it: string, params?: LinesParams): string[];
export function lines(
  it: Iterable<string>,
  params?: LinesParams
): Iterable<string>;
export function lines(
  it: AsyncIterable<string>,
  params?: LinesParams
): AsyncIterable<string>;
export function lines(
  it: ReadableStream<string>,
  params?: LinesParams
): AsyncIterable<string>;

export function lines(
  it:
    | string
    | Iterable<string>
    | AsyncIterable<string>
    | ReadableStream<string>,
  params: LinesParams = {}
): string[] | Iterable<string> | AsyncIterable<string> {
  if (typeof it === "string") return linesFromString(it, params);
  if (Symbol.iterator in it) return linesFromIterable(it, params);
  if (Symbol.asyncIterator in it) return linesFromAsyncIterable(it, params);
  return linesFromStream(it, params);
}
