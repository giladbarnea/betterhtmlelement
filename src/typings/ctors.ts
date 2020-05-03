import {ChildrenObj, Element2Tag, QuerySelector, Tag} from "./misc"

export interface NewBHEConstructor<H extends HTMLElement> {
    tag: Element2Tag<H>,
    cls?: string,
    setid?: string
}


export interface ByIdBHEConstructor {
    byid: string,
    children?: ChildrenObj
}

export interface QueryBHEConstructor<Q extends QuerySelector> {
    query: Q,
    children?: ChildrenObj
}

export interface ByHtmlElementBHEConstructor<E extends HTMLElement> {
    htmlElement: E;
    children?: ChildrenObj
}

// interface BHEConstructor<T extends HTMLElement>
//     extends NewBHEConstructor<T>,
//         ByIdBHEConstructor,
//         QueryBHEConstructor<T>,
//         ByHtmlElementBHEConstructor<T> {
// }
// export type BHEConstructor<T extends HTMLElement> =
//     NewBHEConstructor<T> |
//     ByIdBHEConstructor |
//     QueryBHEConstructor<Element2Tag<T>> |
//     ByHtmlElementBHEConstructor<T>

export type SubElemConstructor<K extends HTMLElement> = BHEConstructor<K> & {
    text?: string;
}

export type DivConstructor = SubElemConstructor<HTMLDivElement> & {
    htmlElement?: HTMLDivElement;
}


export type ImgConstructor = BHEConstructor<HTMLImageElement> & {
    src?: string;
}

// export type InputConstructor = BHEConstructor<HTMLInputElement> & {
//     type?: "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local";
//     placeholder?: string;
// }
export type InputConstructor<T> =
    T extends QuerySelector ? { query: T, children?: ChildrenObj }
        : T extends Tag ?
        { tag: T, cls?: string, setid?: string, type?: "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local", placeholder?: string } |
            { htmlElement: T; children?: ChildrenObj }
        :
        { byid: string, children?: ChildrenObj }

export type AnchorConstructor = SubElemConstructor<HTMLAnchorElement> & {
    href?: string;
    target?: string;
}

