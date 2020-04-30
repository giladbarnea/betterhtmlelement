// TODO: why <TEvent> needed in allOff()?
interface TMap<T> {
    [s: string]: T;

    [s: number]: T
}

interface TRecMap<T> {
    [s: string]: T | TRecMap<T>;

    [s: number]: T | TRecMap<T>
}


type TEvent = keyof HTMLElementEventMap;
type TEventFunctionMap<K extends TEvent> = {
    [P in K]?: (event: HTMLElementEventMap[P]) => void;
};
/**
 * "a", "div"
 * @example
 * const foo = <K extends HTMLTag>(tag: K) => document.createElement(tag);
 * foo("a") → HTMLAnchorElement
 * foo("BAD") // error
 */
type HTMLTag = keyof HTMLElementTagNameMap;

type HTMLElementType<K> = K extends HTMLTag ? HTMLElementTagNameMap[K] : any;
/**
 * "a", "div", "gilad"
 * @example
 * const bar = <K extends HTMLTag | string>(query: QuerySelector<K>) => document.querySelector(query);
 * bar("a") → HTMLAnchorElement
 * bar("gilad") → HTMLSelectElement | HTMLLegendElement | ...
 */
type QuerySelector<K = HTMLTag> = K extends HTMLTag ? K : string;

function foo<K extends HTMLTag>(tag: K) {
    return document.createElement(tag);
}

function bar<K extends HTMLTag | string>(query: QuerySelector<K>): K extends HTMLTag ? HTMLElementTagNameMap[K] : any {
    return document.querySelector(query);
}

bar("a");
type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>
type Enumerated<T> =
    T extends (infer U)[] ? [number, U][]
        : T extends TMap<(infer U)> ? [keyof T, U][]
        : T extends boolean ? never : any;
type TReturnBoolean = (s: string) => boolean;
type AnyFunction = (...args: any[]) => any;
