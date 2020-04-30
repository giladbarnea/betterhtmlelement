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
type HTMLTag = Exclude<keyof HTMLElementTagNameMap, "object">;
/**
 * "a", "div", "gilad".
 * HTMLElementType "expects" a tag and "returns" an HTMLElement;
 * QuerySelector "expects" a tag and "returns" a HTMLTag.
 * @example
 * const baz = <K extends HTMLTag | string>(query: K) => document.querySelector(query);
 * baz("div") → HTMLDivElement
 * baz("diva") → HTMLSelectElement | HTMLLegendElement | ...
 */
type HTMLElementType<K = HTMLTag> = K extends HTMLTag ? HTMLElementTagNameMap[K] : HTMLElementTagNameMap[HTMLTag];
/**
 * "a", "div", "gilad".
 * HTMLElementType "expects" a tag and "returns" an HTMLElement;
 * QuerySelector "expects" a tag and "returns" a HTMLTag.
 * @example
 * const bar = <K extends HTMLTag | string>(query: QuerySelector<K>) => document.querySelector(query);
 * bar("a") → HTMLAnchorElement
 * bar("gilad") → HTMLSelectElement | HTMLLegendElement | ...
 */
type QuerySelector<K = HTMLTag> = K extends HTMLTag ? K : string;

const foo = <K extends HTMLTag>(tag: K) => document.createElement(tag);

const baz = <K extends HTMLTag | string>(query: K) => document.querySelector(query);

const bar = <K extends HTMLTag | string>(query: QuerySelector<K>) => document.querySelector(query);

type Tag2BHE<K extends HTMLTag> =
    K extends "div" ? Div :
        K extends "a" ? Anchor :
            K extends "p" ? Paragraph :
                K extends "img" ? Img :
                    K extends "input" ? Input :
                        K extends "button" ? Button :
                            K extends "span" ? Span : BetterHTMLElement

type HTMLElement2Tag<T extends HTMLElement> =
    T extends HTMLInputElement ? "input"
        : T extends HTMLAnchorElement ? "a"
        : T extends HTMLDivElement ? "div"
            : T extends HTMLParagraphElement ? "p"
                : T extends HTMLSpanElement ? "span"
                    : T extends HTMLButtonElement ? "button"
                        : T extends HTMLImageElement ? "img"
                            : never;

type ChildrenObj = TMap<HTMLElementType> | TRecMap<HTMLElementType>
// type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>
type Enumerated<T> =
    T extends (infer U)[] ? [number, U][]
        : T extends TMap<(infer U)> ? [keyof T, U][]
        : T extends boolean ? never : any;
type TReturnBoolean = (s: string) => boolean;
type AnyFunction = (...args: any[]) => any;
