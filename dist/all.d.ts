declare module "index" {
    import { ChildrenObj, Element2Tag, NotTag, QuerySelector, Tag, TEvent, TEventFunctionMap, TMap, TRecMap, TReturnBoolean } from "typings/misc";
    export class BetterHTMLElement<T extends HTMLElement = HTMLElement> {
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
    export class Div extends BetterHTMLElement<HTMLDivElement> {
        constructor(divOpts: any);
    }
    export class Button extends BetterHTMLElement<HTMLButtonElement> {
        constructor(buttonOpts: any);
    }
    export class Paragraph extends BetterHTMLElement<HTMLParagraphElement> {
        constructor(pOpts: any);
    }
    export class Span extends BetterHTMLElement<HTMLSpanElement> {
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
    export class Input extends BetterHTMLElement<HTMLInputElement> {
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
    export class Img extends BetterHTMLElement<HTMLImageElement> {
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
    export class Anchor extends BetterHTMLElement<HTMLAnchorElement> {
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
    export function elem<T extends Tag>({ tag, cls, setid }: {
        tag: T;
        cls?: string;
        setid?: string;
    }): T extends Tag ? BetterHTMLElement<HTMLElementTagNameMap[T]> : never;
    export function elem({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    }): BetterHTMLElement;
    export function elem<Q extends QuerySelector>({ query, children }: {
        query: Q;
        children?: ChildrenObj;
    }): Q extends Tag ? BetterHTMLElement<HTMLElementTagNameMap[Q]> : BetterHTMLElement;
    export function elem<E extends HTMLElement>({ htmlElement, children }: {
        htmlElement: E;
        children?: ChildrenObj;
    }): BetterHTMLElement<E>;
    export function span({ cls, setid, text }: {
        cls?: string;
        setid?: string;
        text?: string;
    }): Span;
    export function span({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    }): Span;
    export function span<Q extends QuerySelector>({ query, children }: {
        query: Q extends QuerySelector<NotTag<"span">> ? never : Q;
        children?: ChildrenObj;
    }): Span;
    export function span<E extends HTMLSpanElement>({ htmlElement, children }: {
        htmlElement: E;
        children?: ChildrenObj;
    }): Span;
    export function span(): Span;
    export function div({ cls, setid, text }: {
        cls?: string;
        setid?: string;
        text?: string;
    }): Div;
    export function div({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    }): Div;
    export function div<Q extends QuerySelector>({ query, children }: {
        query: Q extends QuerySelector<NotTag<"div">> ? never : Q;
        children?: ChildrenObj;
    }): Div;
    export function div<E extends HTMLDivElement>({ htmlElement, children }: {
        htmlElement: E;
        children?: ChildrenObj;
    }): Div;
    export function div(): Div;
    export function button({ cls, setid, text }: {
        cls?: string;
        setid?: string;
        text?: string;
    }): Button;
    export function button({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    }): Button;
    export function button<Q extends QuerySelector>({ query, children }: {
        query: Q extends QuerySelector<NotTag<"button">> ? never : Q;
        children?: ChildrenObj;
    }): Button;
    export function button<E extends HTMLButtonElement>({ htmlElement, children }: {
        htmlElement: E;
        children?: ChildrenObj;
    }): Button;
    export function button(): Button;
    export function input({ cls, setid, type, placeholder }: {
        cls?: string;
        setid?: string;
        type?: "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local";
        placeholder?: string;
    }): Input;
    export function input({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    }): Input;
    export function input<Q extends QuerySelector>({ query, children }: {
        query: Q extends QuerySelector<NotTag<"input">> ? never : Q;
        children?: ChildrenObj;
    }): Input;
    export function input<E extends HTMLInputElement>({ htmlElement, children }: {
        htmlElement: E;
        children?: ChildrenObj;
    }): Input;
    export function input(): Input;
    export function img({ cls, setid, src }: {
        cls?: string;
        setid?: string;
        src?: string;
    }): Img;
    export function img({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    }): Img;
    export function img<Q extends QuerySelector>({ query, children }: {
        query: Q extends QuerySelector<NotTag<"img">> ? never : Q;
        children?: ChildrenObj;
    }): Img;
    export function img<E extends HTMLImageElement>({ htmlElement, children }: {
        htmlElement: E;
        children?: ChildrenObj;
    }): Img;
    export function img(): Img;
    export function paragraph({ cls, setid, text }: {
        cls?: string;
        setid?: string;
        text?: string;
    }): Paragraph;
    export function paragraph({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    }): Paragraph;
    export function paragraph<Q extends QuerySelector>({ query, children }: {
        query: Q extends QuerySelector<NotTag<"p">> ? never : Q;
        children?: ChildrenObj;
    }): Paragraph;
    export function paragraph<E extends HTMLParagraphElement>({ htmlElement, children }: {
        htmlElement: E;
        children?: ChildrenObj;
    }): Paragraph;
    export function paragraph(): Paragraph;
    export function anchor({ cls, setid, href, target }: {
        cls?: string;
        setid?: string;
        href?: string;
        target?: string;
    }): Anchor;
    export function anchor({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    }): Anchor;
    export function anchor<Q extends QuerySelector>({ query, children }: {
        query: Q extends QuerySelector<NotTag<"a">> ? never : Q;
        children?: ChildrenObj;
    }): Anchor;
    export function anchor<E extends HTMLImageElement>({ htmlElement, children }: {
        htmlElement: E;
        children?: ChildrenObj;
    }): Anchor;
    export function anchor(): Anchor;
    export function wrapWithBHE(tag: "img", htmlElement: HTMLImageElement): Img;
    export function wrapWithBHE(tag: "input", htmlElement: HTMLInputElement): Input;
    export function wrapWithBHE(tag: "a", htmlElement: HTMLAnchorElement): Anchor;
    export function wrapWithBHE(tag: "p", htmlElement: HTMLParagraphElement): Paragraph;
    export function wrapWithBHE(tag: "span", htmlElement: HTMLSpanElement): Span;
    export function wrapWithBHE(tag: "button", htmlElement: HTMLButtonElement): Button;
    export function wrapWithBHE(tag: "div", htmlElement: HTMLDivElement): Div;
    export function wrapWithBHE(tag: any, htmlElement: HTMLElement): BetterHTMLElement;
}
declare module "typings/misc" {
    import { Div, Anchor, Paragraph, Img, Input, Button, Span } from "index";
    export interface TMap<T> {
        [s: string]: T;
        [s: number]: T;
    }
    export interface TRecMap<T> {
        [s: string]: T | TRecMap<T>;
        [s: number]: T | TRecMap<T>;
    }
    export type TEvent = keyof HTMLElementEventMap;
    export type TEventFunctionMap<K extends TEvent> = {
        [P in K]?: (event: HTMLElementEventMap[P]) => void;
    };
    export type Tag = Exclude<keyof HTMLElementTagNameMap, "object">;
    export type NotTag<T extends Tag> = Exclude<Tag, T>;
    export type Tag2Element<K extends Tag = Tag> = K extends Tag ? HTMLElementTagNameMap[K] : HTMLElementTagNameMap[Tag];
    type TagOrString = Tag | string;
    export type QuerySelector<K extends TagOrString = TagOrString> = K extends Tag ? K : string;
    export interface Tag2BHE {
        "img": Img;
        "a": Anchor;
        "input": Input;
        "div": Div;
        "p": Paragraph;
        "button": Button;
        "span": Span;
    }
    export type BHETag = keyof Tag2BHE;
    export type Element2Tag<T> = T extends HTMLInputElement ? "input" : T extends HTMLAnchorElement ? "a" : T extends HTMLImageElement ? "img" : Tag;
    export type MapValues<T> = {
        [K in keyof T]: T[K];
    }[keyof T];
    export type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>;
    export type Enumerated<T> = T extends (infer U)[] ? [number, U][] : T extends TMap<(infer U)> ? [keyof T, U][] : T extends boolean ? never : any;
    export type TReturnBoolean = (s: string) => boolean;
    export type AnyFunction = (...args: any[]) => any;
    export type Callable<T1, T2, F> = F extends (a1: T1, a2: T2) => infer R ? R : any;
    export type Callable2<T1, F> = F extends (a1: T1, a2: HTMLElement) => infer R ? R : any;
}
declare module "util" {
    import { AnyFunction, Enumerated } from "typings/misc";
    import { BetterHTMLElement } from "index";
    export function enumerate<T>(obj: T): Enumerated<T>;
    export function bool(val: any): boolean;
    export function anyValue(obj: any): boolean;
    export function noValue(obj: any): boolean;
    export function isArray<T>(obj: any): obj is Array<T>;
    export function isBHE<T extends BetterHTMLElement>(bhe: T, bheSubType: any): bhe is T;
    export function isType<T>(arg: T): arg is T;
    export function isFunction(fn: AnyFunction): fn is AnyFunction;
    export function isObject(obj: any): boolean;
}
declare module "exceptions" {
    export class MutuallyExclusiveArgs extends Error {
        constructor(passedArgs: object, details?: string);
    }
    export class NotEnoughArgs extends Error {
        constructor(expected: number | number[], passedArgs: object, details?: string);
    }
}
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
declare module "typings/ctors" { }
