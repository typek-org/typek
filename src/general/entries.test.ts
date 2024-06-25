import {
  assertEquals,
  assertTypeEquals,
  assertTypeSatisfies,
} from "../test/mod.ts";
import { ObjectEntries } from "./entries.ts";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

Deno.test("ObjectEntries.transform", () => {
  Deno.test("company names example", () => {
    interface Person {
      name: string;
      surname: string;
    }
    const isPerson = (p: unknown): p is Person =>
      typeof p === "object" &&
      p !== null &&
      "name" in p &&
      typeof p.name === "string" &&
      "surname" in p &&
      typeof p.surname === "string";

    const joe: Person = {
      name: "Joe",
      surname: "Doe",
    };
    const peter: Person = {
      name: "Peter",
      surname: "Meter",
    };
    const company = {
      ceo: joe,
      dev: peter,
    };

    const companyNames = ObjectEntries(company)
      .deepTransform(isPerson, ({ name, surname }) => `${name} ${surname}`)
      .collect();

    assertEquals(companyNames, { ceo: "Joe Doe", dev: "Peter Meter" });
    assertTypeEquals<
      typeof companyNames,
      {
        ceo: string;
        dev: string;
      }
    >();
  });

  Deno.test("document tree example", () => {
    interface Element {
      tag: string;
      children?: Array<string | Element>;
    }

    const document = {
      tag: "root",
      children: [
        { tag: "h1", children: ["My webpage"] },
        {
          tag: "p",
          children: [
            "Welcome to my ",
            { tag: "span", children: ["cool"] },
            " web page! Make yourself at ",
            { tag: "span", children: ["home"] },
            "!",
          ],
        },
        { tag: "span", children: ["--Admin"] },
      ],
    } as const satisfies Element;

    const isSpan = (p: unknown): p is { tag: "span"; children: [string] } =>
      typeof p === "object" && p !== null && "tag" in p && p.tag === "span";

    const unwrappedDocument = ObjectEntries(document)
      .deepTransform(isSpan, ({ children }) => children[0])
      .collect();

    assertEquals(unwrappedDocument, {
      tag: "root",
      children: [
        { tag: "h1", children: ["My webpage"] },
        {
          tag: "p",
          children: [
            "Welcome to my ",
            "cool",
            " web page! Make yourself at ",
            "home",
            "!",
          ],
        },
        "--Admin",
      ],
    });

    // Can't have better types before this is implemented:
    // https://github.com/microsoft/TypeScript/issues/58779
    assertTypeSatisfies<
      typeof unwrappedDocument,
      {
        tag: "root";
        children: [
          { tag: "h1"; children: ["My webpage"] },
          {
            tag: "p";
            children: [
              "Welcome to my ",
              string,
              " web page! Make yourself at ",
              string,
              "!"
            ];
          },
          string
        ];
      }
    >();
  });
});

Deno.test("ObjectEntries.async", () => {
  Deno.test("delays example", async () => {
    const u1 = delay(100);
    const u2 = delay(200);
    const u5 = delay(500);

    const personLoading = {
      name: u1.then(() => <const>"Joe"),
      surname: <const>"Mama",
      children: u1.then(
        () =>
          <const>[
            "Banana Joie",
            u2.then(() => <const>"Gorilla Guy"),
            u5.then(() => <const>"Bonobo Billy"),
          ]
      ),
      rabbitHole: {
        deeper: {
          evenDeeper: u1.then(() => <const>"A Rabbit!"),
        },
      },
    };

    const personExpected = {
      name: <const>"Joe",
      surname: <const>"Mama",
      children: <const>["Banana Joie", "Gorilla Guy", "Bonobo Billy"],
      rabbitHole: { deeper: { evenDeeper: <const>"A Rabbit!" } },
    };

    const person = await ObjectEntries(personLoading).deepAwait().collect();

    assertEquals(person, personExpected);
    assertTypeEquals<typeof person, typeof personExpected>();
  });
});
