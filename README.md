# CreateTag

createTag is a simple function offering a simple way to create tags with dynamic properties in your code.

This package is designed to work in the browser, but should work anywhere that there is a global `document` variable.

```ts
import { createTag } from '@doctor/create-tag'

console.log(createTag('p', { textContent: 'Hello World!' }).outerHTML)
```
