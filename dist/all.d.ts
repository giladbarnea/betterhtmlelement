declare function getArgNamesValues(argsWithValues: object): string;
declare function getArgsWithValues(passedArgs: object): object;
declare class MutuallyExclusiveArgs extends Error {
    constructor(passedArgs: object, details?: string);
}
declare class NotEnoughArgs extends Error {
    constructor(expected: number | number[], passedArgs: object, details?: string);
}
declare const SVG_NS_URI = "http://www.w3.org/2000/svg";
declare class BetterHTMLElement<T extends HTMLElement = HTMLElement> {
    protected _htmlElement: T;
    private readonly _isSvg;
    private readonly _listeners;
    private _cachedChildren;
    constructor({ tag, cls, setid }: NewBHEConstructor<T>);
    constructor({ byid, children }: ByIdBHEConstructor);
    constructor({ query, children }: QueryBHEConstructor);
    constructor({ htmlElement, children }: ByHtmlElementBHEConstructor<T>);
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
    child<K extends HTMLTag, T extends HTMLElementTagNameMap[K]>(selector: K): BetterHTMLElement<T>;
    child(selector: string): BetterHTMLElement;
    children(): BetterHTMLElement[];
    children<K extends HTMLTag>(selector: K): BetterHTMLElement[];
    children(selector: string | HTMLTag): BetterHTMLElement[];
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
declare class Div extends BetterHTMLElement<HTMLDivElement> {
    constructor({ setid, cls, byid, text, query, htmlElement, children }: DivConstructor);
}
declare class Button extends BetterHTMLElement<HTMLButtonElement> {
    constructor({ setid, cls, text, byid, query, htmlElement, children }: SubElemConstructor<HTMLButtonElement>);
}
declare class Paragraph extends BetterHTMLElement<HTMLParagraphElement> {
    constructor({ setid, cls, text, byid, query, htmlElement, children }: SubElemConstructor<HTMLParagraphElement>);
}
declare class Input extends BetterHTMLElement<HTMLInputElement> {
    constructor({ setid, cls, type, placeholder, byid, query, htmlElement, children }: InputConstructor);
    check(): this;
    uncheck(): this;
    get checked(): boolean;
    value(val: string): this;
    value(): string;
    placeholder(val: string): this;
    placeholder(): string;
}
declare class Span extends BetterHTMLElement<HTMLSpanElement> {
    constructor({ setid, cls, text, byid, query, htmlElement, children }: SubElemConstructor<HTMLSpanElement>);
}
declare class Img extends BetterHTMLElement<HTMLImageElement> {
    constructor({ setid, cls, src, byid, query, htmlElement, children }: ImgConstructor);
    src(src: string): this;
    src(): string;
}
declare class Anchor extends BetterHTMLElement<HTMLAnchorElement> {
    constructor({ setid, cls, text, href, target, byid, query, htmlElement, children }: AnchorConstructor);
    href(): string;
    href(val: string): this;
    target(): string;
    target(val: string): this;
}
declare function elem({ tag, cls, setid }: NewBHEConstructor<HTMLElement>): any;
declare function elem({ byid, children }: ByIdBHEConstructor): any;
declare function elem({ query, children }: QueryBHEConstructor): any;
declare function elem({ htmlElement, children }: ByHtmlElementBHEConstructor<HTMLElement>): any;
declare function span({ setid, cls, text, byid, query, htmlElement, children }?: SubElemConstructor<HTMLSpanElement>): Span;
declare function div({ setid, cls, text, byid, query, htmlElement, children }?: DivConstructor): Div;
declare function button({ setid, cls, text, byid, query, htmlElement, children }?: SubElemConstructor<HTMLButtonElement>): Button;
declare function input({ setid, cls, type, placeholder, byid, query, htmlElement, children }?: InputConstructor): Input;
declare function img({ setid, cls, src, byid, query, htmlElement, children }?: ImgConstructor): Img;
declare function paragraph({ setid, cls, text, byid, query, htmlElement, children }?: SubElemConstructor<HTMLParagraphElement>): Paragraph;
declare function anchor({ setid, cls, text, href, target, byid, query, htmlElement, children }?: AnchorConstructor): Anchor;
declare function wrapWithBHE<K extends HTMLTag, T extends HTMLElementType<K>>(tag: K, htmlElement: T): BetterHTMLElement<T>;
declare function enumerate<T>(obj: T): Enumerated<T>;
declare function wait(ms: number): Promise<any>;
declare function anyValue(array: any): boolean;
declare function noValue(array: any): boolean;
declare function isArray<T>(obj: any): obj is Array<T>;
declare function isEmptyArr(collection: any): boolean;
declare function isEmptyObj(obj: any): boolean;
declare function isHTMLElement<K extends BHETag>(tag: K, element: BHETag2HTMLElement<K>): element is BHETag2HTMLElement<K>;
declare function isFunction(fn: AnyFunction): fn is AnyFunction;
declare function isObject(obj: any): boolean;
declare function shallowProperty<T>(key: string): (obj: T) => T extends null ? undefined : T[keyof T];
declare function getLength(collection: any): number;
declare type OmittedCssProps = "animationDirection" | "animationFillMode" | "animationIterationCount" | "animationPlayState" | "animationTimingFunction" | "opacity" | "padding" | "paddingBottom" | "paddingLeft" | "paddingRight" | "paddingTop" | "preload" | "width";
declare type PartialCssStyleDeclaration = Omit<Partial<CSSStyleDeclaration>, OmittedCssProps>;
interface CssOptions extends PartialCssStyleDeclaration {
    animationDirection?: AnimationDirection;
    animationFillMode?: AnimationFillMode;
    animationIterationCount?: number;
    animationPlayState?: AnimationPlayState;
    animationTimingFunction?: AnimationTimingFunction;
    opacity?: string | number;
    padding?: string | number;
    paddingBottom?: string | number;
    paddingLeft?: string | number;
    paddingRight?: string | number;
    paddingTop?: string | number;
    preload?: "auto" | string;
    width?: string | number;
}
declare type CubicBezierFunction = [number, number, number, number];
declare type Jumpterm = 'jump-start' | 'jump-end' | 'jump-none' | 'jump-both' | 'start' | 'end';
declare type StepsFunction = [number, Jumpterm];
declare type AnimationTimingFunction = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | StepsFunction | CubicBezierFunction;
declare type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
declare type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';
interface TransformOptions {
    matrix?: [number, number, number, number, number, number];
    matrix3d?: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
    perspective?: string;
    rotate?: string;
    rotate3d?: [number, number, number, string];
    rotateX?: string;
    rotateY?: string;
    rotateZ?: string;
    scale?: number;
    scale3d?: [number, number, number];
    scaleX?: [number, number, number];
    scaleY?: [number, number, number];
    skew?: [string, string];
    skewX?: string;
    skewY?: string;
    translate?: [string, string];
    translate3d?: [string, string, string];
    translateX?: string;
    translateY?: string;
    translateZ?: string;
}
interface AnimateOptions {
    delay?: string;
    direction?: AnimationDirection;
    duration: string;
    fillMode?: AnimationFillMode;
    iterationCount?: number;
    name: string;
    playState?: AnimationPlayState;
    timingFunction?: AnimationTimingFunction;
}
interface NewBHEConstructor<T extends HTMLElement> {
    tag?: HTMLElement2Tag<T>;
    cls?: string;
    setid?: string;
}
interface ByIdBHEConstructor {
    byid?: string;
    children?: ChildrenObj;
}
interface QueryBHEConstructor {
    query?: QuerySelector;
    children?: ChildrenObj;
}
interface ByHtmlElementBHEConstructor<T extends HTMLElement> {
    htmlElement?: T;
    children?: ChildrenObj;
}
interface BHEConstructor<T extends HTMLElement> extends NewBHEConstructor<T>, ByIdBHEConstructor, QueryBHEConstructor, ByHtmlElementBHEConstructor<T> {
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
interface TMap<T> {
    [s: string]: T;
    [s: number]: T;
}
interface TRecMap<T> {
    [s: string]: T | TRecMap<T>;
    [s: number]: T | TRecMap<T>;
}
declare type TEvent = keyof HTMLElementEventMap;
declare type TEventFunctionMap<K extends TEvent> = {
    [P in K]?: (event: HTMLElementEventMap[P]) => void;
};
declare type A<K extends keyof HTMLElementTagNameMap> = {
    [P in K]: HTMLElementTagNameMap[P];
}[K];
declare type B = {
    [P in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[P];
};
declare const a: A<"a">;
declare function c(d: HTMLAnchorElement): void;
declare type HTMLTag = Exclude<keyof HTMLElementTagNameMap, "object">;
declare type HTMLElementType<K extends HTMLTag = HTMLTag> = K extends HTMLTag ? HTMLElementTagNameMap[K] : HTMLElementTagNameMap[keyof HTMLElementTagNameMap];
declare type QuerySelector<K extends HTMLTag = HTMLTag> = K extends HTMLTag ? K : string;
declare const foo: <K extends "track" | "progress" | "a" | "abbr" | "address" | "applet" | "area" | "article" | "aside" | "audio" | "b" | "base" | "basefont" | "bdi" | "bdo" | "blockquote" | "body" | "br" | "button" | "canvas" | "caption" | "cite" | "code" | "col" | "colgroup" | "data" | "datalist" | "dd" | "del" | "details" | "dfn" | "dialog" | "dir" | "div" | "dl" | "dt" | "em" | "embed" | "fieldset" | "figcaption" | "figure" | "font" | "footer" | "form" | "frame" | "frameset" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "head" | "header" | "hgroup" | "hr" | "html" | "i" | "iframe" | "img" | "input" | "ins" | "kbd" | "label" | "legend" | "li" | "link" | "main" | "map" | "mark" | "marquee" | "menu" | "meta" | "meter" | "nav" | "noscript" | "ol" | "optgroup" | "option" | "output" | "p" | "param" | "picture" | "pre" | "q" | "rp" | "rt" | "ruby" | "s" | "samp" | "script" | "section" | "select" | "slot" | "small" | "source" | "span" | "strong" | "style" | "sub" | "summary" | "sup" | "table" | "tbody" | "td" | "template" | "textarea" | "tfoot" | "th" | "thead" | "time" | "title" | "tr" | "u" | "ul" | "var" | "video" | "wbr">(tag: K) => HTMLElementTagNameMap[K];
declare const baz: <K extends string>(query: K) => Element;
declare const bar: <K extends string>(query: QuerySelector<K>) => Element;
declare type BHETag = "div" | "a" | "p" | "img" | "input" | "button" | "span";
declare type BHETag2HTMLElement<K extends BHETag> = K extends "div" ? Div : K extends "a" ? HTMLAnchorElement : K extends "p" ? HTMLParagraphElement : K extends "img" ? HTMLImageElement : K extends "input" ? HTMLInputElement : K extends "button" ? HTMLButtonElement : K extends "span" ? HTMLSpanElement : never;
declare type Tag2BHE<K extends BHETag> = K extends "div" ? Div : K extends "a" ? Anchor : K extends "p" ? Paragraph : K extends "img" ? Img : K extends "input" ? Input : K extends "button" ? Button : K extends "span" ? Span : BetterHTMLElement;
declare type HTMLElement2Tag<T extends HTMLElement> = T extends HTMLInputElement ? "input" : T extends HTMLAnchorElement ? "a" : T extends HTMLDivElement ? "div" : T extends HTMLImageElement ? "img" : T extends HTMLParagraphElement ? "p" : T extends HTMLButtonElement ? "button" : T extends HTMLSpanElement ? "span" : never;
declare type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>;
declare type Enumerated<T> = T extends (infer U)[] ? [number, U][] : T extends TMap<(infer U)> ? [keyof T, U][] : T extends boolean ? never : any;
declare type TReturnBoolean = (s: string) => boolean;
declare type AnyFunction = (...args: any[]) => any;
