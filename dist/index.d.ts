import { ChildrenObj, Element2Tag, EventName, EventName2Function, NotTag, QuerySelector, Returns, Tag, TMap } from "./typings";
import { CssOptions } from "./typings";
export declare class BetterHTMLElement<Generic extends HTMLElement = HTMLElement> {
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
    static wrapWithBHE(htmlElement: HTMLAnchorElement): Anchor;
    static wrapWithBHE<TInputType extends InputType = InputType, Generic extends FormishHTMLElement = FormishHTMLElement>(htmlElement: Generic): Input<TInputType, Generic>;
    static wrapWithBHE(htmlElement: HTMLImageElement): Img;
    static wrapWithBHE(htmlElement: HTMLParagraphElement): Paragraph;
    static wrapWithBHE(htmlElement: HTMLSpanElement): Span;
    static wrapWithBHE(htmlElement: HTMLButtonElement): Button;
    static wrapWithBHE(htmlElement: HTMLDivElement): Div;
    static wrapWithBHE(htmlElement: HTMLSelectElement): Div;
    static wrapWithBHE(htmlElement: HTMLElement): BetterHTMLElement;
    toString(): string;
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
    class(cls: Returns<boolean>): string;
    class(): string[];
    addClass(cls: string, ...clses: string[]): this;
    removeClass(cls: Returns<boolean>, ...clses: Returns<boolean>[]): this;
    removeClass(cls: string, clses?: string[]): this;
    replaceClass(oldToken: Returns<boolean>, newToken: string): this;
    replaceClass(oldToken: string, newToken: string): this;
    toggleClass(cls: Returns<boolean>, force?: boolean): this;
    toggleClass(cls: string, force?: boolean): this;
    hasClass(cls: string): boolean;
    hasClass(cls: Returns<boolean>): boolean;
    after(...nodes: Array<BetterHTMLElement | Node>): this;
    insertAfter(node: BetterHTMLElement | HTMLElement): this;
    append(...nodes: Array<BetterHTMLElement | Node | TMap<BetterHTMLElement> | [string, BetterHTMLElement]>): this;
    appendTo(node: BetterHTMLElement | HTMLElement): this;
    before(...nodes: Array<BetterHTMLElement | Node>): this;
    insertBefore(node: BetterHTMLElement | HTMLElement): this;
    replaceChild(newChild: Node, oldChild: Node): this;
    replaceChild(newChild: BetterHTMLElement, oldChild: BetterHTMLElement): this;
    cacheAppend(keyChildPairs: TMap<BetterHTMLElement>): this;
    cacheAppend(keyChildPairs: [string, BetterHTMLElement][]): this;
    _cls(): typeof BetterHTMLElement;
    child(selector: "img"): Img;
    child(selector: "a"): Anchor;
    child<TInputType extends InputType = InputType>(selector: "input"): Input<TInputType, HTMLInputElement>;
    child(selector: "select"): Input<undefined, HTMLSelectElement>;
    child(selector: "p"): Paragraph;
    child(selector: "span"): Span;
    child(selector: "button"): Button;
    child(selector: "div"): Div;
    child<T extends Tag>(selector: T): BetterHTMLElement<HTMLElementTagNameMap[T]>;
    child(selector: string): BetterHTMLElement;
    child<T extends typeof BetterHTMLElement>(selector: string, bheCls: T): T;
    children(): BetterHTMLElement[];
    children<K extends Tag>(selector: K): BetterHTMLElement[];
    children(selector: QuerySelector): BetterHTMLElement[];
    clone(deep?: boolean): BetterHTMLElement;
    cacheChildren(childrenObj: ChildrenObj): this;
    empty(): this;
    remove(): this;
    on(evTypeFnPairs: TMap<EventName2Function>, options?: AddEventListenerOptions): this;
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
    private _cache;
}
export declare class Div extends BetterHTMLElement<HTMLDivElement> {
    constructor(divOpts: any);
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
interface Flashable {
    flashBad(): Promise<void>;
    flashGood(): Promise<void>;
}
export declare type FormishHTMLElement = HTMLButtonElement | HTMLInputElement | HTMLSelectElement;
export declare type InputType = "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local";
export declare abstract class Form<Generic extends FormishHTMLElement> extends BetterHTMLElement<Generic> implements Flashable {
    get disabled(): boolean;
    disable(): this;
    enable(): this;
    toggleEnabled(on: boolean): this;
    value(): any;
    value(val: any): this;
    flashBad(): Promise<void>;
    flashGood(): Promise<void>;
    clear(): this;
    _preEvent(): void;
    _onEventSuccess(ret: any): Promise<void>;
    _onEventError(e: any): Promise<void>;
    _postEvent(): void;
}
export declare class Button extends Form<HTMLButtonElement> {
    constructor(buttonOpts: any);
    click(_fn?: (_event: MouseEvent) => Promise<any>): this;
}
export declare class Input<TInputType extends InputType, Generic extends FormishHTMLElement = HTMLInputElement> extends Form<Generic> {
    type: TInputType;
    constructor(inputOpts: any);
}
export declare class TextInput extends Input<"text"> {
    constructor(opts: any);
    placeholder(val: string): this;
    placeholder(): string;
    keydown(_fn: (_event: KeyboardEvent) => Promise<any>): this;
}
export declare class Changable<TInputType extends InputType, Generic extends FormishHTMLElement> extends Input<TInputType, Generic> {
    change(_fn: (_event: Event) => Promise<any>): this;
}
export declare class CheckboxInput extends Changable<"checkbox", HTMLInputElement> {
    constructor(opts: any);
    get checked(): boolean;
    check(): this;
    uncheck(): this;
    toggleChecked(on: boolean): this;
    value(): boolean;
    value(val: any): this;
    clear(): this;
    _onEventError(e: any): Promise<void>;
}
export declare class Select extends Changable<undefined, HTMLSelectElement> {
    constructor(selectOpts: any);
    get selectedIndex(): number;
    set selectedIndex(val: number);
    get selected(): HTMLOptionElement;
    set selected(val: HTMLOptionElement);
    get options(): HTMLOptionElement[];
    item(index: any): HTMLOptionElement;
    value(): HTMLOptionElement;
    value(val: any): this;
    clear(): this;
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
export declare function input<TInputType extends InputType, Generic extends FormishHTMLElement = HTMLInputElement>({ cls, setid, type, placeholder }: {
    cls?: string;
    setid?: string;
    type?: TInputType;
    placeholder?: string;
}): Input<TInputType, Generic>;
export declare function input<TInputType extends InputType = InputType, Generic extends FormishHTMLElement = HTMLInputElement>({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Input<TInputType, Generic>;
export declare function input<Q extends QuerySelector, TInputType extends InputType = InputType, Generic extends FormishHTMLElement = HTMLInputElement>({ query, children }: {
    query: Q extends QuerySelector<NotTag<"input">> ? never : Q;
    children?: ChildrenObj;
}): Input<TInputType, Generic>;
export declare function input<TInputType extends InputType = InputType, Generic extends FormishHTMLElement = HTMLInputElement>({ htmlElement, children }: {
    htmlElement: Generic;
    children?: ChildrenObj;
}): Input<TInputType, Generic>;
export declare function input<TInputType extends InputType = InputType, Generic extends FormishHTMLElement = HTMLInputElement>(): Input<TInputType, Generic>;
export declare function select(selectOpts: any): Select;
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
export declare function anchor<E extends HTMLAnchorElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Anchor;
export declare function anchor(): Anchor;
export {};
