import { unreachable } from "../mod.ts";

export {
  assert,
  assertEquals,
  assertThrows,
  unimplemented,
  unreachable,
} from "jsr:@std/assert@1.0.2";

export const assertNever = (_: never): never => unreachable();
