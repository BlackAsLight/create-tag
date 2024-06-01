/**
 * @module
 */

/**
 * A type for a given HTMLElement that filters the available attributes to
 * values of type string, number, or boolean.
 *
 * @example Usage
 * ```ts
 * type InputAttributes = Attributes<'input'>
 * ```
 */
export type Attributes<T extends keyof HTMLElementTagNameMap> = Partial<
	{
		[
			U in keyof HTMLElementTagNameMap[T] as HTMLElementTagNameMap[T][U] extends string | number | boolean | null ? U
				: never
		]: HTMLElementTagNameMap[T][U]
	}
>

/**
 * A type specifying the structure of the function that can be passed to the
 * createTag element.
 *
 * @example Usage
 * ```ts
 * type InputFunc = Func<'input'>
 * ```
 */
export type Func<T extends keyof HTMLElementTagNameMap> = (tag: HTMLElementTagNameMap[T]) => unknown

/**
 * A function that creates a HTMLElement with the correct typings.
 *
 * @param type A string containing the name of the HTML element to be created.
 * @param attributes An object containing the key-value pairs of attributes to
 * be assigned to the HTML element. Only string, number, and boolean values are
 * valid.
 * @param func An optional function that passes the created HTML element as a
 * parameter before resolving the function.
 * @returns A HTML element based off what was specified in type.
 *
 * @example Usage
 * ```ts
 * createTag('button', { textContent: 'Click Me!' }, buttonTag =>
 *   buttonTag.addEventListener('click', function (_event) {
 *     console.log(this.outerHTML)
 *   })).click()
 * ```
 */
export function createTag<T extends keyof HTMLElementTagNameMap>(
	type: T,
	attributes: Attributes<T>,
	func?: Func<T>,
): HTMLElementTagNameMap[T]
/**
 * A function that creates a HTMLElement with the correct typings.
 *
 * @param type A string containing the name of the HTML element to be created.
 * @param func An optional function that passes the created HTML element as a
 * parameter before resolving the function.
 * @returns A HTML element based off what was specified in type.
 *
 * @example Usage
 * ```ts
 * createTag('button', buttonTag =>
 *   buttonTag.addEventListener('click', function (_event) {
 *     console.log("I've been clicked!")
 *   }))
 * ```
 */
export function createTag<T extends keyof HTMLElementTagNameMap>(type: T, func?: Func<T>): HTMLElementTagNameMap[T]
export function createTag<T extends keyof HTMLElementTagNameMap>(
	arg1: T,
	arg2?: Attributes<T> | Func<T>,
	arg3?: Func<T>,
): HTMLElementTagNameMap[T] {
	const tag = document.createElement(arg1)
	if (typeof arg2 === 'function') {
		arg2(tag)
	} else if (arg2) {
		for (const [key, value] of Object.entries(arg2)) {
			if (value != null) {
				tag[key as 'id'] = value as string
			}
		}
		if (arg3) {
			arg3(tag)
		}
	}
	return tag
}
