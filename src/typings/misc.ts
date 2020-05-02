// TODO: why <TEvent> needed in allOff()?
interface TMap<T> {
    [s: string]: T;

    [s: number]: T
}

interface TRecMap<T> {
    [s: string]: T | TRecMap<T>;

    [s: number]: T | TRecMap<T>
}


type TEvent = keyof HTMLElementEventMap;
// for each event ("click"), create a `(event: MouseEvent) => void` function.
type TEventFunctionMap<K extends TEvent> = {
    [P in K]?: (event: HTMLElementEventMap[P]) => void;
};

// HTMLTag2HTMLElement<"a"> → HTMLAnchorElement
type HTMLTag2HTMLElement<K extends keyof HTMLElementTagNameMap> = {
    [P in K]: HTMLElementTagNameMap[P]
}[K]

// HTMLTag2HTMLElement2["a"] → HTMLAnchorElement
type HTMLTag2HTMLElement2 = {
    [P in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[P]
}

const a: HTMLTag2HTMLElement<"a"> = undefined;
const b: HTMLTag2HTMLElement2["a"] = undefined;


/**
 * "a", "div"
 * @example
 * const foo = <K extends HTMLTag>(tag: K) => document.createElement(tag);
 * foo("a") → HTMLAnchorElement
 * foo("BAD") // error
 */
type HTMLTag = Exclude<keyof HTMLElementTagNameMap, "object">;
/**
 * "a", "div", "gilad".
 * HTMLElementType "expects" a tag and "returns" an HTMLElement;
 * QuerySelector "expects" a tag and "returns" a HTMLTag.
 * @example
 * const baz = <K extends HTMLTag | string>(query: K) => document.querySelector(query);
 * baz("div") → HTMLDivElement
 * baz("diva") → HTMLSelectElement | HTMLLegendElement | ...
 */
type HTMLElementType<K extends HTMLTag = HTMLTag> = K extends HTMLTag ? HTMLElementTagNameMap[K] : HTMLElementTagNameMap[keyof HTMLElementTagNameMap];
/**
 * "a", "div", "gilad".
 * HTMLElementType "expects" a tag and "returns" an HTMLElement;
 * QuerySelector "expects" a tag and "returns" a HTMLTag.
 * @example
 * const bar = <K extends HTMLTag | string>(query: QuerySelector<K>) => document.querySelector(query);
 * bar("a") → HTMLAnchorElement
 * bar("gilad") → HTMLSelectElement | HTMLLegendElement | ...
 */
type QuerySelector<K extends HTMLTag | string = HTMLTag | string> = K extends HTMLTag ? K : string;

const foo = <K extends HTMLTag>(tag: K) => document.createElement(tag);

const baz = <K extends HTMLTag | string>(query: K) => document.querySelector(query);

const bar = <K extends HTMLTag | string>(query: QuerySelector<K>) => document.querySelector(query);

interface BHETag2BHEMap {
    "div": Div,
    "a": Anchor,
    "p": Paragraph,
    "img": Img,
    "input": Input,
    "button": Button,
    "span": Span,
}

interface IHTMLElement2Tag {
    HTMLDivElement: "div",
    HTMLAnchorElement: "a",
    HTMLParagraphElement: "p",
    HTMLImageElement: "img",
    HTMLInputElement: "input",
    HTMLButtonElement: "button",
    HTMLSpanElement: "span"
}


type HTMLElement2Tag<T> =
    T extends HTMLInputElement ? "input"
        : T extends HTMLDivElement ? "div"
        : T extends HTMLAnchorElement ? "a"
            : T extends HTMLParagraphElement ? "p"
                : T extends HTMLImageElement ? "img"
                    : T extends HTMLButtonElement ? "button"
                        : T extends HTMLSpanElement ? "span"
                            : never

type MapValues<T> = { [K in keyof T]: T[K] }[keyof T];

type HTMLElements = MapValues<HTMLElementTagNameMap>;
type Filter<T> = T extends HTMLElements ? T : never;

type GenericFilter<T, U> = T extends U ? T : never;
// const what: HTMLElement2Tag<HTMLDivElement> = undefined;
// const what: Filter<HTMLInputElement, HTMLElements> = undefined;
// const what: Filter<HTMLInputElement> = undefined;
// const what: HTMLElement2Tag<HTMLAnchorElement> = undefined;
type BHETag = keyof BHETag2BHEMap;

// BHE["a"] → Anchor
type BHE = { [K in keyof BHETag2BHEMap]: BHETag2BHEMap[K] }


// type ChildrenObj = TMap<HTMLElementType> | TRecMap<HTMLElementType>
type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>
type Enumerated<T> =
    T extends (infer U)[] ? [number, U][]
        : T extends TMap<(infer U)> ? [keyof T, U][]
        : T extends boolean ? never : any;
type TReturnBoolean = (s: string) => boolean;
type AnyFunction = (...args: any[]) => any;
