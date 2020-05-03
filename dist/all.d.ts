declare function getArgNamesValues(argsWithValues: object): string;
declare function getArgsWithValues(passedArgs: object): object;
declare class MutuallyExclusiveArgs extends Error {
    constructor(passedArgs: object, details?: string);
}
declare class NotEnoughArgs extends Error {
    constructor(expected: number | number[], passedArgs: object, details?: string);
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
    export type Tag2Element<K extends Tag = Tag> = K extends Tag ? HTMLElementTagNameMap[K] : HTMLElementTagNameMap[Tag];
    type TagOrString = Tag | string;
    export type QuerySelector<K extends TagOrString = TagOrString> = K extends Tag ? K : string;
    export interface Tag2BHE {
        "div": Div;
        "a": Anchor;
        "p": Paragraph;
        "img": Img;
        "input": Input;
        "button": Button;
        "span": Span;
    }
    export type Element2Tag<T> = T extends HTMLInputElement ? "input" : T extends HTMLDivElement ? "div" : T extends HTMLAnchorElement ? "a" : T extends HTMLParagraphElement ? "p" : T extends HTMLImageElement ? "img" : T extends HTMLButtonElement ? "button" : T extends HTMLSpanElement ? "span" : any;
    export type BHETag = keyof Tag2BHE;
    export type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>;
    export type Enumerated<T> = T extends (infer U)[] ? [number, U][] : T extends TMap<(infer U)> ? [keyof T, U][] : T extends boolean ? never : any;
    export type TReturnBoolean = (s: string) => boolean;
    export type AnyFunction = (...args: any[]) => any;
}
declare module "util" {
    import { AnyFunction, Enumerated } from "typings/misc";
    export function enumerate<T>(obj: T): Enumerated<T>;
    export function anyValue(obj: any): boolean;
    export function noValue(obj: any): boolean;
    export function isFunction(fn: AnyFunction): fn is AnyFunction;
    export function isObject(obj: any): boolean;
}
declare module "typings/ctors" {
    import { ChildrenObj, Element2Tag, QuerySelector } from "typings/misc";
    export interface NewBHEConstructor<H extends HTMLElement> {
        tag: Element2Tag<H>;
        cls?: string;
        setid?: string;
    }
    export interface ByIdBHEConstructor {
        byid: string;
        children?: ChildrenObj;
    }
    export interface QueryBHEConstructor<Q extends QuerySelector> {
        query: Q;
        children?: ChildrenObj;
    }
    export interface ByHtmlElementBHEConstructor<E extends HTMLElement> {
        htmlElement: E;
        children?: ChildrenObj;
    }
    export type BHEConstructor<T extends HTMLElement> = NewBHEConstructor<T> | ByIdBHEConstructor | QueryBHEConstructor<Element2Tag<T>> | ByHtmlElementBHEConstructor<T>;
    export type SubElemConstructor<K extends HTMLElement> = BHEConstructor<K> & {
        text?: string;
    };
    export type DivConstructor = SubElemConstructor<HTMLDivElement> & {
        htmlElement?: HTMLDivElement;
    };
    export type ImgConstructor = BHEConstructor<HTMLImageElement> & {
        src?: string;
    };
    export type InputConstructor = BHEConstructor<HTMLInputElement> & {
        type?: "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local";
        placeholder?: string;
    };
    export type AnchorConstructor = SubElemConstructor<HTMLAnchorElement> & {
        href?: string;
        target?: string;
    };
}
declare module "index" {
    import { ChildrenObj, Tag, QuerySelector, TEventFunctionMap, TEvent, TMap, TReturnBoolean, TRecMap, Element2Tag } from "typings/misc";
    import { SubElemConstructor, DivConstructor, InputConstructor, ImgConstructor, AnchorConstructor } from "typings/ctors";
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
    export class Div extends BetterHTMLElement<HTMLDivElement> {
        constructor({ setid, cls, byid, text, query, htmlElement, children }: DivConstructor);
    }
    export class Button extends BetterHTMLElement<HTMLButtonElement> {
        constructor({ setid, cls, text, byid, query, htmlElement, children }: SubElemConstructor<HTMLButtonElement>);
    }
    export class Paragraph extends BetterHTMLElement<HTMLParagraphElement> {
        constructor({ setid, cls, text, byid, query, htmlElement, children }: SubElemConstructor<HTMLParagraphElement>);
    }
    export class Input extends BetterHTMLElement<HTMLInputElement> {
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
    export class Span extends BetterHTMLElement<HTMLSpanElement> {
        constructor({ setid, cls, text, byid, query, htmlElement, children }: SubElemConstructor<HTMLSpanElement>);
    }
    export class Img extends BetterHTMLElement<HTMLImageElement> {
        constructor({ setid, cls, src, byid, query, htmlElement, children }: ImgConstructor);
        src(src: string): this;
        src(): string;
    }
    export class Anchor extends BetterHTMLElement<HTMLAnchorElement> {
        constructor({ setid, cls, text, href, target, byid, query, htmlElement, children }: AnchorConstructor);
        href(): string;
        href(val: string): this;
        target(): string;
        target(val: string): this;
    }
    export function elem<T extends Tag>({ tag, cls, setid }: {
        tag: T;
        cls?: string;
        setid?: string;
    }): T extends Tag ? BetterHTMLElement<HTMLElementTagNameMap[T]> : BetterHTMLElement;
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
