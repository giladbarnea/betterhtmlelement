interface NewBHEConstructor<T extends HTMLElement> {
    tag?: HTMLElement2Tag<T>,
    cls?: string,
    setid?: string
}


interface ByIdBHEConstructor {
    byid?: string,
    children?: ChildrenObj
}

interface QueryBHEConstructor<T extends HTMLElement> {
    query?: QuerySelector<HTMLElement2Tag<T>>,
    children?: ChildrenObj
}

interface ByHtmlElementBHEConstructor<T extends HTMLElement> {
    htmlElement?: T;
    children?: ChildrenObj
}

interface BHEConstructor<T extends HTMLElement>
    extends NewBHEConstructor<T>,
        ByIdBHEConstructor,
        QueryBHEConstructor<T>,
        ByHtmlElementBHEConstructor<T> {
}

interface DivConstructor extends SubElemConstructor<HTMLDivElement> {
    htmlElement?: HTMLDivElement;
}

interface SubElemConstructor<K extends HTMLElement> extends BHEConstructor<K> {
    text?: string;
}


interface ImgConstructor extends BHEConstructor<HTMLImageElement> {
    src?: string;
}

interface InputConstructor extends BHEConstructor<HTMLInputElement> {
    type?: "checkbox" | "number" | "radio" | "text";
    placeholder?: string;
}


interface AnchorConstructor extends SubElemConstructor<HTMLAnchorElement> {
    href?: string;
    target?: string;
}

