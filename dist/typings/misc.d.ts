import { Div, Anchor, Paragraph, Img, Input, Button, Span } from "../index";
export interface TMap<T> {
    [s: string]: T;
    [s: number]: T;
}
export interface TRecMap<T> {
    [s: string]: T | TRecMap<T>;
    [s: number]: T | TRecMap<T>;
}
export declare type TEvent = keyof HTMLElementEventMap;
export declare type TEventFunctionMap<K extends TEvent> = {
    [P in K]?: (event: HTMLElementEventMap[P]) => void;
};
export declare type Tag = Exclude<keyof HTMLElementTagNameMap, "object">;
export declare type NotTag<T extends Tag> = Exclude<Tag, T>;
export declare type Tag2Element<K extends Tag = Tag> = K extends Tag ? HTMLElementTagNameMap[K] : HTMLElementTagNameMap[Tag];
declare type TagOrString = Tag | string;
export declare type QuerySelector<K extends TagOrString = TagOrString> = K extends Tag ? K : string;
export interface Tag2BHE {
    "img": Img;
    "a": Anchor;
    "input": Input;
    "div": Div;
    "p": Paragraph;
    "button": Button;
    "span": Span;
}
export declare type BHETag = keyof Tag2BHE;
export declare type Element2Tag<T> = T extends HTMLInputElement ? "input" : T extends HTMLAnchorElement ? "a" : T extends HTMLImageElement ? "img" : Tag;
export declare type MapValues<T> = {
    [K in keyof T]: T[K];
}[keyof T];
export declare type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>;
export declare type Enumerated<T> = T extends (infer U)[] ? [number, U][] : T extends TMap<(infer U)> ? [keyof T, U][] : T extends boolean ? never : any;
export declare type TReturnBoolean = (s: string) => boolean;
export declare type AnyFunction = (...args: any[]) => any;
export declare type Callable<T1, T2, F> = F extends (a1: T1, a2: T2) => infer R ? R : any;
export declare type Callable2<T1, F> = F extends (a1: T1, a2: HTMLElement) => infer R ? R : any;
export {};
