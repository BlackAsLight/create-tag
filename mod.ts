/** @module */

/**
 * The type inferring the attributes on a tag.
 */
export type Attribute<T extends keyof HTMLElementTagNameMap> = DeepPartial<HTMLElementTagNameMap[T]>
/**
 * The type inferring the parameter type of the tag.
 */
export type Func<T extends keyof HTMLElementTagNameMap> = (tag: HTMLElementTagNameMap[T]) => unknown

/**
 * A type like Partial, but is meant to go deep!
 */
export type DeepPartial<T> = {
	[U in keyof T]?: T[U] extends object ? DeepPartial<T[U]> : T[U]
}

/**
 * Creates a HTMLElement with correct typings.
 * @param type is the name of the HTMLElement.
 * @param attributes is the attributes of the HTMLElement.
 * @param func is a function providing the HTMLElement to manipulate.
 */
export function createTag<T extends keyof HTMLElementTagNameMap>(
	type: T,
	attributes: Attribute<T>,
	func?: Func<T>,
): HTMLElementTagNameMap[T]
/**
 * Creates a HTMLElement with correct typings.
 * @param type is the name of the HTMLElement.
 * @param func is a function providing the HTMLElement to manipulate.
 */
export function createTag<T extends keyof HTMLElementTagNameMap>(type: T, func?: Func<T>): HTMLElementTagNameMap[T]
export function createTag<T extends keyof HTMLElementTagNameMap>(
	arg1: T,
	arg2?: Attribute<T> | Func<T>,
	arg3?: Func<T>,
): HTMLElementTagNameMap[T] {
	const tag = document.createElement(arg1)
	if (typeof arg2 === 'function') {
		arg2(tag)
	} else {
		if (arg2) {
			for (const key in arg2) {
				// deno-lint-ignore no-explicit-any
				tag[key] = arg2[key] as any
			}
		}
		if (arg3) {
			arg3(tag)
		}
	}
	return tag
}
