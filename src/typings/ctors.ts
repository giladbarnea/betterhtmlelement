interface NewBHEConstructor<T extends HTMLElement> {
    tag: HTMLElement2Tag<T>,
    cls?: string,
    setid?: string
}


interface ByIdBHEConstructor {
    byid: string,
    children?: ChildrenObj
}

interface QueryBHEConstructor {
    query: QuerySelector,
    children?: ChildrenObj
}

interface ByHtmlElementBHEConstructor<T extends HTMLElement> {
    htmlElement: T,
    children?: ChildrenObj
}

interface BHEConstructor<T extends HTMLElement>
    extends Partial<NewBHEConstructor<T>>,
        Partial<ByIdBHEConstructor>,
        Partial<QueryBHEConstructor>,
        Partial<ByHtmlElementBHEConstructor<T>> {
}

interface SubElemConstructor<T extends HTMLElement> extends BHEConstructor<T> {
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
}

