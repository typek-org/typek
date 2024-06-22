/**
 * Create a new promise that resolves in the given amount
 * of milliseconds.
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));
