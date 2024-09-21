/**
 * Converts an AbortSignal into a Promise which never resolves, but rejects
 * once the abort signal aborts.
 */
export function abortSignalToPromise(signal: AbortSignal): Promise<never> {
  return new Promise((_, reject) => {
    const callback = () => {
      try {
        signal.throwIfAborted();
      } catch (e) {
        reject(e);
      }
      signal.removeEventListener("abort", callback);
    };
    signal.addEventListener("abort", callback);
  });
}
