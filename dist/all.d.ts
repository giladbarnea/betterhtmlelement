declare class BadArgumentsAmountError extends Error {
    constructor(expectedArgsNum: number | number[], passedArgs: any, details?: string);
}
declare type TEvent = keyof HTMLElementEventMap;
declare type TEventFunctionMap<K> = {
    [P in Extract<K, string>]?: (evt: Event) => void;
};
declare type HTMLTag = keyof HTMLElementTagNameMap;
declare type QuerySelector = HTMLTag | string;
declare type TSubElemOptions = {
    id?: string;
    text?: string;
    cls?: string;
};
declare type TImgOptions = {
    id?: string;
    src?: string;
    cls?: string;
};
interface CssOptions {
    alignContent?: string;
    alignItems?: string;
    alignSelf?: string;
    alignmentBaseline?: string;
    animation?: string;
    animationDelay?: string;
    animationDirection?: AnimationDirection;
    animationDuration?: string;
    animationFillMode?: AnimationFillMode;
    animationIterationCount?: number;
    animationName?: string;
    animationPlayState?: AnimationPlayState;
    animationTimingFunction?: AnimationTimingFunction;
    backfaceVisibility?: string;
    background?: string;
    backgroundAttachment?: string;
    backgroundClip?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundOrigin?: string;
    backgroundPosition?: string;
    backgroundPositionX?: string;
    backgroundPositionY?: string;
    backgroundRepeat?: string;
    backgroundSize?: string;
    baselineShift?: string;
    border?: string;
    borderBottom?: string;
    borderBottomColor?: string;
    borderBottomLeftRadius?: string;
    borderBottomRightRadius?: string;
    borderBottomStyle?: string;
    borderBottomWidth?: string;
    borderCollapse?: string;
    borderColor?: string;
    borderImage?: string;
    borderImageOutset?: string;
    borderImageRepeat?: string;
    borderImageSlice?: string;
    borderImageSource?: string;
    borderImageWidth?: string;
    borderLeft?: string;
    borderLeftColor?: string;
    borderLeftStyle?: string;
    borderLeftWidth?: string;
    borderRadius?: string;
    borderRight?: string;
    borderRightColor?: string;
    borderRightStyle?: string;
    borderRightWidth?: string;
    borderSpacing?: string;
    borderStyle?: string;
    borderTop?: string;
    borderTopColor?: string;
    borderTopLeftRadius?: string;
    borderTopRightRadius?: string;
    borderTopStyle?: string;
    borderTopWidth?: string;
    borderWidth?: string;
    bottom?: string;
    boxShadow?: string;
    boxSizing?: string;
    breakAfter?: string;
    breakBefore?: string;
    breakInside?: string;
    captionSide?: string;
    clear?: string;
    clip?: string;
    clipPath?: string;
    clipRule?: string;
    color?: string;
    colorInterpolationFilters?: string;
    columnCount?: any;
    columnFill?: string;
    columnGap?: any;
    columnRule?: string;
    columnRuleColor?: any;
    columnRuleStyle?: string;
    columnRuleWidth?: any;
    columnSpan?: string;
    columnWidth?: any;
    columns?: string;
    content?: string;
    counterIncrement?: string;
    counterReset?: string;
    cssFloat?: string;
    cssText?: string;
    cursor?: string;
    direction?: string;
    display?: string;
    dominantBaseline?: string;
    emptyCells?: string;
    enableBackground?: string;
    fill?: string;
    fillOpacity?: string;
    fillRule?: string;
    filter?: string;
    flex?: string;
    flexBasis?: string;
    flexDirection?: string;
    flexFlow?: string;
    flexGrow?: string;
    flexShrink?: string;
    flexWrap?: string;
    floodColor?: string;
    floodOpacity?: string;
    font?: string;
    fontFamily?: string;
    fontFeatureSettings?: string;
    fontSize?: string;
    fontSizeAdjust?: string;
    fontStretch?: string;
    fontStyle?: string;
    fontVariant?: string;
    fontWeight?: string;
    gap?: string;
    glyphOrientationHorizontal?: string;
    glyphOrientationVertical?: string;
    grid?: string;
    gridArea?: string;
    gridAutoColumns?: string;
    gridAutoFlow?: string;
    gridAutoRows?: string;
    gridColumn?: string;
    gridColumnEnd?: string;
    gridColumnGap?: string;
    gridColumnStart?: string;
    gridGap?: string;
    gridRow?: string;
    gridRowEnd?: string;
    gridRowGap?: string;
    gridRowStart?: string;
    gridTemplate?: string;
    gridTemplateAreas?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    height?: string;
    imeMode?: string;
    justifyContent?: string;
    justifyItems?: string;
    justifySelf?: string;
    kerning?: string;
    layoutGrid?: string;
    layoutGridChar?: string;
    layoutGridLine?: string;
    layoutGridMode?: string;
    layoutGridType?: string;
    left?: string;
    readonly length?: number;
    letterSpacing?: string;
    lightingColor?: string;
    lineBreak?: string;
    lineHeight?: string;
    listStyle?: string;
    listStyleImage?: string;
    listStylePosition?: string;
    listStyleType?: string;
    margin?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    marginTop?: string;
    marker?: string;
    markerEnd?: string;
    markerMid?: string;
    markerStart?: string;
    mask?: string;
    maskImage?: string;
    maxHeight?: string;
    maxWidth?: string;
    minHeight?: string;
    minWidth?: string;
    msContentZoomChaining?: string;
    msContentZoomLimit?: string;
    msContentZoomLimitMax?: any;
    msContentZoomLimitMin?: any;
    msContentZoomSnap?: string;
    msContentZoomSnapPoints?: string;
    msContentZoomSnapType?: string;
    msContentZooming?: string;
    msFlowFrom?: string;
    msFlowInto?: string;
    msFontFeatureSettings?: string;
    msGridColumn?: any;
    msGridColumnAlign?: string;
    msGridColumnSpan?: any;
    msGridColumns?: string;
    msGridRow?: any;
    msGridRowAlign?: string;
    msGridRowSpan?: any;
    msGridRows?: string;
    msHighContrastAdjust?: string;
    msHyphenateLimitChars?: string;
    msHyphenateLimitLines?: any;
    msHyphenateLimitZone?: any;
    msHyphens?: string;
    msImeAlign?: string;
    msOverflowStyle?: string;
    msScrollChaining?: string;
    msScrollLimit?: string;
    msScrollLimitXMax?: any;
    msScrollLimitXMin?: any;
    msScrollLimitYMax?: any;
    msScrollLimitYMin?: any;
    msScrollRails?: string;
    msScrollSnapPointsX?: string;
    msScrollSnapPointsY?: string;
    msScrollSnapType?: string;
    msScrollSnapX?: string;
    msScrollSnapY?: string;
    msScrollTranslation?: string;
    msTextCombineHorizontal?: string;
    msTextSizeAdjust?: any;
    msTouchAction?: string;
    msTouchSelect?: string;
    msUserSelect?: string;
    msWrapFlow?: string;
    msWrapMargin?: any;
    msWrapThrough?: string;
    objectFit?: string;
    objectPosition?: string;
    opacity?: string | number;
    order?: string;
    orphans?: string;
    outline?: string;
    outlineColor?: string;
    outlineOffset?: string;
    outlineStyle?: string;
    outlineWidth?: string;
    overflow?: string;
    overflowX?: string;
    overflowY?: string;
    padding?: string | number;
    paddingBottom?: string | number;
    paddingLeft?: string | number;
    paddingRight?: string | number;
    paddingTop?: string | number;
    pageBreakAfter?: string;
    pageBreakBefore?: string;
    pageBreakInside?: string;
    readonly parentRule?: CSSRule;
    penAction?: string;
    perspective?: string;
    perspectiveOrigin?: string;
    pointerEvents?: string;
    position?: string;
    preload?: "auto" | string;
    quotes?: string;
    resize?: string;
    right?: string;
    rotate?: string;
    rowGap?: string;
    rubyAlign?: string;
    rubyOverhang?: string;
    rubyPosition?: string;
    scale?: string;
    scrollBehavior?: string;
    stopColor?: string;
    stopOpacity?: string;
    stroke?: string;
    strokeDasharray?: string;
    strokeDashoffset?: string;
    strokeLinecap?: string;
    strokeLinejoin?: string;
    strokeMiterlimit?: string;
    strokeOpacity?: string;
    strokeWidth?: string;
    tableLayout?: string;
    textAlign?: string;
    textAlignLast?: string;
    textAnchor?: string;
    textCombineUpright?: string;
    textDecoration?: string;
    textIndent?: string;
    textJustify?: string;
    textKashida?: string;
    textKashidaSpace?: string;
    textOverflow?: string;
    textShadow?: string;
    textTransform?: string;
    textUnderlinePosition?: string;
    top?: string;
    touchAction?: string;
    transform?: string;
    transformOrigin?: string;
    transformStyle?: string;
    transition?: string;
    transitionDelay?: string;
    transitionDuration?: string;
    transitionProperty?: string;
    transitionTimingFunction?: string;
    translate?: string;
    unicodeBidi?: string;
    userSelect?: string;
    verticalAlign?: string;
    visibility?: string;
    webkitColumnBreakAfter?: string;
    webkitColumnBreakBefore?: string;
    webkitColumnBreakInside?: string;
    webkitColumnCount?: any;
    webkitColumnGap?: any;
    webkitColumnRule?: string;
    webkitColumnRuleColor?: any;
    webkitColumnRuleStyle?: string;
    webkitColumnRuleWidth?: any;
    webkitColumnSpan?: string;
    webkitColumnWidth?: any;
    webkitColumns?: string;
    webkitUserModify?: string;
    webkitUserSelect?: string;
    webkitWritingMode?: string;
    whiteSpace?: string;
    widows?: string;
    width?: string | number;
    wordBreak?: string;
    wordSpacing?: string;
    wordWrap?: string;
    writingMode?: string;
    zIndex?: string;
    zoom?: string;
}
declare type CubicBezierFunction = [number, number, number, number];
declare type Jumpterm = 'jump-start' | 'jump-end' | 'jump-none' | 'jump-both' | 'start' | 'end';
/**Displays an animation iteration along n stops along the transition, displaying each stop for equal lengths of time.
 * For example, if n is 5,  there are 5 steps.
 * Whether the animation holds temporarily at 0%, 20%, 40%, 60% and 80%, on the 20%, 40%, 60%, 80% and 100%, or makes 5 stops between the 0% and 100% along the animation, or makes 5 stops including the 0% and 100% marks (on the 0%, 25%, 50%, 75%, and 100%) depends on which of the following jump terms is used*/
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
declare const SVG_NS_URI = "http://www.w3.org/2000/svg";
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
declare class BetterHTMLElement {
    protected readonly _htmlElement: HTMLElement;
    private readonly _isSvg;
    private readonly _listeners;
    /**Create an element of `tag`. Optionally, set its `text` and / or `cls`*/
    constructor({ tag, text, cls }: {
        tag: QuerySelector;
        text?: string;
        cls?: string;
    });
    /**Get an existing element by `id`. Optionally, set its `text`, `cls` or cache `children`*/
    constructor({ id, text, cls, children }: {
        id: string;
        text?: string;
        cls?: string;
        children?: TMap<string>;
    });
    /**Get an existing element by `query`. Optionally, set its `text`, `cls` or cache `children`*/
    constructor({ query, text, cls, children }: {
        query: QuerySelector;
        text?: string;
        cls?: string;
        children?: TMap<string>;
    });
    /**Wrap an existing HTMLElement. Optionally, set its `text`, `cls` or cache `children`*/
    constructor({ htmlElement, text, cls, children }: {
        htmlElement: HTMLElement;
        text?: string;
        cls?: string;
        children?: TMap<string>;
    });
    /**Return the wrapped HTMLElement*/
    readonly e: HTMLElement;
    /**Set the element's innerHTML*/
    html(html: string): this;
    /**Get the element's innerHTML*/
    html(): string;
    /**Set the element's innerText*/
    text(txt: string): this;
    /**Get the element's innerText*/
    text(): string;
    /**Set the id of the element*/
    id(id: string): this;
    /**Get the id of the element*/
    id(): string;
    /**For each `[styleAttr, styleVal]` pair, set the `style[styleAttr]` to `styleVal`.*/
    css(css: CssOptions): this;
    /**Remove the value of the passed style properties*/
    uncss(...removeProps: (keyof CssOptions)[]): this;
    is(element: BetterHTMLElement): void;
    /**`.className = cls`*/
    class(cls: string): this;
    /**Return a string array of the element's classes (not a classList)*/
    class(): string[];
    addClass(cls: string, ...clses: string[]): this;
    removeClass(cls: string, ...clses: string[]): this;
    replaceClass(oldToken: string, newToken: string): this;
    toggleClass(cls: string, force?: boolean): this;
    hasClass(cls: string): boolean;
    /**Insert one or several `BetterHTMLElement`s or vanilla `Node`s just after `this`.*/
    after(...nodes: BetterHTMLElement[] | (string | Node)[]): this;
    /**Insert `this` just after a `BetterHTMLElement` or vanilla `Node`s.*/
    insertAfter(node: BetterHTMLElement | (string | Node)): this;
    /**Insert one or several `BetterHTMLElement`s or vanilla `Node`s after the last child of `this`*/
    append(...nodes: BetterHTMLElement[] | (string | Node)[]): this;
    /**Append `this` to a `BetterHTMLElement` or a vanilla `Node`*/
    appendTo(node: BetterHTMLElement | (string | Node)): this;
    /**Inserts one or several `BetterHTMLElement`s or vanilla `Node`s just before `this`*/
    before(...nodes: BetterHTMLElement[] | (string | Node)[]): this;
    /**Insert `this` just before a `BetterHTMLElement` or vanilla `Node`s.*/
    insertBefore(node: BetterHTMLElement | (string | Node)): this;
    /**For each `[key, child]` pair, `append(child)` and store it in `this[key]`. */
    cacheAppend(keyChildObj: TMap<BetterHTMLElement>): this;
    /**Get a child with `querySelector` and return a `BetterHTMLElement` of it*/
    child<K extends HTMLTag>(selector: K): BetterHTMLElement;
    /**Get a child with `querySelector` and return a BetterHTMLElement of it*/
    child(selector: string): BetterHTMLElement;
    replaceChild(newChild: Node, oldChild: Node): this;
    replaceChild(newChild: BetterHTMLElement, oldChild: BetterHTMLElement): this;
    /**Return a `BetterHTMLElement` list of all children */
    children(): BetterHTMLElement[];
    clone(deep?: boolean): BetterHTMLElement;
    /**For each `[key, selector]` pair, get `this.child(selector)`, and store it in `this[key]`. Useful for eg `navbar.home.toggleClass("selected")`
     * @see this.child*/
    cacheChildren(keySelectorObj: TMap<QuerySelector>): BetterHTMLElement;
    /**Remove all children from DOM*/
    empty(): this;
    /**Remove element from DOM*/
    remove(): this;
    find(): void;
    first(): void;
    last(): void;
    next(): void;
    not(): void;
    parent(): void;
    parents(): void;
    on(evTypeFnPairs: TEventFunctionMap<TEvent>, options?: AddEventListenerOptions): this;
    one(): void;
    /** Add a `touchstart` event listener. This is the fast alternative to `click` listeners for mobile (no 300ms wait). */
    touchstart(fn: (ev: Event) => any, options?: AddEventListenerOptions): this;
    /** Add a `pointerdown` event listener if browser supports `pointerdown`, else send `mousedown` (safari). */
    pointerdown(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    /**Simulate a click of the element. Useful for `<a>` elements.*/
    click(): this;
    /**Add a `click` event listener. You should probably use `pointerdown()` if on desktop, or `touchstart()` if on mobile.*/
    click(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    /**Blur (unfocus) the element.*/
    blur(): this;
    /**Add a `blur` event listener*/
    blur(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    /**Focus the element.*/
    focus(): this;
    /**Add a `focus` event listener*/
    focus(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    /**Add a `change` event listener*/
    change(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    /**Add a `contextmenu` event listener*/
    contextmenu(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    /**Simulate a double click of the element.*/
    dblclick(): this;
    /**Add a `dblclick` event listener*/
    dblclick(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    /**Simulate a mouseenter event to the element.*/
    mouseenter(): this;
    /**Add a `mouseenter` event listener*/
    mouseenter(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    /**Simulate a keydown event to the element.*/
    keydown(): this;
    /**Add a `keydown` event listener*/
    keydown(fn: (event: KeyboardEvent) => any, options?: AddEventListenerOptions): this;
    keyup(): void;
    keypress(): void;
    mousedown(): void;
    hover(): void;
    mouseleave(): void;
    mousemove(): void;
    mouseout(): void;
    mouseover(): void;
    mouseup(): void;
    transform(options: TransformOptions): Promise<unknown>;
    /** Remove the event listener of `event`, if exists.*/
    off(event: TEvent): this;
    /** For each `[attr, val]` pair, apply `setAttribute`*/
    attr(attrValPairs: TMap<string>): this;
    /** apply `getAttribute`*/
    attr(attributeName: string): string;
    /** `removeAttribute` */
    removeAttr(qualifiedName: string, ...qualifiedNames: string[]): this;
    /**`getAttribute(`data-${key}`)`. JSON.parse it by default.*/
    data(key: string, parse?: boolean): string | TMap<string>;
    fade(dur: number, to: 0 | 1): Promise<this>;
    fadeOut(dur: number): Promise<this>;
    fadeIn(dur: number): Promise<this>;
}
declare class Div extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLDivElement;
    /**Create a Div element. Optionally set its id, text or cls.*/
    constructor({ id, text, cls }?: TSubElemOptions);
}
declare class Span extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLSpanElement;
    /**Create a Span element. Optionally set its id, text or cls.*/
    constructor({ id, text, cls }?: TSubElemOptions);
}
declare class Img extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLImageElement;
    /**Create an Img element. Optionally set its id, src or cls.*/
    constructor({ id, src, cls }: TImgOptions);
    src(src: string): this;
    src(): string;
}
/**Create an element of `tag`. Optionally, set its `text` and / or `cls`*/
declare function elem({ tag, text, cls }: {
    tag: QuerySelector;
    text?: string;
    cls?: string;
}): BetterHTMLElement;
/**Get an existing element by `id`. Optionally, set its `text`, `cls` or cache `children`*/
declare function elem({ id, text, cls, children }: {
    id: string;
    text?: string;
    cls?: string;
    children?: TMap<string>;
}): BetterHTMLElement;
/**Get an existing element by `query`. Optionally, set its `text`, `cls` or cache `children`*/
declare function elem({ query, text, cls, children }: {
    query: QuerySelector;
    text?: string;
    cls?: string;
    children?: TMap<string>;
}): BetterHTMLElement;
/**Wrap an existing HTMLElement. Optionally, set its `text`, `cls` or cache `children`*/
declare function elem({ htmlElement, text, cls, children }: {
    htmlElement: HTMLElement;
    text?: string;
    cls?: string;
    children?: TMap<string>;
}): BetterHTMLElement;
/**Create an Span element. Optionally set its id, text or cls.*/
declare function span({ id, text, cls }?: TSubElemOptions): Span;
/**Create an Div element. Optionally set its id, text or cls.*/
declare function div({ id, text, cls }?: TSubElemOptions): Div;
/**Create an Img element. Optionally set its id, src or cls.*/
declare function img({ id, src, cls }?: TImgOptions): Img;
declare type TMap<T> = {
    [s: string]: T;
};
declare function enumerate<T>(obj: T[]): IterableIterator<[number, T]>;
declare function enumerate<T>(obj: IterableIterator<T>): IterableIterator<[number, T]>;
declare function enumerate<T>(obj: T): IterableIterator<[keyof T, T[keyof T]]>;
declare function wait(ms: number): Promise<any>;
