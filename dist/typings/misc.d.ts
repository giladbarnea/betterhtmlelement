interface TMap<T> {
    [s: string]: T;
    [s: number]: T;
}
interface TRecMap<T> {
    [s: string]: T | TRecMap<T>;
    [s: number]: T | TRecMap<T>;
}
declare type IMap<T> = {
    [s in keyof T]: T;
};
declare type EventName = keyof HTMLElementEventMap;
declare type EventNameFunctionMap<E extends EventName> = {
    [P in E]?: (event: HTMLElementEventMap[P]) => void;
}[E];
declare type EventNameFunctionMap2<E extends EventName> = E extends EventName ? (event: HTMLElementEventMap[E]) => void : never;
declare type EventNameFunctionMap3 = {
    [P in EventName]?: (event: HTMLElementEventMap[P]) => void;
};
declare type EventNameFunctionMap4<E extends EventName> = {
    [P in EventName]?: (event: HTMLElementEventMap[P]) => void;
};
declare type EventNameFunctionMap5<E extends EventName = EventName> = {
    [P in EventName]?: (event: HTMLElementEventMap[P]) => void;
}[E];
declare type TEv1 = EventNameFunctionMap5<"mouseover">;
declare let ev1: TEv1;
declare function expectsMouseEventFunction(fn: (event: MouseEvent) => void): void;
declare const mouseEventFunction: TEv1;
declare function expectsMouseEventFunctionPairs(pairs: TMap<(event: MouseEvent) => void>): void;
declare const pairs: {
    mouseoverz: (event: MouseEvent) => void;
};
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
