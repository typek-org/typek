import { isObject, isPlainObject } from "./is.ts";

export const isNode = (x: unknown): x is Node =>
  isObject(x) &&
  typeof (x as any).nodeType === "number" &&
  typeof (x as any).nodeName === "string" &&
  !isPlainObject(x);

export const isElement = (x: unknown): x is Element =>
  isNode(x) && x.nodeType === 1;
