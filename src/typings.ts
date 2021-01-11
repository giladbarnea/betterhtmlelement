// TODO: why <EventName> needed in allOff()?
interface TMap<T = any> {
    [s: string]: T;

    [s: number]: T
}

interface SMap<T = any> {
    [s: string]: T;
}

interface NMap<T = any> {
    [s: number]: T;
}


interface RecMap<T = any> {
    [s: string]: T | RecMap<T>;

    [s: number]: T | RecMap<T>
}


type EventName = keyof HTMLElementEventMap;
// EventName2Function<"click"> → function(event: MouseEvent) { }
type EventName2Function<E extends EventName = EventName> = {
    [P in EventName]?: (event: HTMLElementEventMap[P]) => void;
}[E]
// e.g. { "mouseover" : MouseEvent, ... }
type MapOfEventName2Function = Partial<Record<keyof HTMLElementEventMap, EventName2Function>>


/**
 * "a", "div"
 * @example
 * const foo = <K extends Tag>(tag: K) => document.createElement(tag);
 * foo("a") // HTMLAnchorElement
 * foo("BAD") // error
 */
type Tag = Exclude<keyof HTMLElementTagNameMap, "object">;
type NotTag<T extends Tag> = Exclude<Tag, T>;
type QueryOrPreciseTag<Q, T extends Tag> = Exclude<Q, QuerySelector<NotTag<T>>>;
// /**
//  *"a", "div", "gilad".
//  *Tag2Element expects a tag and returns an HTMLElement.
//  *@example
//  *const baz = <K extends Tag | string>(query: K) => document.querySelector(query);
//  *baz("div") → HTMLDivElement
//  *baz("diva") → HTMLSelectElement | HTMLLegendElement | ...
//  */
// type Tag2Element<K extends Tag = Tag> = K extends Tag ? HTMLElementTagNameMap[K] : HTMLElementTagNameMap[Tag]
type TagOrString = Tag | string;
/**
 * `"a"`, `"div"`, `"gilad"`.
 * QuerySelector expects a tag name (string) and returns a `Tag`.
 * @example
 * const bar = <K extends Tag | string>(query: QuerySelector<K>) => document.querySelector(query);
 * bar("a") → HTMLAnchorElement
 * bar("gilad") → HTMLSelectElement | HTMLLegendElement | ...
 * @see Tag
 */
type QuerySelector<K extends TagOrString = TagOrString> = K extends Tag ? K : string;

// const foo = <K extends Tag>(tag: K) => document.createElement(tag);

// const baz = <K extends Tag | string>(query: K) => document.querySelector(query);

// const bar = <K extends Tag | string>(query: QuerySelector<K>) => document.querySelector(query);

/*
// Tag2BHE["a"] → Anchor
interface Tag2BHE {
    "img": Img,
    "a": Anchor,
    "input": Input,
    "div": Div,
    "p": Paragraph,
    "button": Button,
    "span": Span,
}
*/

// type BHETag = keyof Tag2BHE;
// type BHEHTMLElement =
//     HTMLAnchorElement |
//     HTMLInputElement |
//     HTMLImageElement |
//     HTMLParagraphElement |
//     HTMLDivElement |
//     HTMLButtonElement |
//     HTMLSpanElement;
//
// type StdBHEHTMLElement =
//     HTMLParagraphElement |
//     HTMLDivElement |
//     HTMLButtonElement |
//     HTMLSpanElement

/*type Element2Tag<T> =
    T extends HTMLInputElement ? "input"
        : T extends HTMLAnchorElement ? "a"
        : T extends HTMLImageElement ? "img"
            : Tag*/

/**
 * @example
 * const foo: Element2Tag<HTMLInputElement> = "input"  // ok
 * const bar: Element2Tag<HTMLInputElement> = "img"  // ERROR
 */

