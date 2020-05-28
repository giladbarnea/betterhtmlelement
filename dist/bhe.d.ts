declare module "typings/css" {
    export type OmittedCssProps = "animationDirection" | "animationFillMode" | "animationIterationCount" | "animationPlayState" | "animationTimingFunction" | "opacity" | "padding" | "paddingBottom" | "paddingLeft" | "paddingRight" | "paddingTop" | "preload" | "width";
    export type PartialCssStyleDeclaration = Omit<Partial<CSSStyleDeclaration>, OmittedCssProps>;
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
    export type CubicBezierFunction = [number, number, number, number];
    export type Jumpterm = 'jump-start' | 'jump-end' | 'jump-none' | 'jump-both' | 'start' | 'end';
    export type StepsFunction = [number, Jumpterm];
    export type AnimationTimingFunction = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | StepsFunction | CubicBezierFunction;
    export type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    export type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';
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
        timingFunction?: AnimationTimingFunction;
    }
}
declare module "index" {
    import { ChildrenObj, Element2Tag, EventName, EventName2Function, NotTag, QuerySelector, Returns, Tag, TMap } from "typings/misc";
    import { CssOptions } from "typings/css";
    export class BetterHTMLElement<Generic extends HTMLElement = HTMLElement> {
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
    export class Div extends BetterHTMLElement<HTMLDivElement> {
        constructor(divOpts: any);
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
    interface Flashable {
        flashBad(): Promise<void>;
        flashGood(): Promise<void>;
    }
    export type FormishHTMLElement = HTMLButtonElement | HTMLInputElement | HTMLSelectElement;
    export type InputType = "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local";
    export abstract class Form<Generic extends FormishHTMLElement> extends BetterHTMLElement<Generic> implements Flashable {
        get disabled(): boolean;
        disable(): this;
        enable(): this;
        toggleEnabled(on: boolean): this;
        value(): string;
        value(val: any): this;
        flashBad(): Promise<void>;
        flashGood(): Promise<void>;
        clear(): this;
        _preEvent(): void;
        _onEventSuccess(ret: any): Promise<void>;
        _onEventError(e: any): Promise<void>;
        _postEvent(): void;
    }
    export class Button extends Form<HTMLButtonElement> {
        constructor(buttonOpts: any);
        click(_fn?: (_event: MouseEvent) => Promise<any>): this;
    }
    export class Input<TInputType extends InputType, Generic extends FormishHTMLElement = HTMLInputElement> extends Form<Generic> {
        type: TInputType;
        constructor(inputOpts: any);
    }
    export class TextInput extends Input<"text"> {
        constructor(opts: any);
        placeholder(val: string): this;
        placeholder(): string;
        keydown(_fn: (_event: KeyboardEvent) => Promise<any>): this;
    }
    export class Changable<TInputType extends InputType, Generic extends FormishHTMLElement> extends Input<TInputType, Generic> {
        change(_fn: (_event: Event) => Promise<any>): this;
    }
    export class CheckboxInput extends Changable<"checkbox", HTMLInputElement> {
        constructor(opts: any);
        get checked(): boolean;
        check(): this;
        uncheck(): this;
        toggleChecked(on: boolean): this;
        clear(): this;
        _onEventError(e: any): Promise<void>;
    }
    export class Select extends Changable<undefined, HTMLSelectElement> {
        constructor(selectOpts: any);
        get selectedIndex(): number;
        set selectedIndex(val: number);
        get selected(): HTMLOptionElement;
        set selected(val: HTMLOptionElement);
        get options(): HTMLOptionElement[];
        item(index: any): HTMLOptionElement;
        clear(): this;
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
    export function input<TInputType extends InputType, Generic extends FormishHTMLElement = HTMLInputElement>({ cls, setid, type, placeholder }: {
        cls?: string;
        setid?: string;
        type?: TInputType;
        placeholder?: string;
    }): Input<TInputType, Generic>;
    export function input<TInputType extends InputType = InputType, Generic extends FormishHTMLElement = HTMLInputElement>({ byid, children }: {
        byid: string;
        children?: ChildrenObj;
    }): Input<TInputType, Generic>;
    export function input<Q extends QuerySelector, TInputType extends InputType = InputType, Generic extends FormishHTMLElement = HTMLInputElement>({ query, children }: {
        query: Q extends QuerySelector<NotTag<"input">> ? never : Q;
        children?: ChildrenObj;
    }): Input<TInputType, Generic>;
    export function input<TInputType extends InputType = InputType, Generic extends FormishHTMLElement = HTMLInputElement>({ htmlElement, children }: {
        htmlElement: Generic;
        children?: ChildrenObj;
    }): Input<TInputType, Generic>;
    export function input<TInputType extends InputType = InputType, Generic extends FormishHTMLElement = HTMLInputElement>(): Input<TInputType, Generic>;
    export function select(selectOpts: any): Select;
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
}
declare module "typings/misc" {
    import { BetterHTMLElement } from "index";
    export interface TMap<T> {
        [s: string]: T;
        [s: number]: T;
    }
    export interface TRecMap<T> {
        [s: string]: T | TRecMap<T>;
        [s: number]: T | TRecMap<T>;
    }
    export type EventName = keyof HTMLElementEventMap;
    export type EventName2Function<E extends EventName = EventName> = {
        [P in EventName]?: (event: HTMLElementEventMap[P]) => void;
    }[E];
    export type MapOfEventName2Function = Partial<Record<keyof HTMLElementEventMap, EventName2Function>>;
    export type Tag = Exclude<keyof HTMLElementTagNameMap, "object">;
    export type NotTag<T extends Tag> = Exclude<Tag, T>;
    export type TagOrString = Tag | string;
    export type QuerySelector<K extends TagOrString = TagOrString> = K extends Tag ? K : string;
    export type Element2Tag<T> = T extends HTMLInputElement ? "input" : T extends HTMLAnchorElement ? "a" : T extends HTMLImageElement ? "img" : Tag;
    export type ChildrenObj = TRecMap<QuerySelector | BetterHTMLElement | typeof BetterHTMLElement>;
    export type Enumerated<T> = T extends (infer U)[] ? [number, U][] : T extends TRecMap<(infer U)> ? [keyof T, U][] : T extends boolean ? never : any;
    export type Returns<T> = (s: string) => T;
    export type TReturnBoolean = (s: string) => boolean;
    export type AnyFunction = (...args: any[]) => any;
    export type Callable<T1, T2, F> = F extends (a1: T1, a2: T2) => infer R ? R : any;
    export type Callable2<T1, F> = F extends (a1: T1, a2: HTMLElement) => infer R ? R : any;
}
declare module "util" {
    import { AnyFunction, Enumerated, TMap } from "typings/misc";
    export function enumerate<T>(obj: T): Enumerated<T>;
    export function wait(ms: number): Promise<any>;
    export function bool(val: any): boolean;
    export function isArray<T>(obj: any): obj is Array<T>;
    export function isEmptyArr(collection: any): boolean;
    export function isEmptyObj(obj: any): boolean;
    export function isFunction<T>(fn: T): fn is T;
    export function isFunction(fn: AnyFunction): fn is AnyFunction;
    export function isTMap<T>(obj: TMap<T>): obj is TMap<T>;
    export function isObject(obj: any): boolean;
    export function shallowProperty<T>(key: string): (obj: T) => T extends null ? undefined : T[keyof T];
    export function getLength(collection: any): number;
    export function isArrayLike(collection: any): boolean;
    export function extend(sup: any, child: any): any;
    export function anyValue(obj: any): boolean;
    export function equalsAny(obj: any, ...others: any[]): boolean;
    export function noValue(obj: any): boolean;
    export function isType<T>(arg: T): arg is T;
}
declare module "exceptions" {
    export function getArgNamesValues(argsWithValues: object): string;
    export function getArgsWithValues(passedArgs: object): object;
    export class MutuallyExclusiveArgs extends Error {
        constructor(passedArgs: object, details?: string);
    }
    export class NotEnoughArgs extends Error {
        constructor(expected: number | number[], passedArgs: object, details?: string);
    }
}
