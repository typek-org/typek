# typek
_Typek_ is a collection of useful, runtime-agnostic functions and types,
serving as something of a standard library for TypeScript.

We have assertions and type assertions for unit testing, methods for
transformations of iterables, and even ways of mapping entire objects
in a type-safe manner.

### examples
```ts
Array.from(unique("Hello world!")).join("") // Helo wrd!

const company = {
  ceo: { name: "Joe", surname: "Doe" },
  dev: { name: "Peter", surname: "Meter" },
};
ObjectEntries
  .from(company)
  .deepTransform(isPerson, ({name, surname}) => `${name} ${surname}`)
  .collect()
// { ceo: "Joe Doe", dev: "Peter Meter" }

assertTypeEquals<string | 42, string | 42>(); // ok!
assertTypeEquals<any, string | 42>(); // fail!
```

### roadmap
 * [ ] Properly document and test all current functionality
 * [ ] Match core functionality of [utility-types](https://github.com/piotrwitek/utility-types), [ts-toolbelt](https://github.com/millsp/ts-toolbelt) and [typescript-tuple](https://github.com/ksxnodemodules/typescript-tuple)
 * [ ] Match core functionality of [lodash](https://lodash.com/) and [typedash](https://jsr.io/@typedash/typedash)
 * [ ] Match functionality of [@type/is](https://jsr.io/@type/is)
 