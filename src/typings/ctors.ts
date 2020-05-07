

interface NewBHEConstructor<H extends HTMLElement> {
    tag: Element2Tag<H>,
    cls?: string,
    setid?: string
}


interface ByIdBHEConstructor {
    byid: string,
    children?: ChildrenObj
}

interface QueryBHEConstructor<Q extends QuerySelector> {
    query: Q,
    children?: ChildrenObj
}

interface ByHtmlElementBHEConstructor<E extends HTMLElement> {
    htmlElement: E;
    children?: ChildrenObj
}

// interface BHEConstructor<T extends HTMLElement>
//     extends NewBHEConstructor<T>,
//         ByIdBHEConstructor,
//         QueryBHEConstructor<T>,
//         ByHtmlElementBHEConstructor<T> {
// }
// type BHEConstructor<T extends HTMLElement> =
//     NewBHEConstructor<T> |
//     ByIdBHEConstructor |
//     QueryBHEConstructor<Element2Tag<T>> |
//     ByHtmlElementBHEConstructor<T>

// type SubElemConstructor<K extends HTMLElement> = BHEConstructor<K> & {
//     text?: string;
// }

// type DivConstructor = SubElemConstructor<HTMLDivElement> & {
//     htmlElement?: HTMLDivElement;
// }
//
//
// type ImgConstructor = BHEConstructor<HTMLImageElement> & {
//     src?: string;
// }

// type InputConstructor = BHEConstructor<HTMLInputElement> & {
//     type?: "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local";
//     placeholder?: string;
// }
type InputConstructor<T> =
    T extends QuerySelector ? { query: T, children?: ChildrenObj }
        : T extends Tag ?
        { tag: T, cls?: string, setid?: string, type?: "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local", placeholder?: string } |
            { htmlElement: T; children?: ChildrenObj }
        :
        { byid: string, children?: ChildrenObj }

// type AnchorConstructor = SubElemConstructor<HTMLAnchorElement> & {
//     href?: string;
//     target?: string;
// }

