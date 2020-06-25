import { Enumerated, TMap } from "./typings";
import { BetterHTMLElement } from "./index.js";
export declare function enumerate<T>(obj: T): Enumerated<T>;
export declare function wait(ms: number): Promise<any>;
export declare function bool(val: any): boolean;
export declare function isArray<T>(obj: any): obj is Array<T>;
export declare function isEmptyArr(collection: any): boolean;
export declare function isEmptyObj(obj: any): boolean;
export declare function isFunction<F>(fn: F): fn is F;
export declare function isFunction(fn: (...args: any[]) => any): fn is (...args: any[]) => any;
export declare function anyDefined(obj: any): boolean;
export declare function anyTruthy(obj: any): boolean;
export declare function allUndefined(obj: any): boolean;
/**Check every `checkInterval` ms if `cond()` is truthy. If, within `timeout`, cond() is truthy, return `true`. Return `false` if time is out.
 * @example
 * // Give the user a 200ms chance to get her pointer over "mydiv". Continue immediately once she does, or after 200ms if she doesn't.
 * mydiv.pointerenter( () => mydiv.pointerHovering = true; )
 * const pointerOnMydiv = await waitUntil(() => mydiv.pointerHovering, 200, 10);*/
export declare function waitUntil(cond: () => boolean, checkInterval?: number, timeout?: number): Promise<boolean>;
export declare function isBHE<T extends BetterHTMLElement>(bhe: T, bheSubType: any): bhe is T;
export declare function isType<T>(arg: T): arg is T;
export declare function isTMap<T>(obj: TMap<T>): obj is TMap<T>;
/**true for any non-primitive, including array, function*/
export declare function isObject(obj: any): boolean;
export declare function shallowProperty<T>(key: string): (obj: T) => T extends null ? undefined : T[keyof T];
export declare function getLength(collection: any): number;
export declare function isArrayLike(collection: any): boolean;
export declare function extend(sup: any, child: any): any;
export declare function anyValue(obj: any): boolean;
export declare function equalsAny(obj: any, ...others: any[]): boolean;
export declare function noValue(obj: any): boolean;
