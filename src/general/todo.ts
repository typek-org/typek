export class NotImplementedError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export const todo = (title?: string): never => {
  throw new NotImplementedError(
    title === undefined
      ? `Feature not implemented yet.`
      : `Feature "${title}" is not implemented yet.`,
  );
};
