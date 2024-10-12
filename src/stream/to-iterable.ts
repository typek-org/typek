/**
 * Takes a `ReadableStream`, locks it and returns an `AsyncIterable` over the same values.
 * @see https://jakearchibald.com/2017/async-iterators-and-generators/#making-streams-iterate
 */
export async function* streamToAsyncIterator<T>(
  stream: ReadableStream<T>
): AsyncIterable<T> {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
