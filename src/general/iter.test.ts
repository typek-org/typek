import { assertEquals } from "../mod.ts";
import { windows } from "./iter.ts";

Deno.test("windows", () => {
  assertEquals(
    [...windows(2, "hello")],
    [
      ["h", "e"],
      ["e", "l"],
      ["l", "l"],
      ["l", "o"],
    ]
  );

  assertEquals(
    [...windows(3, "hello")],
    [
      ["h", "e", "l"],
      ["e", "l", "l"],
      ["l", "l", "o"],
    ]
  );
});
