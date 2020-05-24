interface TMap<T> {
    [s: string]: T;
    [s: number]: T;
}
interface TRecMap<T> {
    [s: string]: T | TRecMap<T>;
    [s: number]: T | TRecMap<T>;
}
declare type EventName = keyof HTMLElementEventMap;
declare type EventName2Function<E extends EventName = EventName> = {
    [P in EventName]?: (event: HTMLElementEventMap[P]) => void;
}[E];
declare type MapOfEventName2Function = Partial<Record<keyof HTMLElementEventMap, EventName2Function>>;
declare type MouseOverFunction = EventName2Function<"mouseover">;
declare function expectsMouseEventFunction(fn: (event: MouseEvent) => void): void;
declare const mouseEventFunction: MouseOverFunction;
declare function expectsMouseEventFunctionPairs(pairs: MapOfEventName2Function): void;
declare const pairs: MapOfEventName2Function;
declare type Tag = Exclude<keyof HTMLElementTagNameMap, "object">;
declare type NotTag<T extends Tag> = Exclude<Tag, T>;
declare type TagOrString = Tag | string;
declare type QuerySelector<K extends TagOrString = TagOrString> = K extends Tag ? K : string;
interface Tag2BHE {
    "img": Img;
    "a": Anchor;
    "input": Input;
    "div": Div;
    "p": Paragraph;
    "button": Button;
    "span": Span;
}
declare type Element2Tag<T> = T extends HTMLInputElement ? "input" : T extends HTMLAnchorElement ? "a" : T extends HTMLImageElement ? "img" : Tag;
declare type ChildrenObj = TRecMap<QuerySelector | BetterHTMLElement>;
declare type Enumerated<T> = T extends (infer U)[] ? [number, U][] : T extends TMap<(infer U)> ? [keyof T, U][] : T extends boolean ? never : any;
declare type TReturnBoolean = (s: string) => boolean;
declare type AnyFunction = (...args: any[]) => any;
declare type Callable<T1, T2, F> = F extends (a1: T1, a2: T2) => infer R ? R : any;
declare type Callable2<T1, F> = F extends (a1: T1, a2: HTMLElement) => infer R ? R : any;
