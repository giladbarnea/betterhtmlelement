declare class BadArgumentsAmountError extends Error {
    constructor(expectedArgsNum: number, passedArgs: object, details?: string);
    constructor(expectedArgsNum: [number, number], passedArgs: object, details?: string);
    static getArgNamesValues(argsWithValues: object): string;
    static getArgsWithValues(passedArgs: object): object;
}
declare const SVG_NS_URI = "http://www.w3.org/2000/svg";
declare class BetterHTMLElement {
    protected _htmlElement: HTMLElement;
    private readonly _isSvg;
    private readonly _listeners;
    private _cachedChildren;
    constructor({ tag, text, cls }: {
        tag: QuerySelector;
        text?: string;
        cls?: string;
    });
    constructor({ id, text, cls, children }: {
        id: string;
        text?: string;
        cls?: string;
        children?: ChildrenObj;
    });
    constructor({ query, text, cls, children }: {
        query: QuerySelector;
        text?: string;
        cls?: string;
        children?: ChildrenObj;
    });
    constructor({ htmlElement, text, cls, children }: {
        htmlElement: HTMLElement;
        text?: string;
        cls?: string;
        children?: ChildrenObj;
    });
    get e(): HTMLElement;
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
    child<K extends HTMLTag>(selector: K): BetterHTMLElement;
    child(selector: string): BetterHTMLElement;
    children(): BetterHTMLElement[];
    children<K extends HTMLTag>(selector: K): BetterHTMLElement[];
    children(selector: string | HTMLTag): BetterHTMLElement[];
    clone(deep?: boolean): BetterHTMLElement;
    cacheChildren(keySelectorObj: TMap<QuerySelector>): BetterHTMLElement;
    cacheChildren(keySelectorObj: TRecMap<QuerySelector>): BetterHTMLElement;
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
    attr(attrValPairs: TMap<string>): this;
    attr(attributeName: string): string;
    removeAttr(qualifiedName: string, ...qualifiedNames: string[]): this;
    data(key: string, parse?: boolean): string | TMap<string>;
}
declare class Div extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLDivElement;
    readonly e: HTMLDivElement;
    constructor({ id, text, cls }?: SubElemConstructor);
}
declare class Paragraph extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLParagraphElement;
    readonly e: HTMLParagraphElement;
    constructor({ id, text, cls }?: SubElemConstructor);
}
declare class Span extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLSpanElement;
    readonly e: HTMLSpanElement;
    constructor({ id, text, cls }?: SubElemConstructor);
}
declare class Img extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLImageElement;
    constructor({ id, src, cls }: ImgConstructor);
    src(src: string): this;
    src(): string;
    readonly e: HTMLImageElement;
}
declare class Anchor extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLAnchorElement;
    readonly e: HTMLAnchorElement;
    constructor({ id, text, cls, href }?: AnchorConstructor);
    href(): string;
    href(val: string): this;
    target(): string;
    target(val: string): this;
}
declare function elem({ tag, text, cls }: {
    tag: QuerySelector;
    text?: string;
    cls?: string;
}): BetterHTMLElement;
declare function elem({ id, text, cls, children }: {
    id: string;
    text?: string;
    cls?: string;
    children?: ChildrenObj;
}): BetterHTMLElement;
declare function elem({ query, text, cls, children }: {
    query: QuerySelector;
    text?: string;
    cls?: string;
    children?: ChildrenObj;
}): BetterHTMLElement;
declare function elem({ htmlElement, text, cls, children }: {
    htmlElement: HTMLElement;
    text?: string;
    cls?: string;
    children?: ChildrenObj;
}): BetterHTMLElement;
declare function span({ id, text, cls }?: SubElemConstructor): Span;
declare function div({ id, text, cls }?: SubElemConstructor): Div;
declare function img({ id, src, cls }?: ImgConstructor): Img;
declare function paragraph({ id, text, cls }?: SubElemConstructor): Paragraph;
declare function anchor({ id, text, cls, href }?: AnchorConstructor): Anchor;
declare function enumerate<T>(obj: T): Enumerated<T>;
declare function wait(ms: number): Promise<any>;
declare function isArray<T>(obj: any): obj is Array<T>;
declare function isEmptyArr(collection: any): boolean;
declare function isEmptyObj(obj: any): boolean;
declare type TReturnBoolean = (s: string) => boolean;
declare type AnyFunction = (...args: any[]) => any;
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
interface BaseElemConstructor {
    id?: string;
    cls?: string;
}
interface SubElemConstructor extends BaseElemConstructor {
    text?: string;
}
interface ImgConstructor extends BaseElemConstructor {
    src?: string;
}
interface AnchorConstructor extends SubElemConstructor {
    href?: string;
}
interface SvgConstructor extends BaseElemConstructor {
    htmlElement?: SVGElement;
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
declare type HTMLTag = keyof HTMLElementTagNameMap;
declare type QuerySelector = HTMLTag | string;
declare type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>;
declare type Enumerated<T> = T extends (infer U)[] ? [number, U][] : T extends TMap<(infer U)> ? [keyof T, U][] : T extends boolean ? never : any;
