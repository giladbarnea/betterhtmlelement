// TODO: why <EventName> needed in allOff()?
interface TMap<T> {
    [s: string]: T;

    [s: number]: T
}

interface TRecMap<T> {
    [s: string]: T | TRecMap<T>;

    [s: number]: T | TRecMap<T>
}

// type IMap<T> = {
//     [s in keyof T]: T
// }


// type EventNameFunctionMapOrig<E extends EventName> = {
//     [P in E]?: (event: HTMLElementEventMap[P]) => void;
// }[E];
//
// type EventNameFunctionMap2<E extends EventName> = E extends EventName ? (event: HTMLElementEventMap[E]) => void : never;
// type EventNameFunctionMap3 = {
//     [P in EventName]?: (event: HTMLElementEventMap[P]) => void;
// }
// type EventNameFunctionMap4<E extends EventName> = {
//     [P in EventName]?: (event: HTMLElementEventMap[P]) => void;
// }
type EventName = keyof HTMLElementEventMap;
// EventName2Function<"click"> → function(event: MouseEvent) { }
type EventName2Function<E extends EventName = EventName> = {
    [P in EventName]?: (event: HTMLElementEventMap[P]) => void;
}[E]
// e.g. { "mouseover" : MouseEvent, ... }
type MapOfEventName2Function = Partial<Record<keyof HTMLElementEventMap, EventName2Function>>


/*type MouseOverFunction = EventName2Function<"mouseover">;


function expectsMouseEventFunction(fn: (event: MouseEvent) => void) {

}

const mouseEventFunction: MouseOverFunction = (event: MouseEvent) => {
};

expectsMouseEventFunction(mouseEventFunction);

function expectsMouseEventFunctionPairs(pairs: MapOfEventName2Function) {
    for (let [evName, evFn] of Object.entries(pairs)) {
        expectsMouseEventFunction(evFn)
    }

}

const pairs: MapOfEventName2Function = {"mouseover": mouseEventFunction};
expectsMouseEventFunctionPairs(pairs);*/


// // HTMLTag2HTMLElement<"a"> → HTMLAnchorElement
// type HTMLTag2HTMLElement<K extends keyof HTMLElementTagNameMap> = {
//     [P in K]: HTMLElementTagNameMap[P]
// }[K]
//
// // HTMLTag2HTMLElement2["a"] → HTMLAnchorElement
// type HTMLTag2HTMLElement2 = {
//     [P in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[P]
// }
//
// // const a: HTMLTag2HTMLElement<"a"> = undefined;
// // const b: HTMLTag2HTMLElement2["a"] = undefined;


/**
 * "a", "div"
 * @example
 * const foo = <K extends Tag>(tag: K) => document.createElement(tag);
 * foo("a") → HTMLAnchorElement
 * foo("BAD") // error
 */
type Tag = Exclude<keyof HTMLElementTagNameMap, "object">;
type NotTag<T extends Tag> = Exclude<Tag, T>;
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
 * "a", "div", "gilad".
 * QuerySelector expects a tag and returns a Tag.
 * @example
 * const bar = <K extends Tag | string>(query: QuerySelector<K>) => document.querySelector(query);
 * bar("a") → HTMLAnchorElement
 * bar("gilad") → HTMLSelectElement | HTMLLegendElement | ...
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

type Element2Tag<T> =
    T extends HTMLInputElement ? "input"
        : T extends HTMLAnchorElement ? "a"
        : T extends HTMLImageElement ? "img"
            : Tag

// type MapValues<T> = { [K in keyof T]: T[K] }[keyof T];

// HTMLDivElement, ...
// type HTMLElements = MapValues<HTMLElementTagNameMap>;
// type Filter<T> = T extends HTMLElements ? T : never;
// type GenericFilter<T, U> = T extends U ? T : never;

// const what: Element2Tag<HTMLDivElement> = undefined;
// const what: Filter<HTMLInputElement, HTMLElements> = undefined;
// const what: Filter<HTMLInputElement> = undefined;
// const what: Element2Tag<HTMLAnchorElement> = undefined;


// type ChildrenObj = TMap<Tag2Element> | TRecMap<Tag2Element>
// type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>
type ChildrenObj = TRecMap<QuerySelector | BetterHTMLElement | typeof BetterHTMLElement>
type Enumerated<T> =
    T extends (infer U)[] ? [number, U][]
        : T extends TRecMap<(infer U)> ? [keyof T, U][]
        : T extends boolean ? never : any;
type Returns<T> = (s: string) => T;
type TReturnBoolean = (s: string) => boolean;
type AnyFunction = (...args: any[]) => any;


type Callable<T1, T2, F> = F extends (a1: T1, a2: T2) => infer R ? R : any;
type Callable2<T1, F> = F extends (a1: T1, a2: HTMLElement) => infer R ? R : any;


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