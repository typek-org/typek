/**
 * Create a new promise that resolves in the given amount
 * of milliseconds.
 */
export const delay = (ms: number) =>
  new Promise<void>((res) => setTimeout(res, ms));
