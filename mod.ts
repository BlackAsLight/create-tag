/**
 * @module
 *
 * A small typed wrapper around `document.createElement` that lets you set
 * attributes, append children, and run setup code (e.g. attach event
 * listeners) in a single call, with return types inferred from the tag name.
 */

/**
 * Helper type that resolves to the keys of `T` whose properties are writable
 * (i.e. not `readonly` / getter-only). Used to strip DOM properties like
 * `tagName` or `nodeType` out of {@linkcode Attributes}, since those can never
 * actually be assigned at runtime.
 */
export type WritableKeys<T> = {
  [P in keyof T]-?: (<F>() => F extends { [Q in P]: T[P] } ? 1 : 2) extends
    (<F>() => F extends { -readonly [Q in P]: T[P] } ? 1 : 2) ? P : never;
}[keyof T];

/**
 * A type for a given HTML tag name that filters its properties down to the
 * ones that {@linkcode createTag} can actually assign: writable properties
 * whose value is a `string`, `number`, `boolean`, or `null`.
 *
 * Properties that are read-only at runtime (e.g. `tagName`, `nodeType`) or
 * whose value is a more complex type (e.g. `style`, `classList`, event
 * handler properties) are excluded.
 *
 * Any key omitted is left at the element's default value. A key
 * explicitly set to `undefined` or `null` is treated the same way and skipped.
 *
 * @typeParam T A tag name key of {@linkcode HTMLElementTagNameMap}, e.g.
 * `'div'` or `'input'`.
 *
 * @example Usage
 * ```ts
 * type InputAttributes = Attributes<'input'>;
 * // e.g. { value?: string; checked?: boolean; disabled?: boolean; ... }
 * ```
 */
export type Attributes<T extends keyof HTMLElementTagNameMap> = Partial<
  {
    [
      U in WritableKeys<HTMLElementTagNameMap[T]> as HTMLElementTagNameMap[T][U] extends (string | number | boolean | null) ? U
        : never
    ]: HTMLElementTagNameMap[T][U];
  }
>;

/**
 * A callback that {@linkcode createTag} invokes with the fully-constructed
 * element as its only argument, immediately before returning it. Any
 * attributes and children passed to `createTag` have already been applied
 * by the time this runs.
 *
 * It's typically used for side effects that don't fit into a plain
 * attributes object, most commonly attaching event listeners. Its return
 * value is ignored.
 *
 * @typeParam T A tag name key of {@linkcode HTMLElementTagNameMap}, e.g.
 * `'div'` or `'input'`.
 *
 * @example Usage
 * ```ts
 * type InputFunc = Func<'input'>;
 * ```
 */
export type Func<T extends keyof HTMLElementTagNameMap> = (tag: HTMLElementTagNameMap[T]) => unknown;

/**
 * Creates an HTML element and appends the given children to it.
 *
 * @param type A string containing the name of the HTML element to create.
 * @param children Elements to append to the new element, in order.
 * @param func An optional callback invoked with the created element after
 * the children have been appended, right before it's returned.
 * @returns The newly created element.
 *
 * @example Usage
 * ```ts
 * createTag(
 *   'ul',
 *   [
 *     createTag('li', { textContent: 'One' }),
 *     createTag('li', { textContent: 'Two' }),
 *   ],
 * );
 * ```
 */
export function createTag<T extends keyof HTMLElementTagNameMap>(
  type: T,
  children: (HTMLElement | string)[],
  func?: Func<T>,
): HTMLElementTagNameMap[T];

/**
 * Creates an HTML element and assigns the given attributes to it.
 *
 * @param type A string containing the name of the HTML element to create.
 * @param attributes An object of property/value pairs to assign to the
 * element. Only `string`, `number`, or `boolean` valued, writable
 * properties are accepted (see {@linkcode Attributes}).
 * @param func An optional callback invoked with the created element after
 * the attributes have been assigned, right before it's returned.
 * @returns The newly created element.
 *
 * @example Usage
 * ```ts
 * createTag(
 *   'button',
 *   { textContent: 'Click Me!' },
 *   buttonTag => buttonTag.addEventListener('click', function (_event) {
 *     console.log(this.outerHTML);
 *   }),
 * )
 *   .click();
 * ```
 */
export function createTag<T extends keyof HTMLElementTagNameMap>(
  type: T,
  attributes: Attributes<T>,
  func?: Func<T>,
): HTMLElementTagNameMap[T];

/**
 * Creates an HTML element, assigns the given attributes to it, and appends
 * the given children.
 *
 * @param type A string containing the name of the HTML element to create.
 * @param attributes An object of property/value pairs to assign to the
 * element. Only `string`, `number`, or `boolean`, valued, writable
 * properties are accepted (see {@linkcode Attributes}).
 * @param children Elements to append to the new element, in order.
 * @param func An optional callback invoked with the created element after
 * the children have been appended, right before it's returned.
 * @returns The newly created element.
 *
 * @example Usage
 * ```ts
 * createTag(
 *   'a',
 *   { href: '/home', textContent: 'Bye' },
 *   [createTag('br')],
 *   aTag => aTag.addEventListener('click', event => event.preventDefault()),
 * );
 * ```
 */
export function createTag<T extends keyof HTMLElementTagNameMap>(
  type: T,
  attributes: Attributes<T>,
  children: (HTMLElement | string)[],
  func?: Func<T>,
): HTMLElementTagNameMap[T];

/**
 * Creates a bare HTML element, optionally running a callback against it.
 *
 * @param type A string containing the name of the HTML element to create.
 * @param func An optional callback invoked with the created element, right
 * before it's returned.
 * @returns The newly created element.
 *
 * @example Usage
 * ```ts
 * createTag(
 *   'button',
 *   buttonTag => buttonTag.addEventListener('click', function (_event) {
 *     console.log("I've been clicked!");
 *   }),
 * );
 * ```
 */
export function createTag<T extends keyof HTMLElementTagNameMap>(type: T, func?: Func<T>): HTMLElementTagNameMap[T];

export function createTag<T extends keyof HTMLElementTagNameMap>(
  arg1: T,
  arg2?: Attributes<T> | (HTMLElement | string)[] | Func<T>,
  arg3?: (HTMLElement | string)[] | Func<T>,
  arg4?: Func<T>,
): HTMLElementTagNameMap[T] {
  const tag = document.createElement(arg1);

  if (typeof arg2 === "function") {
    arg2(tag);
  } else if (arg2 instanceof Array) {
    for (const child of arg2) tag.append(child);
  } else if (arg2 instanceof Object) {
    for (const [key, value] of Object.entries(arg2)) {
      if (value != null) tag[key as "id"] = value as string;
    }
  }

  if (typeof arg3 === "function") {
    arg3(tag);
  } else if (arg3 instanceof Array) {
    for (const child of arg3) tag.append(child);
  }

  if (typeof arg4 === "function") {
    arg4(tag);
  }

  return tag;
}
