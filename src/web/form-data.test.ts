import { assert, assertEquals } from "../mod.ts";
import { FormData } from "./form-data.ts";

Deno.test("from object", () => {
  const data = FormData.from({
    name: "John",
    surname: "Doe",
    pets: ["cat", "dog"],
  });

  assert(data.has("name"));
  assert(data.has("surname"));
  assert(data.has("pets"));

  assertEquals(data.get("name"), "John");
  assertEquals(data.get("surname"), "Doe");
  assertEquals(data.get("pets"), "cat");
  assertEquals(data.getAll("pets"), ["cat", "dog"]);
});

Deno.test("from array", () => {
  const data = FormData.from([
    ["name", ["Erich", "Maria"]],
    ["surname", "Remarque"],
    ["book", "All Quiet on the Western Front"],
    ["book", "Three Comrades"],
    ["book", "Flotsam"],
  ]);

  assertEquals(data.getAll("name"), ["Erich", "Maria"]);
  assertEquals(data.getAll("surname"), ["Remarque"]);
  assertEquals(data.getAll("book"), [
    "All Quiet on the Western Front",
    "Three Comrades",
    "Flotsam",
  ]);
});

Deno.test("entries", () => {
  const data = FormData.from({
    nick: "Nick1",
    password: "12345",
    previousPasswords: ["p4ss", "pass", ""],
  });

  assertEquals(FormData.entries(data), [
    ["nick", "Nick1"],
    ["password", "12345"],
    ["previousPasswords", "p4ss"],
    ["previousPasswords", "pass"],
    ["previousPasswords", ""],
  ]);
});
