// TODO: why <EventName> needed in allOff()?
import {BetterHTMLElement} from "../index";

export interface TMap<T> {
    [s: string]: T;

    [s: number]: T
}

export interface TRecMap<T> {
    [s: string]: T | TRecMap<T>;

    [s: number]: T | TRecMap<T>
}

// type IMap<T> = {
//     [s in keyof T]: T
// }


// type EventNameFunctionMapOrig<E extends EventName> = {
//     [P in E]?: (event: HTMLElementEventMap[P]) => void;
// }[E];
//
// type EventNameFunctionMap2<E extends EventName> = E extends EventName ? (event: HTMLElementEventMap[E]) => void : never;
// type EventNameFunctionMap3 = {
//     [P in EventName]?: (event: HTMLElementEventMap[P]) => void;
// }
// type EventNameFunctionMap4<E extends EventName> = {
//     [P in EventName]?: (event: HTMLElementEventMap[P]) => void;
// }
export type EventName = keyof HTMLElementEventMap;
// EventName2Function<"click"> → function(event: MouseEvent) { }
export type EventName2Function<E extends EventName = EventName> = {
    [P in EventName]?: (event: HTMLElementEventMap[P]) => void;
}[E]
// e.g. { "mouseover" : MouseEvent, ... }
export type MapOfEventName2Function = Partial<Record<keyof HTMLElementEventMap, EventName2Function>>


/*type MouseOverFunction = EventName2Function<"mouseover">;


function expectsMouseEventFunction(fn: (event: MouseEvent) => void) {

}

const mouseEventFunction: MouseOverFunction = (event: MouseEvent) => {
};

expectsMouseEventFunction(mouseEventFunction);

function expectsMouseEventFunctionPairs(pairs: MapOfEventName2Function) {
    for (let [evName, evFn] of Object.entries(pairs)) {
        expectsMouseEventFunction(evFn)
    }

}

const pairs: MapOfEventName2Function = {"mouseover": mouseEventFunction};
expectsMouseEventFunctionPairs(pairs);*/


// // HTMLTag2HTMLElement<"a"> → HTMLAnchorElement
// type HTMLTag2HTMLElement<K extends keyof HTMLElementTagNameMap> = {
//     [P in K]: HTMLElementTagNameMap[P]
// }[K]
//
// // HTMLTag2HTMLElement2["a"] → HTMLAnchorElement
// type HTMLTag2HTMLElement2 = {
//     [P in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[P]
// }
//
// // const a: HTMLTag2HTMLElement<"a"> = undefined;
// // const b: HTMLTag2HTMLElement2["a"] = undefined;


/**
 * "a", "div"
 * @example
 * const foo = <K extends Tag>(tag: K) => document.createElement(tag);
 * foo("a") → HTMLAnchorElement
 * foo("BAD") // error
 */
export type Tag = Exclude<keyof HTMLElementTagNameMap, "object">;
export type NotTag<T extends Tag> = Exclude<Tag, T>;
// /**
//  *"a", "div", "gilad".
//  *Tag2Element expects a tag and returns an HTMLElement.
//  *@example
//  *const baz = <K extends Tag | string>(query: K) => document.querySelector(query);
//  *baz("div") → HTMLDivElement
//  *baz("diva") → HTMLSelectElement | HTMLLegendElement | ...
//  */
// type Tag2Element<K extends Tag = Tag> = K extends Tag ? HTMLElementTagNameMap[K] : HTMLElementTagNameMap[Tag]
export type TagOrString = Tag | string;
/**
 * "a", "div", "gilad".
 * QuerySelector expects a tag and returns a Tag.
 * @example
 * const bar = <K extends Tag | string>(query: QuerySelector<K>) => document.querySelector(query);
 * bar("a") → HTMLAnchorElement
 * bar("gilad") → HTMLSelectElement | HTMLLegendElement | ...
 */
export type QuerySelector<K extends TagOrString = TagOrString> = K extends Tag ? K : string;

// const foo = <K extends Tag>(tag: K) => document.createElement(tag);

// const baz = <K extends Tag | string>(query: K) => document.querySelector(query);

// const bar = <K extends Tag | string>(query: QuerySelector<K>) => document.querySelector(query);

// Tag2BHE["a"] → Anchor
/*
export interface Tag2BHE {
    "img": Img,
    "a": Anchor,
    "input": Input<HTMLInputElement>,
    "div": Div,
    "p": Paragraph,
    "button": Button,
    "span": Span,
}
*/


// type BHETag = keyof Tag2BHE;
// type BHEHTMLElement =
//     HTMLAnchorElement |
//     HTMLInputElement |
//     HTMLImageElement |
//     HTMLParagraphElement |
//     HTMLDivElement |
//     HTMLButtonElement |
//     HTMLSpanElement;
//
// type StdBHEHTMLElement =
//     HTMLParagraphElement |
//     HTMLDivElement |
//     HTMLButtonElement |
//     HTMLSpanElement

export type Element2Tag<T> =
    T extends HTMLInputElement ? "input"
        : T extends HTMLAnchorElement ? "a"
        : T extends HTMLImageElement ? "img"
            : Tag

// type MapValues<T> = { [K in keyof T]: T[K] }[keyof T];

// HTMLDivElement, ...
// type HTMLElements = MapValues<HTMLElementTagNameMap>;
// type Filter<T> = T extends HTMLElements ? T : never;
// type GenericFilter<T, U> = T extends U ? T : never;

// const what: Element2Tag<HTMLDivElement> = undefined;
// const what: Filter<HTMLInputElement, HTMLElements> = undefined;
// const what: Filter<HTMLInputElement> = undefined;
// const what: Element2Tag<HTMLAnchorElement> = undefined;


// type ChildrenObj = TMap<Tag2Element> | TRecMap<Tag2Element>
// type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>
export type ChildrenObj = TRecMap<QuerySelector | BetterHTMLElement | typeof BetterHTMLElement>
export type Enumerated<T> =
    T extends (infer U)[] ? [number, U][]
        : T extends TRecMap<(infer U)> ? [keyof T, U][]
        : T extends boolean ? never : any;
export type Returns<T> = (s: string) => T;
export type TReturnBoolean = (s: string) => boolean;
export type AnyFunction = (...args: any[]) => any;


export type Callable<T1, T2, F> = F extends (a1: T1, a2: T2) => infer R ? R : any;
export type Callable2<T1, F> = F extends (a1: T1, a2: HTMLElement) => infer R ? R : any;

