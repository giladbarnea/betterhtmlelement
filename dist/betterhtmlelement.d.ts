export interface TMap<T> {
    [s: string]: T;
    [s: number]: T;
}
export interface TRecMap<T> {
    [s: string]: T | TRecMap<T>;
    [s: number]: T | TRecMap<T>;
}
export declare type EventName = keyof HTMLElementEventMap;
export declare type EventName2Function<E extends EventName = EventName> = {
    [P in EventName]?: (event: HTMLElementEventMap[P]) => void;
}[E];
export declare type MapOfEventName2Function = Partial<Record<keyof HTMLElementEventMap, EventName2Function>>;
/**
 * "a", "div"
 * @example
 * const foo = <K extends Tag>(tag: K) => document.createElement(tag);
 * foo("a") → HTMLAnchorElement
 * foo("BAD") // error
 */
export declare type Tag = Exclude<keyof HTMLElementTagNameMap, "object">;
export declare type NotTag<T extends Tag> = Exclude<Tag, T>;
export declare type QueryOrPreciseTag<Q, T extends Tag> = Exclude<Q, QuerySelector<NotTag<T>>>;
export declare type TagOrString = Tag | string;
/**
 * "a", "div", "gilad".
 * QuerySelector expects a tag and returns a Tag.
 * @example
 * const bar = <K extends Tag | string>(query: QuerySelector<K>) => document.querySelector(query);
 * bar("a") → HTMLAnchorElement
 * bar("gilad") → HTMLSelectElement | HTMLLegendElement | ...
 */
