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
// for each event ("click"), create a `(event: MouseEvent) => void` function.
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

function b<K extends TEvent>(d: TEventFunctionMap<K>) {

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
type QuerySelector<K extends HTMLTag | string = HTMLTag | string> = K extends HTMLTag ? K : string;

const foo = <K extends HTMLTag>(tag: K) => document.createElement(tag);

const baz = <K extends HTMLTag | string>(query: K) => document.querySelector(query);

const bar = <K extends HTMLTag | string>(query: QuerySelector<K>) => document.querySelector(query);

interface BHETag2BHEMap {
    "div": Div,
    "a": Anchor,
    "p": Paragraph,
    "img": Img,
    "input": Input,
    "button": Button,
    "span": Span,
}

type BHETag = keyof BHETag2BHEMap;
type BHE = { [K in keyof BHETag2BHEMap]: BHETag2BHEMap[K] }

type Tag2BHE<K extends BHETag> =
    K extends "div" ? Div :
        K extends "a" ? Anchor :
            K extends "p" ? Paragraph :
                K extends "img" ? Img :
                    K extends "input" ? Input :
                        K extends "button" ? Button :
                            K extends "span" ? Span : BetterHTMLElement


// type ChildrenObj = TMap<HTMLElementType> | TRecMap<HTMLElementType>
type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>
type Enumerated<T> =
    T extends (infer U)[] ? [number, U][]
        : T extends TMap<(infer U)> ? [keyof T, U][]
        : T extends boolean ? never : any;
type TReturnBoolean = (s: string) => boolean;
type AnyFunction = (...args: any[]) => any;
