import { unreachable } from "../mod.ts";

export {
  assert,
  assertEquals,
  assertThrows,
  unimplemented,
  unreachable,
} from "jsr:@std/assert@0.226";

export const assertNever = (_: never): never => unreachable();