type Element2Tag<T> = { [K in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[K] extends T ? K : never }[keyof HTMLElementTagNameMap]


// type MapValues<T> = { [K in keyof T]: T[K] }[keyof T];
// type HTMLElements = MapValues<HTMLElementTagNameMap>;

// HTMLDivElement, ...
// type Filter<T> = T extends HTMLElements ? T : never;
// type GenericFilter<T, U> = T extends U ? T : never;


// const what: Filter<HTMLInputElement, HTMLElements> = undefined;
// const what: Filter<HTMLInputElement> = undefined;
// const what: Element2Tag<HTMLAnchorElement> = undefined;


// type ChildrenObj = TMap<Tag2Element> | RecMap<Tag2Element>
// type ChildrenObj = TMap<QuerySelector> | RecMap<QuerySelector>
type ChildrenObj = RecMap<QuerySelector | BetterHTMLElement | typeof BetterHTMLElement>
type Enumerated<T> =
    T extends (infer U)[] ? [i: number, item: U][] // Array
        // Dicts
        : T extends SMap<(infer U)> ? [key: string, value: U][]
        : T extends NMap<(infer U)> ? [key: number, value: U][]
            : T extends TMap<(infer U)> ? [key: keyof T, value: U][]
                : T extends RecMap<(infer U)> ? [key: keyof T, value: U][]
                    // : T extends boolean ? never : any;
                    // : T extends infer U ? [key: string, value: U[keyof U]][]
                    : never;
type Returns<T> = (s: string) => T;
// type TReturnBoolean = (s: string) => boolean;

type NodeOrBHE = BetterHTMLElement | Node;
type ElementOrBHE = BetterHTMLElement | Element;

type Awaited<T> = T extends Promise<infer U> ? U : T;
// type Callable<T1, T2, F> = F extends (a1: T1, a2: T2) => infer R ? R : any;
// type Callable2<T1, F> = F extends (a1: T1, a2: HTMLElement) => infer R ? R : any;


/////////////////////////////////////////////////
/////////////// CSS /////////////////////////////
/////////////////////////////////////////////////

// TODO: https://www.npmjs.com/package/csstype
type OmittedCssProps = "animationDirection"
    | "animationFillMode"
    | "animationIterationCount"
    | "animationPlayState"
    | "animationTimingFunction"
    | "opacity"
    | "padding"
    | "paddingBottom"
    | "paddingLeft"
    | "paddingRight"
    | "paddingTop"
    | "preload"
    | "width"
type PartialCssStyleDeclaration = Omit<Partial<CSSStyleDeclaration>, OmittedCssProps>;

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


type CubicBezierFunction = [number, number, number, number];
type Jumpterm = 'jump-start' | 'jump-end' | 'jump-none' | 'jump-both' | 'start' | 'end';

/**Displays an animation iteration along n stops along the transition, displaying each stop for equal lengths of time.
 * For example, if n is 5,  there are 5 steps.
 * Whether the animation holds temporarily at 0%, 20%, 40%, 60% and 80%, on the 20%, 40%, 60%, 80% and 100%, or makes 5 stops between the 0% and 100% along the animation, or makes 5 stops including the 0% and 100% marks (on the 0%, 25%, 50%, 75%, and 100%) depends on which of the following jump terms is used*/
type StepsFunction = [number, Jumpterm];
type AnimationTimingFunction =
    'linear'
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'step-start'
    | 'step-end'
    | StepsFunction
    | CubicBezierFunction
type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';

interface TransformOptions {
    matrix?: [number, number, number, number, number, number],
    matrix3d?: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number],
    perspective?: string, // px
    rotate?: string, // deg
    rotate3d?: [number, number, number, string] // [,,,deg]
    rotateX?: string,
    rotateY?: string,
    rotateZ?: string,
    scale?: number, // 1.5
    scale3d?: [number, number, number],
    scaleX?: [number, number, number],
    scaleY?: [number, number, number],
    skew?: [string, string] // deg, deg
    skewX?: string,
    skewY?: string,
    translate?: [string, string], // px, px
    translate3d?: [string, string, string],
    translateX?: string,
    translateY?: string,
    translateZ?: string,


}

interface AnimateOptions {
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
