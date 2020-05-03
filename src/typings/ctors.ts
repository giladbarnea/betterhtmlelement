interface NewBHEConstructor<T extends HTMLElement> {
    tag: Element2Tag<T>,
    cls?: string,
    setid?: string
}


interface ByIdBHEConstructor {
    byid: string,
    children?: ChildrenObj
}

interface QueryBHEConstructor<T extends HTMLElement> {
    query: QuerySelector<Element2Tag<T>>,
    children?: ChildrenObj
}

interface ByHtmlElementBHEConstructor<T extends HTMLElement> {
    htmlElement: T;
    children?: ChildrenObj
}

// interface BHEConstructor<T extends HTMLElement>
//     extends NewBHEConstructor<T>,
//         ByIdBHEConstructor,
//         QueryBHEConstructor<T>,
//         ByHtmlElementBHEConstructor<T> {
// }
type BHEConstructor<T extends HTMLElement> =
    NewBHEConstructor<T> |
    ByIdBHEConstructor |
    QueryBHEConstructor<T> |
    ByHtmlElementBHEConstructor<T>

type SubElemConstructor<K extends HTMLElement> = BHEConstructor<K> & {
    text?: string;
}

type DivConstructor = SubElemConstructor<HTMLDivElement> & {
    htmlElement?: HTMLDivElement;
}


type ImgConstructor = BHEConstructor<HTMLImageElement> & {
    src?: string;
}

type InputConstructor = BHEConstructor<HTMLInputElement> & {
    type?: "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local";
    placeholder?: string;
}


type AnchorConstructor = SubElemConstructor<HTMLAnchorElement> & {
    href?: string;
    target?: string;
}

