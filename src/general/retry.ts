import { abortSignalToPromise, delay } from "../mod.ts";

export class AggregateError extends Error {
  constructor(message: string, public readonly causes: unknown[]) {
    super(message, { cause: causes.at(-1) });
  }
}

/**
 * Provided a falible function, try to run it at most `count` times,
 * returning its result on the first success, retrying on failure.
 */
export function retrySync<T>(count: number, action: () => T): T {
  if (count < 1) {
    throw TypeError(
      `Invalid attempt count: ${count}. At least one attempt must be made.`
    );
  }
  const errors: unknown[] = [];
  for (let i = 0; i < count; i++) {
    try {
      return action();
    } catch (e) {
      errors.push(e);
    }
  }
  throw new AggregateError(`Retrying failed ${count} times.`, errors);
}

export interface RetryOptions {
  /** The number of attempts. To retry indefinitely, use `Infinity`. */
  count: number;

  /** The number of milliseconds to wait before retrying. */
  delay?: number;

  /** On each subsequent retry, multiply the delay by this number. */
  exponentialBackoff?: number;

  /**
   * An abort signal which, once dispatched, causes the function to throw
   * immediately and
   */
  signal?: AbortSignal;
}

export interface RetryParams {
  signal: AbortSignal;
}

/**
 * Provided a falible asynchronous function, try to run it at most `count` times,
 * returning its result on the first success, retrying on failure. You can optionally
 * add a delay before each retry.
 */
export async function retry<T>(
  options: RetryOptions | number,
  action: (params: RetryParams) => T | Promise<T>
): Promise<T> {
  if (typeof options === "number") options = { count: options };
  const { count, exponentialBackoff } = options;
  let { delay: ms } = options;

  if (count < 1) {
    throw TypeError(
      `Invalid attempt count: ${count}. At least one attempt must be made.`
    );
  }

  // create an abort controler for each subsequent action
  let actionAbortController = new AbortController();

  // listen to the abort signal of the entire sequence
  options.signal?.addEventListener(
    "abort",
    () => actionAbortController.abort() // abort action
  );

  const errors: unknown[] = [];
  for (let i = 0; i < count; i++) {
    try {
      const { signal } = actionAbortController;
      // wait until the action finishes or is aborted; return on success
      return await Promise.race([
        action({ signal }),
        abortSignalToPromise(signal),
      ]);
    } catch (e) {
      // remember the error
      errors.push(e);

      // if the entire sequence was aborted, throw
      options.signal?.throwIfAborted();

      // abort the current action, then create a new controller for the next action
      actionAbortController.abort();
      actionAbortController = new AbortController();

      // optionally delay before retrying
      if (ms) {
        await delay(ms);
        if (exponentialBackoff) ms *= exponentialBackoff;
      }
    }
  }

  // too many failures, not retrying again
  throw new AggregateError(`Retrying failed ${count} times.`, errors);
}
