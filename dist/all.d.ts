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
    constructor({ query, children }: QueryBHEConstructor<T>);
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
    child<K extends Tag, T extends HTMLElementTagNameMap[K]>(selector: K): BetterHTMLElement<T>;
    child(selector: string): BetterHTMLElement;
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
declare function elem<T extends Tag>({ tag, cls, setid }: {
    tag: T;
    cls?: string;
    setid?: string;
}): BetterHTMLElement<Tag2Element<T>>;
declare function elem({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): BetterHTMLElement;
declare function elem<Q extends QuerySelector>({ query, children }: {
    query: Q;
    children?: ChildrenObj;
}): Q extends Tag ? BetterHTMLElement<Tag2Element<Q>> : BetterHTMLElement;
declare function elem<E extends HTMLElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): BetterHTMLElement<E>;
declare function span({ setid, cls, text, byid, query, htmlElement, children }?: SubElemConstructor<HTMLSpanElement>): Span;
declare function div({ setid, cls, text, byid, query, htmlElement, children }?: DivConstructor): Div;
declare function button({ setid, cls, text, byid, query, htmlElement, children }?: SubElemConstructor<HTMLButtonElement>): Button;
declare function input({ setid, cls, type, placeholder, byid, query, htmlElement, children }?: InputConstructor): Input;
declare function img({ setid, cls, src, byid, query, htmlElement, children }?: ImgConstructor): Img;
declare function paragraph({ setid, cls, text, byid, query, htmlElement, children }?: SubElemConstructor<HTMLParagraphElement>): Paragraph;
declare function anchor({ setid, cls, text, href, target, byid, query, htmlElement, children }?: AnchorConstructor): Anchor;
declare const query_input: BetterHTMLElement<HTMLInputElement>;
declare const tag_input: BetterHTMLElement<HTMLInputElement>;
declare const askjhf: Tag2Element<'input'>;
declare const shdjgjkhdskj: BetterHTMLElement<Tag2Element<"input">>;
declare const ashdjgjkhdskj: BetterHTMLElement<HTMLInputElement>;
declare const ashdjgjkhdsskj: Input;
declare function wrapWithBHE<K extends Tag, T extends Tag2Element<K>>(tag: K, htmlElement: T): BetterHTMLElement<T>;
declare function enumerate<T>(obj: T): Enumerated<T>;
declare function wait(ms: number): Promise<any>;
declare function anyValue(obj: any): boolean;
declare function noValue(obj: any): boolean;
declare function isArray<T>(obj: any): obj is Array<T>;
declare function isEmptyArr(collection: any): boolean;
declare function isEmptyObj(obj: any): boolean;
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
    tag?: Element2Tag<T>;
    cls?: string;
    setid?: string;
}
interface ByIdBHEConstructor {
    byid?: string;
    children?: ChildrenObj;
}
interface QueryBHEConstructor<T extends HTMLElement> {
    query: QuerySelector<Element2Tag<T>>;
    children?: ChildrenObj;
}
interface ByHtmlElementBHEConstructor<T extends HTMLElement> {
    htmlElement?: T;
    children?: ChildrenObj;
}
interface BHEConstructor<T extends HTMLElement> extends NewBHEConstructor<T>, ByIdBHEConstructor, QueryBHEConstructor<T>, ByHtmlElementBHEConstructor<T> {
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
    type?: "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local";
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
declare type HTMLTag2HTMLElement<K extends keyof HTMLElementTagNameMap> = {
    [P in K]: HTMLElementTagNameMap[P];
}[K];
declare type HTMLTag2HTMLElement2 = {
    [P in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[P];
};
declare const a: HTMLTag2HTMLElement<"a">;
declare const b: HTMLTag2HTMLElement2["a"];
declare type Tag = Exclude<keyof HTMLElementTagNameMap, "object">;
declare type Tag2Element<K extends Tag = Tag> = K extends Tag ? HTMLElementTagNameMap[K] : HTMLElementTagNameMap[Tag];
declare type QuerySelector<K extends Tag | string = Tag | string> = K extends Tag ? K : string;
declare const foo: <K extends "track" | "progress" | "a" | "abbr" | "address" | "applet" | "area" | "article" | "aside" | "audio" | "b" | "base" | "basefont" | "bdi" | "bdo" | "blockquote" | "body" | "br" | "button" | "canvas" | "caption" | "cite" | "code" | "col" | "colgroup" | "data" | "datalist" | "dd" | "del" | "details" | "dfn" | "dialog" | "dir" | "div" | "dl" | "dt" | "em" | "embed" | "fieldset" | "figcaption" | "figure" | "font" | "footer" | "form" | "frame" | "frameset" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "head" | "header" | "hgroup" | "hr" | "html" | "i" | "iframe" | "img" | "input" | "ins" | "kbd" | "label" | "legend" | "li" | "link" | "main" | "map" | "mark" | "marquee" | "menu" | "meta" | "meter" | "nav" | "noscript" | "ol" | "optgroup" | "option" | "output" | "p" | "param" | "picture" | "pre" | "q" | "rp" | "rt" | "ruby" | "s" | "samp" | "script" | "section" | "select" | "slot" | "small" | "source" | "span" | "strong" | "style" | "sub" | "summary" | "sup" | "table" | "tbody" | "td" | "template" | "textarea" | "tfoot" | "th" | "thead" | "time" | "title" | "tr" | "u" | "ul" | "var" | "video" | "wbr">(tag: K) => HTMLElementTagNameMap[K];
declare const baz: <K extends string>(query: K) => Element;
declare const bar: <K extends string>(query: QuerySelector<K>) => Element;
interface Tag2BHE {
    "div": Div;
    "a": Anchor;
    "p": Paragraph;
    "img": Img;
    "input": Input;
    "button": Button;
    "span": Span;
}
interface IElement2Tag {
    HTMLDivElement: "div";
    HTMLAnchorElement: "a";
    HTMLParagraphElement: "p";
    HTMLImageElement: "img";
    HTMLInputElement: "input";
    HTMLButtonElement: "button";
    HTMLSpanElement: "span";
}
declare type Element2Tag<T> = T extends HTMLInputElement ? "input" : T extends HTMLDivElement ? "div" : T extends HTMLAnchorElement ? "a" : T extends HTMLParagraphElement ? "p" : T extends HTMLImageElement ? "img" : T extends HTMLButtonElement ? "button" : T extends HTMLSpanElement ? "span" : never;
declare type MapValues<T> = {
    [K in keyof T]: T[K];
}[keyof T];
declare type HTMLElements = MapValues<HTMLElementTagNameMap>;
declare type Filter<T> = T extends HTMLElements ? T : never;
declare type GenericFilter<T, U> = T extends U ? T : never;
declare type BHETag = keyof Tag2BHE;
declare type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>;
declare type Enumerated<T> = T extends (infer U)[] ? [number, U][] : T extends TMap<(infer U)> ? [keyof T, U][] : T extends boolean ? never : any;
declare type TReturnBoolean = (s: string) => boolean;
declare type AnyFunction = (...args: any[]) => any;
interface BHE extends BetterHTMLElement {
}
