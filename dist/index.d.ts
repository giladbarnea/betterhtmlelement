import { ChildrenObj, Element2Tag, NotTag, QuerySelector, Tag, TEvent, TEventFunctionMap, TMap, TRecMap, TReturnBoolean } from "./typings/misc";
export declare class BetterHTMLElement<T extends HTMLElement = HTMLElement> {
    protected _htmlElement: T;
    private readonly _isSvg;
    private readonly _listeners;
    private _cachedChildren;
    constructor({ tag, cls, setid }: {
        tag: Element2Tag<T>;
        cls?: string;
        setid?: string;
    });
    constructor({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    });
    constructor({ query, children }: {
        query: QuerySelector;
        children?: ChildrenObj;
    });
    constructor({ htmlElement, children }: {
        htmlElement: T;
        children?: ChildrenObj;
    });
    get e(): T;
    wrapSomethingElse(newHtmlElement: BetterHTMLElement): this;
    wrapSomethingElse(newHtmlElement: Node): this;
    html(html: string): this;
    html(): string;
    text(txt: string | number): this;
    text(): string;
    id(id: string): this;
    id(): string;
    css(css: Partial<CssOptions>): this;
    css(css: string): string;
    uncss(...removeProps: (keyof CssOptions)[]): this;
    class(cls: string): this;
    class(cls: TReturnBoolean): string;
    class(): string[];
    addClass(cls: string, ...clses: string[]): this;
    removeClass(cls: TReturnBoolean, ...clses: TReturnBoolean[]): this;
    removeClass(cls: string, clses?: string[]): this;
    replaceClass(oldToken: TReturnBoolean, newToken: string): this;
    replaceClass(oldToken: string, newToken: string): this;
    toggleClass(cls: TReturnBoolean, force?: boolean): this;
    toggleClass(cls: string, force?: boolean): this;
    hasClass(cls: string): boolean;
    hasClass(cls: TReturnBoolean): boolean;
    after(...nodes: Array<BetterHTMLElement | Node>): this;
    insertAfter(node: BetterHTMLElement | HTMLElement): this;
    append(...nodes: Array<BetterHTMLElement | Node | TMap<BetterHTMLElement> | [string, BetterHTMLElement]>): this;
    appendTo(node: BetterHTMLElement | HTMLElement): this;
    before(...nodes: Array<BetterHTMLElement | Node>): this;
    insertBefore(node: BetterHTMLElement | HTMLElement): this;
    replaceChild(newChild: Node, oldChild: Node): this;
    replaceChild(newChild: BetterHTMLElement, oldChild: BetterHTMLElement): this;
    private _cache;
    cacheAppend(keyChildPairs: TMap<BetterHTMLElement>): this;
    cacheAppend(keyChildPairs: [string, BetterHTMLElement][]): this;
    child(selector: "img"): Img;
    child(selector: "a"): Anchor;
    child(selector: "input"): Input;
    child(selector: "p"): Paragraph;
    child(selector: "span"): Span;
    child(selector: "button"): Button;
    child(selector: "div"): Div;
    child<T extends Tag>(selector: T): BetterHTMLElement;
    children(): BetterHTMLElement[];
    children<K extends Tag>(selector: K): BetterHTMLElement[];
    children(selector: string | Tag): BetterHTMLElement[];
    clone(deep?: boolean): BetterHTMLElement;
    cacheChildren(queryMap: TMap<QuerySelector>): this;
    cacheChildren(recursiveQueryMap: TRecMap<QuerySelector>): this;
    cacheChildren(bheMap: TMap<BetterHTMLElement>): this;
    cacheChildren(recursiveBHEMap: TRecMap<BetterHTMLElement>): this;
    empty(): this;
    remove(): this;
    on(evTypeFnPairs: TEventFunctionMap<TEvent>, options?: AddEventListenerOptions): this;
    touchstart(fn: (ev: TouchEvent) => any, options?: AddEventListenerOptions): this;
    pointerdown(fn: (event: PointerEvent | MouseEvent) => any, options?: AddEventListenerOptions): this;
    click(): this;
    click(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    blur(): this;
    blur(fn: (event: FocusEvent) => any, options?: AddEventListenerOptions): this;
    focus(): this;
    focus(fn: (event: FocusEvent) => any, options?: AddEventListenerOptions): this;
    change(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    contextmenu(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    dblclick(): this;
    dblclick(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    mouseenter(): this;
    mouseenter(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    keydown(fn: (event: KeyboardEvent) => any, options?: AddEventListenerOptions): this;
    mouseout(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    mouseover(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    off(event: TEvent): this;
    allOff(): this;
    attr(attrValPairs: TMap<string | boolean>): this;
    attr(attributeName: string): string;
    removeAttr(qualifiedName: string, ...qualifiedNames: string[]): this;
    data(key: string, parse?: boolean): string | TMap<string>;
}
export declare class Div extends BetterHTMLElement<HTMLDivElement> {
    constructor(divOpts: any);
}
export declare class Button extends BetterHTMLElement<HTMLButtonElement> {
    constructor(buttonOpts: any);
}
export declare class Paragraph extends BetterHTMLElement<HTMLParagraphElement> {
    constructor(pOpts: any);
}
export declare class Span extends BetterHTMLElement<HTMLSpanElement> {
    constructor({ cls, setid, text }: {
        cls?: string;
        setid?: string;
        text?: string;
    });
    constructor({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    });
    constructor({ query, children }: {
        query: string;
        children?: ChildrenObj;
    });
    constructor({ htmlElement, children }: {
        htmlElement: HTMLSpanElement;
        children?: ChildrenObj;
    });
}
export declare class Input extends BetterHTMLElement<HTMLInputElement> {
    constructor(inputOpts: any);
    check(): this;
    uncheck(): this;
    toggleChecked(on: boolean): this;
    get checked(): boolean;
    disable(): this;
    enable(): this;
    toggleEnabled(on: boolean): this;
    get disabled(): boolean;
    value(): string;
    value(val: any): this;
    placeholder(val: string): this;
    placeholder(): string;
}
export declare class Img extends BetterHTMLElement<HTMLImageElement> {
    constructor({ setid, cls, src, byid, query, htmlElement, children }: {
        setid: any;
        cls: any;
        src: any;
        byid: any;
        query: any;
        htmlElement: any;
        children: any;
    });
    src(src: string): this;
    src(): string;
}
export declare class Anchor extends BetterHTMLElement<HTMLAnchorElement> {
    constructor({ setid, cls, text, href, target, byid, query, htmlElement, children }: {
        setid: any;
        cls: any;
        text: any;
        href: any;
        target: any;
        byid: any;
        query: any;
        htmlElement: any;
        children: any;
    });
    href(): string;
    href(val: string): this;
    target(): string;
    target(val: string): this;
}
export declare function elem<T extends Tag>({ tag, cls, setid }: {
    tag: T;
    cls?: string;
    setid?: string;
}): T extends Tag ? BetterHTMLElement<HTMLElementTagNameMap[T]> : never;
export declare function elem({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): BetterHTMLElement;
export declare function elem<Q extends QuerySelector>({ query, children }: {
    query: Q;
    children?: ChildrenObj;
}): Q extends Tag ? BetterHTMLElement<HTMLElementTagNameMap[Q]> : BetterHTMLElement;
export declare function elem<E extends HTMLElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): BetterHTMLElement<E>;
export declare function span({ cls, setid, text }: {
    cls?: string;
    setid?: string;
    text?: string;
}): Span;
export declare function span({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Span;
export declare function span<Q extends QuerySelector>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"span">> ? never : Q;
    children?: ChildrenObj;
}): Span;
export declare function span<E extends HTMLSpanElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Span;
export declare function span(): Span;
export declare function div({ cls, setid, text }: {
    cls?: string;
    setid?: string;
    text?: string;
}): Div;
export declare function div({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Div;
export declare function div<Q extends QuerySelector>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"div">> ? never : Q;
    children?: ChildrenObj;
}): Div;
export declare function div<E extends HTMLDivElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Div;
export declare function div(): Div;
export declare function button({ cls, setid, text }: {
    cls?: string;
    setid?: string;
    text?: string;
}): Button;
export declare function button({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Button;
export declare function button<Q extends QuerySelector>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"button">> ? never : Q;
    children?: ChildrenObj;
}): Button;
export declare function button<E extends HTMLButtonElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Button;
export declare function button(): Button;
export declare function input({ cls, setid, type, placeholder }: {
    cls?: string;
    setid?: string;
    type?: "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local";
    placeholder?: string;
}): Input;
export declare function input({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Input;
export declare function input<Q extends QuerySelector>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"input">> ? never : Q;
    children?: ChildrenObj;
}): Input;
export declare function input<E extends HTMLInputElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Input;
export declare function input(): Input;
export declare function img({ cls, setid, src }: {
    cls?: string;
    setid?: string;
    src?: string;
}): Img;
export declare function img({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Img;
export declare function img<Q extends QuerySelector>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"img">> ? never : Q;
    children?: ChildrenObj;
}): Img;
export declare function img<E extends HTMLImageElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Img;
export declare function img(): Img;
export declare function paragraph({ cls, setid, text }: {
    cls?: string;
    setid?: string;
    text?: string;
}): Paragraph;
export declare function paragraph({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Paragraph;
export declare function paragraph<Q extends QuerySelector>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"p">> ? never : Q;
    children?: ChildrenObj;
}): Paragraph;
export declare function paragraph<E extends HTMLParagraphElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Paragraph;
export declare function paragraph(): Paragraph;
export declare function anchor({ cls, setid, href, target }: {
    cls?: string;
    setid?: string;
    href?: string;
    target?: string;
}): Anchor;
export declare function anchor({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Anchor;
export declare function anchor<Q extends QuerySelector>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"a">> ? never : Q;
    children?: ChildrenObj;
}): Anchor;
export declare function anchor<E extends HTMLImageElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Anchor;
export declare function anchor(): Anchor;
export declare function wrapWithBHE(tag: "img", htmlElement: HTMLImageElement): Img;
export declare function wrapWithBHE(tag: "input", htmlElement: HTMLInputElement): Input;
export declare function wrapWithBHE(tag: "a", htmlElement: HTMLAnchorElement): Anchor;
export declare function wrapWithBHE(tag: "p", htmlElement: HTMLParagraphElement): Paragraph;
export declare function wrapWithBHE(tag: "span", htmlElement: HTMLSpanElement): Span;
export declare function wrapWithBHE(tag: "button", htmlElement: HTMLButtonElement): Button;
export declare function wrapWithBHE(tag: "div", htmlElement: HTMLDivElement): Div;
export declare function wrapWithBHE(tag: any, htmlElement: HTMLElement): BetterHTMLElement;
