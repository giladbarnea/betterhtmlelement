declare const SVG_NS_URI = "http://www.w3.org/2000/svg";
declare class BetterHTMLElement<Generic extends HTMLElement = HTMLElement> {
    protected _htmlElement: Generic;
    private readonly _isSvg;
    private readonly _listeners;
    private _cachedChildren;
    constructor({ tag, cls, setid }: {
        tag: Element2Tag<Generic>;
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
        htmlElement: Generic;
        children?: ChildrenObj;
    });
    get e(): Generic;
    wrapSomethingElse<T extends HTMLElement>(newHtmlElement: BetterHTMLElement<T>): this;
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
    child<T extends Tag>(selector: T): BetterHTMLElement<HTMLElementTagNameMap[T]>;
    child(selector: string): BetterHTMLElement;
    children(): BetterHTMLElement[];
    children<K extends Tag>(selector: K): BetterHTMLElement[];
    children(selector: QuerySelector): BetterHTMLElement[];
    clone(deep?: boolean): BetterHTMLElement;
    cacheChildren(childrenObj: ChildrenObj): this;
    empty(): this;
    remove(): this;
    on(evTypeFnPairs: TMap<EventNameFunctionMap5>, options?: AddEventListenerOptions): this;
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
    mouseover(fn: (event: MouseEvent) => void, options?: AddEventListenerOptions): this;
    off(event: EventName): this;
    allOff(): this;
    attr(attrValPairs: TMap<string | boolean>): this;
    attr(attributeName: string): string;
    removeAttr(qualifiedName: string, ...qualifiedNames: string[]): this;
    data(key: string, parse?: boolean): string | TMap<string>;
}
declare class Div extends BetterHTMLElement<HTMLDivElement> {
    constructor(divOpts: any);
}
declare abstract class Form<E extends HTMLButtonElement | HTMLInputElement> extends BetterHTMLElement<E> {
    disable(): this;
    enable(): this;
    toggleEnabled(on: boolean): this;
    get disabled(): boolean;
    value(): string;
    value(val: any): this;
}
declare class Button extends Form<HTMLButtonElement> {
    constructor(buttonOpts: any);
}
declare class Paragraph extends BetterHTMLElement<HTMLParagraphElement> {
    constructor(pOpts: any);
}
declare class Span extends BetterHTMLElement<HTMLSpanElement> {
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
declare class Input extends Form<HTMLInputElement> {
    constructor(inputOpts: any);
    check(): this;
    uncheck(): this;
    toggleChecked(on: boolean): this;
    get checked(): boolean;
    placeholder(val: string): this;
    placeholder(): string;
}
declare class Img extends BetterHTMLElement<HTMLImageElement> {
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
declare class Anchor extends BetterHTMLElement<HTMLAnchorElement> {
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
declare function elem<T extends Tag>({ tag, cls, setid }: {
    tag: T;
    cls?: string;
    setid?: string;
}): T extends Tag ? BetterHTMLElement<HTMLElementTagNameMap[T]> : never;
declare function elem({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): BetterHTMLElement;
declare function elem<Q extends QuerySelector>({ query, children }: {
    query: Q;
    children?: ChildrenObj;
}): Q extends Tag ? BetterHTMLElement<HTMLElementTagNameMap[Q]> : BetterHTMLElement;
declare function elem<E extends HTMLElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): BetterHTMLElement<E>;
declare function span({ cls, setid, text }: {
    cls?: string;
    setid?: string;
    text?: string;
}): Span;
declare function span({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Span;
declare function span<Q extends QuerySelector>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"span">> ? never : Q;
    children?: ChildrenObj;
}): Span;
declare function span<E extends HTMLSpanElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Span;
declare function span(): Span;
declare function div({ cls, setid, text }: {
    cls?: string;
    setid?: string;
    text?: string;
}): Div;
declare function div({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Div;
declare function div<Q extends QuerySelector>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"div">> ? never : Q;
    children?: ChildrenObj;
}): Div;
declare function div<E extends HTMLDivElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Div;
declare function div(): Div;
declare function button({ cls, setid, text }: {
    cls?: string;
    setid?: string;
    text?: string;
}): Button;
declare function button({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Button;
declare function button<Q extends QuerySelector>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"button">> ? never : Q;
    children?: ChildrenObj;
}): Button;
declare function button<E extends HTMLButtonElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Button;
declare function button(): Button;
declare function input({ cls, setid, type, placeholder }: {
    cls?: string;
    setid?: string;
    type?: "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local";
    placeholder?: string;
}): Input;
declare function input({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Input;
declare function input<Q extends QuerySelector>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"input">> ? never : Q;
    children?: ChildrenObj;
}): Input;
declare function input<E extends HTMLInputElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Input;
declare function input(): Input;
declare function img({ cls, setid, src }: {
    cls?: string;
    setid?: string;
    src?: string;
}): Img;
declare function img({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Img;
declare function img<Q extends QuerySelector>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"img">> ? never : Q;
    children?: ChildrenObj;
}): Img;
declare function img<E extends HTMLImageElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Img;
declare function img(): Img;
declare function paragraph({ cls, setid, text }: {
    cls?: string;
    setid?: string;
    text?: string;
}): Paragraph;
declare function paragraph({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Paragraph;
declare function paragraph<Q extends QuerySelector>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"p">> ? never : Q;
    children?: ChildrenObj;
}): Paragraph;
declare function paragraph<E extends HTMLParagraphElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Paragraph;
declare function paragraph(): Paragraph;
declare function anchor({ cls, setid, href, target }: {
    cls?: string;
    setid?: string;
    href?: string;
    target?: string;
}): Anchor;
declare function anchor({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Anchor;
declare function anchor<Q extends QuerySelector>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"a">> ? never : Q;
    children?: ChildrenObj;
}): Anchor;
declare function anchor<E extends HTMLImageElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Anchor;
declare function anchor(): Anchor;
declare function wrapWithBHE(htmlElement: HTMLAnchorElement): Anchor;
declare function wrapWithBHE(htmlElement: HTMLInputElement): Input;
declare function wrapWithBHE(htmlElement: HTMLImageElement): Img;
declare function wrapWithBHE(htmlElement: HTMLParagraphElement): Paragraph;
declare function wrapWithBHE(htmlElement: HTMLSpanElement): Span;
declare function wrapWithBHE(htmlElement: HTMLButtonElement): Button;
declare function wrapWithBHE(htmlElement: HTMLDivElement): Div;
declare function wrapWithBHE(htmlElement: HTMLElement): BetterHTMLElement;
