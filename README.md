# CreateTag

A tiny, fully-typed helper for building DOM elements: set attributes, append children, and wire up event listeners in a single
call, with the return type inferred from the tag name you pass in.

```ts
import { createTag } from "@doctor/create-tag";

const greeting = createTag("p", { textContent: "Hello World!" });
console.log(greeting.outerHTML);
// <p>Hello World!</p>
```

This package is designed to work in the browser, but works anywhere a global `document` is available — for example, server-side
environments using [jsdom](https://github.com/jsdom/jsdom).

## Why

Creating an element by hand usually takes several statements — `createElement`, then a property assignment per attribute, then
`append` for each child, then `addEventListener`. `createTag` collapses that into one expression, and TypeScript infers the
concrete element type (`HTMLInputElement`, `HTMLAnchorElement`, etc.) from the tag name, so no casting is needed:

```ts
const input = createTag("input", { type: "email", placeholder: "you@example.com" });
input.select(); // input is typed as HTMLInputElement automatically
```

## Usage

`createTag` always takes the tag name first, followed by any combination of three optional pieces, in this order:
**attributes**, **children**, **setup callback**.

**Just a tag**

```ts
createTag("div");
```

**With attributes** — sets properties directly on the element (`el.textContent = ...`, not `setAttribute`):

```ts
createTag("a", { href: "/home", textContent: "Home" });
```

**With children:**

```ts
createTag("ul", [
  createTag("li", { textContent: "One" }),
  createTag("li", { textContent: "Two" }),
]);
```

**With attributes and children:**

```ts
createTag("a", { href: "/home" }, [createTag("br")]);
```

**With a setup callback** — runs last, after any attributes/children have been applied, right before the element is returned.
Use it for anything that isn't a plain property assignment:

```ts
createTag("button", { textContent: "Click me" }, (button) => {
  button.addEventListener("click", () => console.log("clicked!"));
});
```

**All together:**

```ts
createTag("a", { href: "/home", textContent: "Home" }, [createTag("br")], (a) => {
  a.addEventListener("click", (event) => event.preventDefault());
});
```

## Attributes

Not every property can be passed in the `attributes` object — only ones `createTag` can safely assign with a plain
`element[key] = value`:

- The property must be **writable**. Read-only properties like `tagName` or `nodeType` are rejected at compile time.
- The property's value must be a `string`, `number`, `boolean`, or `null`. Complex properties like `style` or `classList` aren't
  supported this way.
