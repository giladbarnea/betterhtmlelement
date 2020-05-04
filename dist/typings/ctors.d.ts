interface NewBHEConstructor<H extends HTMLElement> {
    tag: Element2Tag<H>;
    cls?: string;
    setid?: string;
}
interface ByIdBHEConstructor {
    byid: string;
    children?: ChildrenObj;
}
interface QueryBHEConstructor<Q extends QuerySelector> {
    query: Q;
    children?: ChildrenObj;
}
interface ByHtmlElementBHEConstructor<E extends HTMLElement> {
    htmlElement: E;
    children?: ChildrenObj;
}
declare type InputConstructor<T> = T extends QuerySelector ? {
    query: T;
    children?: ChildrenObj;
} : T extends Tag ? {
    tag: T;
    cls?: string;
    setid?: string;
    type?: "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local";
    placeholder?: string;
} | {
    htmlElement: T;
    children?: ChildrenObj;
} : {
    byid: string;
    children?: ChildrenObj;
};
