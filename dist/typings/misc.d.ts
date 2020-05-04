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
declare type NotTag<T extends Tag> = Exclude<Tag, T>;
declare type Tag2Element<K extends Tag = Tag> = K extends Tag ? HTMLElementTagNameMap[K] : HTMLElementTagNameMap[Tag];
declare type TagOrString = Tag | string;
declare type QuerySelector<K extends TagOrString = TagOrString> = K extends Tag ? K : string;
declare const foo: <K extends "track" | "progress" | "a" | "abbr" | "address" | "applet" | "area" | "article" | "aside" | "audio" | "b" | "base" | "basefont" | "bdi" | "bdo" | "blockquote" | "body" | "br" | "button" | "canvas" | "caption" | "cite" | "code" | "col" | "colgroup" | "data" | "datalist" | "dd" | "del" | "details" | "dfn" | "dialog" | "dir" | "div" | "dl" | "dt" | "em" | "embed" | "fieldset" | "figcaption" | "figure" | "font" | "footer" | "form" | "frame" | "frameset" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "head" | "header" | "hgroup" | "hr" | "html" | "i" | "iframe" | "img" | "input" | "ins" | "kbd" | "label" | "legend" | "li" | "link" | "main" | "map" | "mark" | "marquee" | "menu" | "meta" | "meter" | "nav" | "noscript" | "ol" | "optgroup" | "option" | "output" | "p" | "param" | "picture" | "pre" | "q" | "rp" | "rt" | "ruby" | "s" | "samp" | "script" | "section" | "select" | "slot" | "small" | "source" | "span" | "strong" | "style" | "sub" | "summary" | "sup" | "table" | "tbody" | "td" | "template" | "textarea" | "tfoot" | "th" | "thead" | "time" | "title" | "tr" | "u" | "ul" | "var" | "video" | "wbr">(tag: K) => HTMLElementTagNameMap[K];
declare const baz: <K extends string>(query: K) => Element;
declare const bar: <K extends string>(query: QuerySelector<K>) => Element;
interface Tag2BHE {
    "img": Img;
    "a": Anchor;
    "input": Input;
    "div": Div;
    "p": Paragraph;
    "button": Button;
    "span": Span;
}
declare type BHETag = keyof Tag2BHE;
declare type BHEHTMLElement = HTMLAnchorElement | HTMLInputElement | HTMLImageElement | HTMLParagraphElement | HTMLDivElement | HTMLButtonElement | HTMLSpanElement;
declare type StdBHEHTMLElement = HTMLParagraphElement | HTMLDivElement | HTMLButtonElement | HTMLSpanElement;
declare type Element2Tag<T> = T extends HTMLInputElement ? "input" : T extends HTMLAnchorElement ? "a" : T extends HTMLImageElement ? "img" : Tag;
declare type MapValues<T> = {
    [K in keyof T]: T[K];
}[keyof T];
declare type HTMLElements = MapValues<HTMLElementTagNameMap>;
declare type Filter<T> = T extends HTMLElements ? T : never;
declare type GenericFilter<T, U> = T extends U ? T : never;
declare type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>;
declare type Enumerated<T> = T extends (infer U)[] ? [number, U][] : T extends TMap<(infer U)> ? [keyof T, U][] : T extends boolean ? never : any;
declare type TReturnBoolean = (s: string) => boolean;
declare type AnyFunction = (...args: any[]) => any;
declare type Callable<T1, T2, F> = F extends (a1: T1, a2: T2) => infer R ? R : any;
declare type Callable2<T1, F> = F extends (a1: T1, a2: HTMLElement) => infer R ? R : any;
