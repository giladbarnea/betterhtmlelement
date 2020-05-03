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
 * const foo = <K extends Tag>(tag: K) => document.createElement(tag);
 * foo("a") → HTMLAnchorElement
 * foo("BAD") // error
 */
type Tag = Exclude<keyof HTMLElementTagNameMap, "object">;
/**
 * "a", "div", "gilad".
 * Tag2Element expects a tag and returns an HTMLElement.
 * @example
 * const baz = <K extends Tag | string>(query: K) => document.querySelector(query);
 * baz("div") → HTMLDivElement
 * baz("diva") → HTMLSelectElement | HTMLLegendElement | ...
 */
type Tag2Element<K extends Tag = Tag> = K extends Tag ? HTMLElementTagNameMap[K] : HTMLElementTagNameMap[Tag]
/**
 * "a", "div", "gilad".
 * QuerySelector expects a tag and returns a Tag.
 * @example
 * const bar = <K extends Tag | string>(query: QuerySelector<K>) => document.querySelector(query);
 * bar("a") → HTMLAnchorElement
 * bar("gilad") → HTMLSelectElement | HTMLLegendElement | ...
 */
type QuerySelector<K extends Tag | string = Tag | string> = K extends Tag ? K : string;

const foo = <K extends Tag>(tag: K) => document.createElement(tag);

const baz = <K extends Tag | string>(query: K) => document.querySelector(query);

const bar = <K extends Tag | string>(query: QuerySelector<K>) => document.querySelector(query);

// BHETag2BHEMap["a"] → Anchor
interface Tag2BHE {
    "div": Div,
    "a": Anchor,
    "p": Paragraph,
    "img": Img,
    "input": Input,
    "button": Button,
    "span": Span,
}

interface IElement2Tag {
    HTMLDivElement: "div",
    HTMLAnchorElement: "a",
    HTMLParagraphElement: "p",
    HTMLImageElement: "img",
    HTMLInputElement: "input",
    HTMLButtonElement: "button",
    HTMLSpanElement: "span"
}


type Element2Tag<T> =
    T extends HTMLInputElement ? "input"
        : T extends HTMLDivElement ? "div"
        : T extends HTMLAnchorElement ? "a"
            : T extends HTMLParagraphElement ? "p"
                : T extends HTMLImageElement ? "img"
                    : T extends HTMLButtonElement ? "button"
                        : T extends HTMLSpanElement ? "span"
                            : never

type MapValues<T> = { [K in keyof T]: T[K] }[keyof T];

// HTMLDivElement, ...
type HTMLElements = MapValues<HTMLElementTagNameMap>;
type Filter<T> = T extends HTMLElements ? T : never;

type GenericFilter<T, U> = T extends U ? T : never;
// const what: Element2Tag<HTMLDivElement> = undefined;
// const what: Filter<HTMLInputElement, HTMLElements> = undefined;
// const what: Filter<HTMLInputElement> = undefined;
// const what: Element2Tag<HTMLAnchorElement> = undefined;
type BHETag = keyof Tag2BHE;


// type ChildrenObj = TMap<Tag2Element> | TRecMap<Tag2Element>
type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>
type Enumerated<T> =
    T extends (infer U)[] ? [number, U][]
        : T extends TMap<(infer U)> ? [keyof T, U][]
        : T extends boolean ? never : any;
type TReturnBoolean = (s: string) => boolean;
type AnyFunction = (...args: any[]) => any;

interface BHE extends BetterHTMLElement {
}