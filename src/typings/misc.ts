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

type A<K extends keyof HTMLElementTagNameMap> = {
    [P in K]: HTMLElementTagNameMap[P]
}[K]

type B = {
    [P in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[P]
}

const a: A<"a"> = undefined;

function c(d: HTMLAnchorElement) {

}

c(a);

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
type HTMLElementType<K extends HTMLTag = HTMLTag> = K extends HTMLTag ? HTMLElementTagNameMap[K] : HTMLElementTagNameMap[keyof HTMLElementTagNameMap];
/**
 * "a", "div", "gilad".
 * HTMLElementType "expects" a tag and "returns" an HTMLElement;
 * QuerySelector "expects" a tag and "returns" a HTMLTag.
 * @example
 * const bar = <K extends HTMLTag | string>(query: QuerySelector<K>) => document.querySelector(query);
 * bar("a") → HTMLAnchorElement
 * bar("gilad") → HTMLSelectElement | HTMLLegendElement | ...
 */
type QuerySelector<K extends HTMLTag | string> = K extends HTMLTag ? K : string;

const foo = <K extends HTMLTag>(tag: K) => document.createElement(tag);

const baz = <K extends HTMLTag | string>(query: K) => document.querySelector(query);

const bar = <K extends HTMLTag | string>(query: QuerySelector<K>) => document.querySelector(query);
type BHETag =
    "div" |
    "a" |
    "p" |
    "img" |
    "input" |
    "button" |
    "span"
type BHETag2HTMLElement<K extends BHETag> = K extends "div" ? Div :
    K extends "a" ? HTMLAnchorElement :
        K extends "p" ? HTMLParagraphElement :
            K extends "img" ? HTMLImageElement :
                K extends "input" ? HTMLInputElement :
                    K extends "button" ? HTMLButtonElement :
                        K extends "span" ? HTMLSpanElement : never
type Tag2BHE<K extends BHETag> =
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
            : T extends HTMLImageElement ? "img"
                : T extends HTMLParagraphElement ? "p"
                    : T extends HTMLButtonElement ? "button"
                        : T extends HTMLSpanElement ? "span"
                            : never;

// type ChildrenObj = TMap<HTMLElementType> | TRecMap<HTMLElementType>
type ChildrenObj = TMap<QuerySelector<HTMLTag | string>> | TRecMap<QuerySelector<HTMLTag | string>>
type Enumerated<T> =
    T extends (infer U)[] ? [number, U][]
        : T extends TMap<(infer U)> ? [keyof T, U][]
        : T extends boolean ? never : any;
type TReturnBoolean = (s: string) => boolean;
type AnyFunction = (...args: any[]) => any;