export declare type QuerySelector<K extends TagOrString = TagOrString> = K extends Tag ? K : string;
export declare type Element2Tag<T> = T extends HTMLInputElement ? "input" : T extends HTMLAnchorElement ? "a" : T extends HTMLImageElement ? "img" : Tag;
export declare type ChildrenObj = TRecMap<QuerySelector | BetterHTMLElement | typeof BetterHTMLElement>;
export declare type Enumerated<T> = T extends (infer U)[] ? [number, U][] : T extends TRecMap<(infer U)> ? [keyof T, U][] : T extends boolean ? never : any;
export declare type Returns<T> = (s: string) => T;
export declare type Awaited<T> = T extends Promise<infer U> ? U : T;
export declare type OmittedCssProps = "animationDirection" | "animationFillMode" | "animationIterationCount" | "animationPlayState" | "animationTimingFunction" | "opacity" | "padding" | "paddingBottom" | "paddingLeft" | "paddingRight" | "paddingTop" | "preload" | "width";
export declare type PartialCssStyleDeclaration = Omit<Partial<CSSStyleDeclaration>, OmittedCssProps>;
export interface CssOptions extends PartialCssStyleDeclaration {
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
export declare type CubicBezierFunction = [number, number, number, number];
export declare type Jumpterm = 'jump-start' | 'jump-end' | 'jump-none' | 'jump-both' | 'start' | 'end';
/**Displays an animation iteration along n stops along the transition, displaying each stop for equal lengths of time.
 * For example, if n is 5,  there are 5 steps.
 * Whether the animation holds temporarily at 0%, 20%, 40%, 60% and 80%, on the 20%, 40%, 60%, 80% and 100%, or makes 5 stops between the 0% and 100% along the animation, or makes 5 stops including the 0% and 100% marks (on the 0%, 25%, 50%, 75%, and 100%) depends on which of the following jump terms is used*/
export declare type StepsFunction = [number, Jumpterm];
export declare type AnimationTimingFunction = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | StepsFunction | CubicBezierFunction;
export declare type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
export declare type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';
export interface TransformOptions {
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
export interface AnimateOptions {
    delay?: string;
    direction?: AnimationDirection;
    duration: string;
    fillMode?: AnimationFillMode;
    iterationCount?: number;
    name: string;
    playState?: AnimationPlayState;
    /** Also accepts:
     * cubic-bezier(p1, p2, p3, p4)
     * 'ease' == 'cubic-bezier(0.25, 0.1, 0.25, 1.0)'
     * 'linear' == 'cubic-bezier(0.0, 0.0, 1.0, 1.0)'
     * 'ease-in' == 'cubic-bezier(0.42, 0, 1.0, 1.0)'
     * 'ease-out' == 'cubic-bezier(0, 0, 0.58, 1.0)'
     * 'ease-in-out' == 'cubic-bezier(0.42, 0, 0.58, 1.0)'
     * */
    timingFunction?: AnimationTimingFunction;
}
export declare function enumerate<T>(obj: T): Enumerated<T>;
export declare function wait(ms: number): Promise<any>;
export declare function bool(val: any): boolean;
export declare function isArray<T>(obj: any): obj is Array<T>;
export declare function isEmptyArr(collection: any): boolean;
export declare function isEmptyObj(obj: any): boolean;
export declare function isFunction<F>(fn: F): fn is F;
export declare function isFunction(fn: (...args: any[]) => any): fn is (...args: any[]) => any;
export declare function anyDefined(obj: any): boolean;
export declare function anyTruthy(obj: any): boolean;
export declare function allUndefined(obj: any): boolean;
/**Check every `checkInterval` ms if `cond()` is truthy. If, within `timeout`, cond() is truthy, return `true`. Return `false` if time is out.
 * @example
 * // Give the user a 200ms chance to get her pointer over "mydiv". Continue immediately once she does, or after 200ms if she doesn't.
 * mydiv.pointerenter( () => mydiv.pointerHovering = true; )
 * const pointerOnMydiv = await waitUntil(() => mydiv.pointerHovering, 200, 10);*/
export declare function waitUntil(cond: () => boolean, checkInterval?: number, timeout?: number): Promise<boolean>;
export declare function isBHE<T extends BetterHTMLElement>(bhe: T, bheSubType: any): bhe is T;
export declare function isType<T>(arg: T): arg is T;
export declare function isTMap<T>(obj: TMap<T>): obj is TMap<T>;
/**true for any non-primitive, including array, function*/
export declare function isObject(obj: any): boolean;
export declare function shallowProperty<T>(key: string): (obj: T) => T extends null ? undefined : T[keyof T];
export declare function getLength(collection: any): number;
export declare function isArrayLike(collection: any): boolean;
export declare function extend(sup: any, child: any): any;
export declare function anyValue(obj: any): boolean;
export declare function equalsAny(obj: any, ...others: any[]): boolean;
export declare function noValue(obj: any): boolean;
export declare function getArgsFullRepr(argsWithValues: TMap<any>): string;
export declare function getArgsWithValues(passedArgs: TMap<any>): TMap<any>;
export declare function summary(argset: TMap<any>): string;
/**Prints what was expected and what was actually passed.*/
export declare class MutuallyExclusiveArgs extends Error {
    /**@param passedArgs - key:value pairs of argName:argValue, where each arg is mutually exclusive with all others*/
    constructor(passedArgs: TMap<any>, details?: string);
    /**@param passedArgs - Array of mutually exclusive sets of args, where an arg from one set means there can't be any args from the other sets.
     * Each set is key:value pairs of argName:argValue.*/
    constructor(passedArgs: TMap<any>[], details?: string);
}
export declare class NotEnoughArgs extends Error {
    constructor(expected: number | number[], passedArgs: TMap<any> | TMap<any>[], relation?: 'each' | 'either');
}
export declare class BHETypeError extends TypeError {
    constructor(options: {
        faultyValue: TMap<any>;
        expected?: any | any[];
        where?: string;
        message?: string;
    });
}
export declare class ValueError extends BHETypeError {
}
export declare class BetterHTMLElement<Generic extends HTMLElement = HTMLElement> {
    protected _htmlElement: Generic;
    private readonly _isSvg;
    private readonly _listeners;
    private _cachedChildren;
    /**Create an element of `tag`. Optionally, set its `cls` or `id`. */
    constructor({ tag, cls, setid, html }: {
        tag: Element2Tag<Generic>;
        cls?: string;
        setid?: string;
        html?: string;
    });
    /**Wrap an existing element by `byid`. Optionally cache existing `children`*/
    constructor({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    });
    /**Wrap an existing element by `query`. Optionally cache existing `children`*/
    constructor({ query, children }: {
        query: QuerySelector;
        children?: ChildrenObj;
    });
    /**Wrap an existing HTMLElement. Optionally cache existing `children`*/
    constructor({ htmlElement, children }: {
        htmlElement: Generic;
        children?: ChildrenObj;
    });
    /**Return the wrapped HTMLElement*/
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
    toString(): any;
    /**Sets `this._htmlElement` to `newHtmlElement._htmlElement`.
     * Resets `this._cachedChildren` and caches `newHtmlElement._cachedChildren`.
     * Adds event listeners from `newHtmlElement._listeners`, while keeping `this._listeners`.*/
    wrapSomethingElse<T extends HTMLElement>(newHtmlElement: BetterHTMLElement<T>): this;
    /**Sets `this._htmlElement` to `newHtmlElement`.
     * Keeps `this._listeners`.
     * NOTE: this reinitializes `this._cachedChildren` and all event listeners belonging to `newHtmlElement` are lost. Pass a `BetterHTMLElement` to keep them.*/
    wrapSomethingElse(newHtmlElement: Node): this;
    /**Set the element's innerHTML*/
    html(html: string): this;
    /**Get the element's innerHTML*/
    html(): string;
    /**Set the element's innerText*/
    text(txt: string | number): this;
    /**Get the element's innerText*/
    text(): string;
    /**Set the id of the element*/
    id(id: string): this;
    /**Get the id of the element*/
    id(): string;
    /**For each `{<styleAttr>: <styleVal>}` pair, set the `style[styleAttr]` to `styleVal`.*/
    css(css: Partial<CssOptions>): this;
    /**Get `style[css]`*/
    css(css: string): string;
    /**Remove the value of the passed style properties*/
    uncss(...removeProps: (keyof CssOptions)[]): this;
    /**`.className = cls`*/
    class(cls: string): this;
    /**Return the first class that matches `cls` predicate.*/
    class(cls: Returns<boolean>): string;
    /**Return a string array of the element's classes (not a classList)*/
    class(): string[];
    addClass(cls: string, ...clses: string[]): this;
    removeClass(cls: Returns<boolean>, ...clses: Returns<boolean>[]): this;
    removeClass(cls: string, clses?: string[]): this;
    replaceClass(oldToken: Returns<boolean>, newToken: string): this;
    replaceClass(oldToken: string, newToken: string): this;
    toggleClass(cls: Returns<boolean>, force?: boolean): this;
    toggleClass(cls: string, force?: boolean): this;
    /**Returns `this._htmlElement.classList.contains(cls)` */
    hasClass(cls: string): boolean;
    /**Returns whether `this` has a class that matches passed function */
    hasClass(cls: Returns<boolean>): boolean;
    /**Insert at least one `node` just after `this`. Any `node` can be either `BetterHTMLElement`s or vanilla `Node`.*/
    after(...nodes: Array<BetterHTMLElement | Node>): this;
    /**Insert `this` just after a `BetterHTMLElement` or a vanilla `Node`.*/
    insertAfter(node: BetterHTMLElement | HTMLElement): this;
    /**Insert at least one `node` after the last child of `this`.
     * Any `node` can be either a `BetterHTMLElement`, a vanilla `Node`,
     * a `{someKey: BetterHTMLElement}` pairs object, or a `[someKey, BetterHTMLElement]` tuple.*/
    append(...nodes: Array<BetterHTMLElement | Node | TMap<BetterHTMLElement> | [string, BetterHTMLElement]>): this;
    /**Append `this` to a `BetterHTMLElement` or a vanilla `Node`*/
    appendTo(node: BetterHTMLElement | HTMLElement): this;
    /**Insert at least one `node` just before `this`. Any `node` can be either `BetterHTMLElement`s or vanilla `Node`.*/
    before(...nodes: Array<BetterHTMLElement | Node>): this;
    /**Insert `this` just before a `BetterHTMLElement` or a vanilla `Node`s.*/
    insertBefore(node: BetterHTMLElement | HTMLElement): this;
    replaceChild(newChild: Node, oldChild: Node): this;
    replaceChild(newChild: BetterHTMLElement, oldChild: BetterHTMLElement): this;
    /**For each `[key, child]` pair, `append(child)` and store it in `this[key]`. */
    cacheAppend(keyChildPairs: TMap<BetterHTMLElement>): this;
    /**For each `[key, child]` tuple, `append(child)` and store it in `this[key]`. */
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
    /**Return a `BetterHTMLElement` list of all children */
    children(): BetterHTMLElement[];
    /**Return a `BetterHTMLElement` list of all children selected by `selector` */
    children<K extends Tag>(selector: K): BetterHTMLElement[];
    /**Return a `BetterHTMLElement` list of all children selected by `selector` */
    children(selector: QuerySelector): BetterHTMLElement[];
    clone(deep?: boolean): BetterHTMLElement;
    /**
     * Stores child BHE's in `this` so they can be accessed e.g. `navbar.home.class('selected')`.
     * @example
     * navbar.cacheChildren({ 'home': 'button.home' })
     * // or
     * maindiv.cacheChildren({ 'welcome': paragraph({ 'query': 'p.welcome' }) })
     * // `childrenObj` can be recursive and mixed, e.g.
     * navbar.cacheChildren({
     *      home: {
     *          'li.navbar-item-home': {
     *              thumbnail: 'img.home-thumbnail',
     *              expand: button({ byid: 'home_expand' })
     *          }
     *      }
     *  });
     * navbar.home.class("selected");
     * navbar.home.thumbnail.css(...);
     * navbar.home.expand.click( e => {...} )
     * @see this.child*/
    cacheChildren(childrenObj: ChildrenObj): this;
    /**Remove all children from DOM*/
    empty(): this;
    /**Remove element from DOM*/
    remove(): this;
    on(evTypeFnPairs: TMap<EventName2Function>, options?: AddEventListenerOptions): this;
    /** Add a `touchstart` event listener. This is the fast alternative to `click` listeners for mobile (no 300ms wait). */
    touchstart(fn: (ev: TouchEvent) => any, options?: AddEventListenerOptions): this;
    /** Add a `pointerdown` event listener if browser supports `pointerdown`, else send `mousedown` (safari). */
    pointerdown(fn: (event: PointerEvent | MouseEvent) => any, options?: AddEventListenerOptions): this;
    /**Simulate a click of the element. Useful for `<a>` elements.*/
    click(): this;
    /**Add a `click` event listener. You should probably use `pointerdown()` if on desktop, or `touchstart()` if on mobile.*/
    click(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    /**Blur (unfocus) the element.*/
    blur(): this;
    /**Add a `blur` event listener*/
    blur(fn: (event: FocusEvent) => any, options?: AddEventListenerOptions): this;
    /**Focus the element.*/
    focus(): this;
    /**Add a `focus` event listener*/
    focus(fn: (event: FocusEvent) => any, options?: AddEventListenerOptions): this;
    /**Add a `change` event listener*/
    change(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    /**Add a `contextmenu` event listener*/
    contextmenu(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    /**Simulate a double click of the element.*/
    dblclick(): this;
    /**Add a `dblclick` event listener*/
    dblclick(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    /**Simulate a mouseenter event to the element.*/
    mouseenter(): this;
    /**Add a `mouseenter` event listener*/
    mouseenter(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    /**Add a `keydown` event listener*/
    keydown(fn: (event: KeyboardEvent) => any, options?: AddEventListenerOptions): this;
    /**Add a `mouseout` event listener*/
    mouseout(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    /**Add a `mouseover` event listener*/
    mouseover(fn: (event: MouseEvent) => void, options?: AddEventListenerOptions): this;
    /** Remove the event listener of `event`, if exists.*/
    off(event: EventName): this;
    /** Remove all event listeners in `_listeners`*/
    allOff(): this;
    /** For each `[attr, val]` pair, apply `setAttribute`*/
    attr(attrValPairs: TMap<string | boolean>): this;
    /** apply `getAttribute`*/
    attr(attributeName: string): string;
    /** `removeAttribute` */
    removeAttr(qualifiedName: string, ...qualifiedNames: string[]): this;
    /**`getAttribute(`data-${key}`)`. JSON.parse it by default.*/
    getdata(key: string, parse?: boolean): string | TMap<string>;
    private _cache;
}
export declare class Div<Q extends QuerySelector = QuerySelector> extends BetterHTMLElement<HTMLDivElement> {
    /**Create a HTMLDivElement. Optionally, set its `text`, `cls` or `id`. */
    constructor({ cls, setid, text }: {
        cls?: string;
        setid?: string;
        text?: string;
    });
    /**Create a HTMLDivElement. Optionally, set its `html`, `cls` or `id`. */
    constructor({ cls, setid, html }: {
        cls?: string;
        setid?: string;
        html?: string;
    });
    /**Wrap an existing element by `byid`. Optionally cache existing `children`*/
    constructor({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    });
    /**Wrap an existing element by `query`. Optionally cache existing `children`*/
    constructor({ query, children }: {
        query: QueryOrPreciseTag<Q, "div">;
        children?: ChildrenObj;
    });
    /**Wrap an existing HTMLElement. Optionally cache existing `children`*/
    constructor({ htmlElement, children }: {
        htmlElement: HTMLDivElement;
        children?: ChildrenObj;
    });
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
    constructor({ cls, setid, html }: {
        cls?: string;
        setid?: string;
        html?: string;
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
export declare class Img<Q extends QuerySelector = QuerySelector> extends BetterHTMLElement<HTMLImageElement> {
    constructor({ cls, setid, src }: {
        cls?: string;
        setid?: string;
        src?: string;
    });
    constructor({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    });
    constructor({ query, children }: {
        query: QueryOrPreciseTag<Q, "img">;
        children?: ChildrenObj;
    });
    constructor({ htmlElement, children }: {
        htmlElement: HTMLImageElement;
        children?: ChildrenObj;
    });
    constructor();
    src(src: string): this;
    src(): string;
}
export declare class Anchor extends BetterHTMLElement<HTMLAnchorElement> {
    constructor({ setid, cls, text, html, href, target, byid, query, htmlElement, children }: {
        setid: any;
        cls: any;
        text: any;
        html: any;
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
    /**
     Button < Input
     Select - Input: add(), item(), length, namedItem(), options, remove(), selectedIndex, selectedOptions, ITERATOR
     Select - Button: add() autocomplete item() length multiple namedItem() options remove() required selectedIndex selectedOptions size ITERATOR
     Button - Select: formAction formEnctype formMethod formNoValidate formTarget

     Input uniques:
     accept checked defaultChecked defaultValue dirName files indeterminate list max maxLength min minLength pattern placeholder readOnly select() selectionDirection selectionEnd selectionStart setRangeText() setSelectionRange() src step stepDown() stepUp() useMap valueAsDate valueAsNumber

     Select uniques:
     add() item() length namedItem() options remove() selectedIndex selectedOptions ITERATOR

     Shared among Button, Select and Input: (or Button and Select, same)
     checkValidity() disabled form labels name reportValidity() setCustomValidity() type validationMessage validity value willValidate

     Shared ammong Selecct and Input:
     autocomplete checkValidity() disabled form labels multiple name reportValidity() required setCustomValidity() type validationMessage validity value willValidate

     */
    disable(): this;
    enable(): this;
    /**Disables.*/
    toggleEnabled(on: null | undefined | 0): this;
    /**Calls `enable()` or `disable()` accordingly. */
    toggleEnabled(on: boolean): this;
    /**Returns undefined if `_htmlElement.value` is null or undefined, otherwise returns `_htmlElement.value`*/
    value(): any;
    /**Returns undefined if `_htmlElement.value` is null or undefined, otherwise returns `_htmlElement.value`*/
    value(val: undefined): any;
    /**Resets `value`. */
    value(val: null | ''): this;
    /**Sets `value` */
    value(val: any): this;
    flashBad(): Promise<void>;
    flashGood(): Promise<void>;
    clear(): this;
    _beforeEvent(): this;
    /**Calls `self.disable()`.*/
    _beforeEvent(thisArg: this): this;
    _onEventSuccess(ret: any): this;
    _onEventSuccess(ret: any, thisArg: this): this;
    _softErr(e: Error): Promise<this>;
    _softErr(e: Error, thisArg: this): Promise<this>;
    _softWarn(e: Error): Promise<this>;
    _softWarn(e: Error, thisArg: this): Promise<this>;
    _afterEvent(): this;
    _afterEvent(thisArg: this): this;
    /**Used by e.g. `click(fn)` to wrap passed `fn` safely and trigger `_[before|after|on]Event[Success|Error]`.*/
    protected _wrapFnInEventHooks<F extends (event: Event) => Promise<any>>(asyncFn: F, event: Event): Promise<void>;
}
export declare class Button<Q extends QuerySelector = QuerySelector> extends Form<HTMLButtonElement> {
    constructor({ cls, setid, text, click }: {
        cls?: string;
        setid?: string;
        text?: string;
        click?: (event: MouseEvent) => any;
    });
    constructor({ cls, setid, html, click }: {
        cls?: string;
        setid?: string;
        html?: string;
        click?: (event: MouseEvent) => any;
    });
    constructor({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    });
    constructor({ query, children }: {
        query: QueryOrPreciseTag<Q, "button">;
        children?: ChildrenObj;
    });
    constructor({ htmlElement, children }: {
        htmlElement: HTMLButtonElement;
        children?: ChildrenObj;
    });
    constructor();
    click(_fn?: (_event: MouseEvent) => Promise<any>): this;
}
export declare class Input<TInputType extends InputType, Generic extends FormishHTMLElement = HTMLInputElement, Q extends QuerySelector = QuerySelector> extends Form<Generic> {
    type: TInputType;
    constructor({ cls, setid, type }: {
        cls?: string;
        setid?: string;
        type?: TInputType;
    });
    constructor({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    });
    constructor({ query, children }: {
        query: QueryOrPreciseTag<Q, "input">;
        children?: ChildrenObj;
    });
    constructor({ htmlElement, children }: {
        htmlElement: Generic;
        children?: ChildrenObj;
    });
    constructor();
}
export declare class TextInput<Q extends QuerySelector = QuerySelector> extends Input<"text"> {
    constructor({ cls, setid, placeholder }: {
        cls?: string;
        setid?: string;
        placeholder?: string;
    });
    constructor({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    });
    constructor({ query, children }: {
        query: QueryOrPreciseTag<Q, "input">;
        children?: ChildrenObj;
    });
    constructor({ htmlElement, children }: {
        htmlElement: HTMLInputElement;
        children?: ChildrenObj;
    });
    constructor();
    placeholder(val: string): this;
    placeholder(): string;
    keydown(_fn: (_event: KeyboardEvent) => Promise<any>): this;
}
export declare class Changable<TInputType extends InputType, Generic extends FormishHTMLElement> extends Input<TInputType, Generic> {
    change(_fn: (_event: Event) => Promise<any>): this;
}
/**Patches Form's `value()` to set/get `_htmlElement.checked`, and `clear()` to uncheck. */
export declare class CheckboxInput extends Changable<"checkbox", HTMLInputElement> {
    constructor(opts: any);
    get checked(): boolean;
    check(): this;
    uncheck(): this;
    /**Disables.*/
    toggleChecked(on: null | undefined | 0): this;
    /**Calls `check()` or `uncheck()` accordingly. */
    toggleChecked(on: boolean): this;
    /**Returns undefined if `_htmlElement.value` is null or undefined, otherwise returns `_htmlElement.value`*/
    value(): any;
    /**Returns undefined if `_htmlElement.value` is null or undefined, otherwise returns `_htmlElement.value`*/
    value(val: undefined): any;
    /**Resets `value`. */
    value(val: null | ''): this;
    /**Sets `value` */
    value(val: any): this;
    clear(): this;
    _softErr(e: Error, thisArg?: this): Promise<this>;
}
export declare class Select extends Changable<undefined, HTMLSelectElement> {
    constructor(selectOpts: any);
    get selectedIndex(): number;
    set selectedIndex(val: number);
    get selected(): HTMLOptionElement;
    /**@param val - Either a specific HTMLOptionElement, number (index)*/
    set selected(val: HTMLOptionElement);
    get options(): HTMLOptionElement[];
    item(index: number): HTMLOptionElement;
    /**Returns undefined if `this.selected.value` is null or undefined, otherwise returns `this.selected.value`*/
    value(): any;
    /**Returns undefined if `this.selected.value` is null or undefined, otherwise returns `this.selected.value`*/
    value(val: undefined): any;
    /**Resets `selected` to blank*/
    value(val: null | '' | boolean): this;
    /**Sets `selected` to `val` if finds a match */
    value(val: HTMLOptionElement | number | any): this;
    /**Sets `selected` to 0th element. Equivalent to `value(0)`.*/
    clear(): this;
}
/**Create an element of `create`. Optionally, set its `text` and / or `cls`*/
export declare function elem<T extends Tag>({ tag, cls, setid, html }: {
    tag: T;
    cls?: string;
    setid?: string;
    html?: string;
}): T extends Tag ? BetterHTMLElement<HTMLElementTagNameMap[T]> : never;
/**Get an existing element by `id`. Optionally, set its `text`, `cls` or cache `children`*/
export declare function elem({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): BetterHTMLElement;
/**Get an existing element by `query`. Optionally, set its `text`, `cls` or cache `children`*/
export declare function elem<Q extends QuerySelector>({ query, children }: {
    query: Q;
    children?: ChildrenObj;
}): Q extends Tag ? BetterHTMLElement<HTMLElementTagNameMap[Q]> : BetterHTMLElement;
/**Wrap an existing HTMLElement. Optionally, set its `text`, `cls` or cache `children`*/
export declare function elem<E extends HTMLElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): BetterHTMLElement<E>;
export declare function span({ cls, setid, text }: {
    cls?: string;
    setid?: string;
    text?: string;
}): Span;
export declare function span({ cls, setid, html }: {
    cls?: string;
    setid?: string;
    html?: string;
}): Span;
export declare function span({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Span;
export declare function span<Q extends QuerySelector>({ query, children }: {
    query: QueryOrPreciseTag<Q, "span">;
    children?: ChildrenObj;
}): Span;
export declare function span<E extends HTMLSpanElement>({ htmlElement, children }: {
    htmlElement: E;
    children?: ChildrenObj;
}): Span;
export declare function span(): Span;
/**Create a Div element, or wrap an existing one by passing htmlElement. Optionally set its id, text or cls.*/
export declare function div({ cls, setid, text }: {
    cls?: string;
    setid?: string;
    text?: string;
}): Div;
export declare function div({ cls, setid, html }: {
    cls?: string;
    setid?: string;
    html?: string;
}): Div;
export declare function div({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Div;
export declare function div<Q extends QuerySelector>({ query, children }: {
    query: QueryOrPreciseTag<Q, "div">;
    children?: ChildrenObj;
}): Div;
export declare function div({ htmlElement, children }: {
    htmlElement: HTMLDivElement;
    children?: ChildrenObj;
}): Div;
export declare function div(): Div;
export declare function button({ cls, setid, text }: {
    cls?: string;
    setid?: string;
    text?: string;
    click?: (event: MouseEvent) => any;
}): Button;
export declare function button({ cls, setid, html }: {
    cls?: string;
    setid?: string;
    html?: string;
    click?: (event: MouseEvent) => any;
}): Button;
export declare function button({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Button;
export declare function button<Q extends QuerySelector>({ query, children }: {
    query: QueryOrPreciseTag<Q, "button">;
    children?: ChildrenObj;
}): Button;
export declare function button({ htmlElement, children }: {
    htmlElement: HTMLButtonElement;
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
    query: QueryOrPreciseTag<Q, "input">;
    children?: ChildrenObj;
}): Input<TInputType, Generic>;
export declare function input<TInputType extends InputType = InputType, Generic extends FormishHTMLElement = HTMLInputElement>({ htmlElement, children }: {
    htmlElement: Generic;
    children?: ChildrenObj;
}): Input<TInputType, Generic>;
export declare function input<TInputType extends InputType = InputType, Generic extends FormishHTMLElement = HTMLInputElement>(): Input<TInputType, Generic>;
export declare function select(selectOpts: any): Select;
/**Create an Img element, or wrap an existing one by passing htmlElement. Optionally set its id, src or cls.*/
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
    query: QueryOrPreciseTag<Q, "img">;
    children?: ChildrenObj;
}): Img;
export declare function img({ htmlElement, children }: {
    htmlElement: HTMLImageElement;
    children?: ChildrenObj;
}): Img;
export declare function img(): Img;
export declare function paragraph({ cls, setid, text }: {
    cls?: string;
    setid?: string;
    text?: string;
}): Paragraph;
export declare function paragraph({ cls, setid, html }: {
    cls?: string;
    setid?: string;
    html?: string;
}): Paragraph;
export declare function paragraph({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Paragraph;
export declare function paragraph<Q extends QuerySelector>({ query, children }: {
    query: QueryOrPreciseTag<Q, "p">;
    children?: ChildrenObj;
}): Paragraph;
export declare function paragraph({ htmlElement, children }: {
    htmlElement: HTMLParagraphElement;
    children?: ChildrenObj;
}): Paragraph;
export declare function paragraph(): Paragraph;
export declare function anchor({ cls, setid, href, target, text }: {
    cls?: string;
    setid?: string;
    href?: string;
    target?: string;
    text?: string;
}): Anchor;
export declare function anchor({ cls, setid, href, target, html }: {
    cls?: string;
    setid?: string;
    href?: string;
    target?: string;
    html?: string;
}): Anchor;
export declare function anchor({ byid, children }: {
    byid: string;
    children?: ChildrenObj;
}): Anchor;
export declare function anchor<Q extends QuerySelector>({ query, children }: {
    query: QueryOrPreciseTag<Q, "a">;
    children?: ChildrenObj;
}): Anchor;
export declare function anchor({ htmlElement, children }: {
    htmlElement: HTMLAnchorElement;
    children?: ChildrenObj;
}): Anchor;
export declare function anchor(): Anchor;
export {};
