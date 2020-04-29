interface BaseElemConstructor<T> {
    id?: string;
    cls?: string;
    htmlElement?: T;
}

interface SubElemConstructor<T> extends BaseElemConstructor<T> {
    text?: string;
    /*htmlElement?: T extends HTMLDivElement ? HTMLDivElement :
        T extends HTMLInputElement ? HTMLInputElement :
            T extends HTMLSpanElement ? HTMLSpanElement :
                T extends HTMLButtonElement ? HTMLButtonElement :
                    T extends HTMLParagraphElement ? HTMLParagraphElement :
                        T extends HTMLImageElement ? HTMLImageElement :
                            T extends HTMLSpanElement ? HTMLSpanElement : HTMLElement;*/
}

interface ImgConstructor extends BaseElemConstructor<HTMLImageElement> {
    src?: string;
}

interface InputConstructor extends BaseElemConstructor<HTMLInputElement> {
    type?: string;
}

interface AnchorConstructor extends SubElemConstructor<HTMLAnchorElement> {
    href?: string;
}

