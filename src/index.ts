type TEvent = keyof HTMLElementEventMap;
type TEventFunctionMap<K> = {
    [P in Extract<K, string>]?: (evt: Event) => void
};

type HTMLTag = keyof HTMLElementTagNameMap;
type QuerySelector = HTMLTag | string;


type TSubElemOptions = {
    id?: string;
    text?: string;
    cls?: string;
};
type TImgOptions = {
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

const SVG_NS_URI = 'http://www.w3.org/2000/svg';

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

// TODO: make BetterHTMLElement<T>, for use in eg child function
class BetterHTMLElement {
    protected readonly _htmlElement: HTMLElement;
    private readonly _isSvg: boolean = false;
    private readonly _listeners: TEventFunctionMap<TEvent> = {};
    
    /*[Symbol.toPrimitive](hint) {
        console.log('from toPrimitive, hint: ', hint, '\nthis: ', this);
        return this._htmlElement;
    }
    
    valueOf() {
        console.log('from valueOf, this: ', this);
        return this;
    }
    
    toString() {
        console.log('from toString, this: ', this);
        return this;
    }
    */
    /**Create an element of `tag`. Optionally, set its `text` and / or `cls`*/
    constructor({tag, text, cls}: { tag: QuerySelector, text?: string, cls?: string });
    /**Get an existing element by `id`. Optionally, set its `text`, `cls` or cache `children`*/
    constructor({id, text, cls, children}: { id: string, text?: string, cls?: string, children?: TMap<string> });
    /**Get an existing element by `query`. Optionally, set its `text`, `cls` or cache `children`*/
    constructor({query, text, cls, children}: { query: QuerySelector, text?: string, cls?: string, children?: TMap<string> });
    /**Wrap an existing HTMLElement. Optionally, set its `text`, `cls` or cache `children`*/
    constructor({htmlElement, text, cls, children}: { htmlElement: HTMLElement, text?: string, cls?: string, children?: TMap<string> });
    constructor(elemOptions) {
        const {tag, id, htmlElement, text, query, children, cls} = elemOptions;
        
        if ([tag, id, htmlElement, query].filter(x => x).length > 1) {
            throw new BadArgumentsAmountError(1, {
                tag,
                id,
                htmlElement,
                query
            })
            
        }
        if (tag && children)
            throw new BadArgumentsAmountError(1, {
                tag,
                children
            }, 'children and tag options are mutually exclusive, since tag implies creating a new element and children implies getting an existing one.');
        
        if (tag) {
            if (['svg', 'path'].includes(tag.toLowerCase())) {
                this._isSvg = true;
                this._htmlElement = document.createElementNS(SVG_NS_URI, tag);
                // this._htmlElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
            } else {
                this._htmlElement = document.createElement(tag);
            }
        } else if (id)
            this._htmlElement = document.getElementById(id);
        else if (query)
            this._htmlElement = document.querySelector(query);
        else if (htmlElement)
            this._htmlElement = htmlElement;
        else {
            
            throw new BadArgumentsAmountError(1, {
                tag,
                id,
                htmlElement,
                query
            })
        }
        if (text !== undefined)
            this.text(text);
        if (cls !== undefined)
            this.class(cls);
        
        if (children !== undefined)
            this.cacheChildren(children);
        
        // Object.assign(this, proxy);
        /*const that = this;
        return new Proxy(this, {
            get(target: BetterHTMLElement, p: string | number | symbol, receiver: any): any {
                // console.log('logging');
                // console.log('target: ', target,
                //     '\nthat: ', that,
                //     '\ntypeof(that): ', typeof (that),
                //     '\np: ', p,
                //     '\nreceiver: ', receiver,
                //     '\nthis: ', this);
                return that[p];
            }
        })
        */
    }
    
    /**Return the wrapped HTMLElement*/
    get e() {
        return this._htmlElement;
    }
    
    // ***  Basic
    /**Set the element's innerHTML*/
    html(html: string): this;
    /**Get the element's innerHTML*/
    html(): string;
    html(html?) {
        if (html === undefined) {
            return this.e.innerHTML;
        } else {
            this.e.innerHTML = html;
            return this;
        }
    }
    
    /**Set the element's innerText*/
    text(txt: string): this;
    /**Get the element's innerText*/
    text(): string;
    text(txt?) {
        if (txt === undefined) {
            return this.e.innerText;
        } else {
            this.e.innerText = txt;
            return this;
        }
        
    }
    
    /**Set the id of the element*/
    id(id: string): this;
    /**Get the id of the element*/
    id(): string;
    id(id?) {
        if (id === undefined) {
            return this.e.id;
        } else {
            this.e.id = id;
            return this;
        }
    }
    
    /**For each `[styleAttr, styleVal]` pair, set the `style[styleAttr]` to `styleVal`.*/
    css(css: CssOptions): this {
        for (let [styleAttr, styleVal] of enumerate(css))
            this.e.style[<string>styleAttr] = styleVal;
        return this;
    }
    
    /**Remove the value of the passed style properties*/
    uncss(...removeProps: (keyof CssOptions)[]): this {
        let css = {};
        for (let prop of removeProps)
            css[prop] = '';
        return this.css(css);
    }
    
    is(element: BetterHTMLElement) {
        // https://api.jquery.com/is/
        throw new Error("NOT IMPLEMENTED");
    }
    
    /*
        animate(opts: AnimateOptions) {
            // see: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Tips
            throw new Error('Not implemented');
        }
    */
    
    // ***  Classes
    /**`.className = cls`*/
    class(cls: string): this;
    /**Return a string array of the element's classes (not a classList)*/
    class(): string[];
    class(cls?) {
        if (cls === undefined) {
            return Array.from(this.e.classList);
        } else {
            if (this._isSvg)
                this.e.classList = [cls];
            else
                this.e.className = cls;
            return this;
        }
    }
    
    addClass(cls: string, ...clses: string[]): this {
        this.e.classList.add(cls);
        for (let c of clses)
            this.e.classList.add(c);
        return this;
    }
    
    removeClass(cls: string, ...clses: string[]): this {
        this.e.classList.remove(cls);
        for (let c of clses)
            this.e.classList.remove(c);
        return this;
    }
    
    replaceClass(oldToken: string, newToken: string): this {
        this.e.classList.replace(oldToken, newToken);
        return this;
    }
    
    toggleClass(cls: string, force?: boolean): this {
        this.e.classList.toggle(cls, force);
        return this;
    }
    
    hasClass(cls: string): boolean {
        return this.e.classList.contains(cls);
    }
    
    // ***  Nodes
    /**Insert one or several `BetterHTMLElement`s or vanilla `Node`s just after `this`.*/
    after(...nodes: BetterHTMLElement[] | (string | Node)[]): this {
        if (nodes[0] instanceof BetterHTMLElement)
            for (let node of <BetterHTMLElement[]>nodes)
                this.e.after(node.e);
        else
            for (let node of <(string | Node)[]>nodes)
                this.e.after(node); // TODO: test what happens when passed strings
        return this;
    }
    
    /**Insert `this` just after a `BetterHTMLElement` or vanilla `Node`s.*/
    insertAfter(node: BetterHTMLElement | (string | Node)): this {
        if (node instanceof BetterHTMLElement)
            node.e.after(this.e);
        else
            node.after(this.e);
        return this;
    }
    
    /**Insert one or several `BetterHTMLElement`s or vanilla `Node`s after the last child of `this`*/
    append(...nodes: BetterHTMLElement[] | (string | Node)[]): this {
        if (nodes[0] instanceof BetterHTMLElement)
            for (let node of <BetterHTMLElement[]>nodes)
                this.e.append(node.e);
        else
            for (let node of <(string | Node)[]>nodes)
                this.e.append(node); // TODO: test what happens when passed strings
        return this;
    }
    
    /**Append `this` to a `BetterHTMLElement` or a vanilla `Node`*/
    appendTo(node: BetterHTMLElement | (string | Node)): this {
        if (node instanceof BetterHTMLElement)
            node.e.append(this.e);
        else
            node.append(this.e);
        return this;
    }
    
    /**Inserts one or several `BetterHTMLElement`s or vanilla `Node`s just before `this`*/
    before(...nodes: BetterHTMLElement[] | (string | Node)[]): this {
        if (nodes[0] instanceof BetterHTMLElement)
            for (let node of <BetterHTMLElement[]>nodes)
                this.e.before(node.e);
        else
            for (let node of <(string | Node)[]>nodes)
                this.e.before(node); // TODO: test what happens when passed strings
        return this;
    }
    
    /**Insert `this` just before a `BetterHTMLElement` or vanilla `Node`s.*/
    insertBefore(node: BetterHTMLElement | (string | Node)): this {
        if (node instanceof BetterHTMLElement)
            node.e.before(this.e);
        else
            node.before(this.e);
        return this;
    }
    
    
    /**For each `[key, child]` pair, `append(child)` and store it in `this[key]`. */
    cacheAppend(keyChildObj: TMap<BetterHTMLElement>): this {
        for (let [key, child] of enumerate(keyChildObj)) {
            this.append(child);
            this[key] = child;
        }
        return this;
    }
    
    /**Get a child with `querySelector` and return a `BetterHTMLElement` of it*/
    child<K extends HTMLTag>(selector: K): BetterHTMLElement;
    /**Get a child with `querySelector` and return a BetterHTMLElement of it*/
    child(selector: string): BetterHTMLElement;
    child(selector) {
        return new BetterHTMLElement({htmlElement: this.e.querySelector(selector)});
    }
    
    // TODO: if append supports strings, so should this
    replaceChild(newChild: Node, oldChild: Node): this;
    replaceChild(newChild: BetterHTMLElement, oldChild: BetterHTMLElement): this;
    replaceChild(newChild, oldChild) {
        this.e.replaceChild(newChild, oldChild);
        return this;
    }
    
    /**Return a `BetterHTMLElement` list of all children */
    children(): BetterHTMLElement[] {
        
        const childrenVanilla = <HTMLElement[]>Array.from(this.e.children);
        const toElem = (c: HTMLElement) => new BetterHTMLElement({htmlElement: c});
        return childrenVanilla.map(toElem);
    }
    
    clone(deep?: boolean): BetterHTMLElement {
        // @ts-ignore
        return new BetterHTMLElement({htmlElement: this.e.cloneNode(deep)});
    }
    
    /**For each `[key, selector]` pair, get `this.child(selector)`, and store it in `this[key]`. Useful for eg `navbar.home.toggleClass("selected")`
     * @see this.child*/
    cacheChildren(keySelectorObj: TMap<QuerySelector>): BetterHTMLElement {// .class | #id | img, button, ...
        for (let [key, selector] of enumerate(keySelectorObj))
            this[key] = this.child(selector);
        return this;
        
    }
    
    /**Remove all children from DOM*/
    empty(): this {
        // TODO: is this faster than innerHTML = ""?
        while (this.e.firstChild)
            this.e.removeChild(this.e.firstChild);
        return this;
    }
    
    /**Remove element from DOM*/
    remove(): this {
        this.e.remove();
        return this;
    }
    
    // TODO: recursively yield children (unlike .children(), this doesn't return only the first level)
    find() {
        // https://api.jquery.com/find/
        throw new Error("NOT IMPLEMENTED")
    }
    
    first() {
        // https://api.jquery.com/first/
        // this.e.firstChild
        throw new Error("NOT IMPLEMENTED")
    }
    
    last() {
        // https://api.jquery.com/last/
        // this.e.lastChild
        throw new Error("NOT IMPLEMENTED")
    }
    
    next() {
        throw new Error("NOT IMPLEMENTED")
    }
    
    not() {
        throw new Error("NOT IMPLEMENTED")
    }
    
    parent() {
        throw new Error("NOT IMPLEMENTED")
    }
    
    parents() {
        throw new Error("NOT IMPLEMENTED")
    }
    
    
    // ***  Events
    
    on(evTypeFnPairs: TEventFunctionMap<TEvent>, options?: AddEventListenerOptions): this {
        const that = this; // "this" changes inside function _f
        for (let [evType, evFn] of enumerate(evTypeFnPairs)) {
            this.e.addEventListener(evType, function _f(evt) {
                evFn(evt);
                // console.log('addEventListener, evt: ', evt, 'options: ', options, 'this: ', this);
                // if (options && options.once)
                //     this.removeEventListener(evType, _f);
            }, options);
        }
        return this;
    }
    
    one() {
        throw new Error("NOT IMPLEMENTED")
    }
    
    /*
	mousedown   touchstart	pointerdown
	mouseenter		        pointerenter
	mouseleave		        pointerleave
	mousemove	touchmove	pointermove
	mouseout		        pointerout
	mouseover		        pointerover
	mouseup	    touchend    pointerup
	*/
    /** Add a `touchstart` event listener. This is the fast alternative to `click` listeners for mobile (no 300ms wait). */
    touchstart(fn: (ev: Event) => any, options?: AddEventListenerOptions): this {
        this.e.addEventListener('touchstart', function _f(ev: Event) {
            ev.preventDefault(); // otherwise "touchmove" is triggered
            fn(ev);
            if (options && options.once) // TODO: maybe native options.once is enough
                this.removeEventListener('touchstart', _f);
        });
        return this;
    }
    
    /** Add a `pointerdown` event listener if browser supports `pointerdown`, else send `mousedown` (safari). */
    pointerdown(fn: (event: Event) => any, options?: AddEventListenerOptions): this {
        
        let action;
        try {
            // @ts-ignore
            action = window.PointerEvent ? 'pointerdown' : 'mousedown'; // safari doesn't support pointerdown
        } catch (e) {
            action = 'mousedown'
        }
        const _f = function _f(ev: Event): void {
            ev.preventDefault();
            fn(ev);
            if (options && options.once) // TODO: maybe native options.once is enough
                this.removeEventListener(action, _f);
        };
        this.e.addEventListener(action, _f);
        this._listeners.pointerdown = _f;
        return this;
    }
    
    /**Simulate a click of the element. Useful for `<a>` elements.*/
    click(): this;
    /**Add a `click` event listener. You should probably use `pointerdown()` if on desktop, or `touchstart()` if on mobile.*/
    click(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    click(fn?, options?) {
        if (fn === undefined) {
            this.e.click();
            return this;
        } else {
            this.e.addEventListener('click', fn, options);
            return this;
        }
    }
    
    /**Blur (unfocus) the element.*/
    blur(): this;
    /**Add a `blur` event listener*/
    blur(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    blur(fn?, options?) {
        if (fn === undefined) {
            this.e.blur();
            return this;
        } else {
            return this.on({blur: fn}, options)
        }
    }
    
    /**Focus the element.*/
    focus(): this;
    /**Add a `focus` event listener*/
    focus(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    focus(fn?, options?) {
        if (fn === undefined) {
            this.e.focus();
            return this;
        } else {
            return this.on({focus: fn}, options)
        }
    }
    
    
    /**Add a `change` event listener*/
    change(fn: (event: Event) => any, options?: AddEventListenerOptions): this {
        return this.on({change: fn}, options);
    }
    
    /**Add a `contextmenu` event listener*/
    contextmenu(fn: (event: Event) => any, options?: AddEventListenerOptions): this {
        return this.on({contextmenu: fn}, options);
    }
    
    /**Simulate a double click of the element.*/
    dblclick(): this;
    /**Add a `dblclick` event listener*/
    dblclick(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    dblclick(fn?, options?) {
        if (fn === undefined) {
            const dblclick = new MouseEvent('dblclick', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            this.e.dispatchEvent(dblclick);
            return this;
        } else {
            return this.on({dblclick: fn}, options)
        }
    }
    
    /**Simulate a mouseenter event to the element.*/
    mouseenter(): this;
    /**Add a `mouseenter` event listener*/
    mouseenter(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    mouseenter(fn?, options?) {
        if (fn === undefined) {
            const mouseenter = new MouseEvent('mouseenter', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            this.e.dispatchEvent(mouseenter);
            return this;
        } else {
            return this.on({mouseenter: fn}, options)
        }
    }
    
    /**Simulate a keydown event to the element.*/
    // @ts-ignore
    keydown(): this;
    /**Add a `keydown` event listener*/
    keydown(fn: (event: KeyboardEvent) => any, options?: AddEventListenerOptions): this;
    keydown(fn?, options?) {
        if (fn === undefined) throw new Error("NOT IMPLEMENTED");
        else
            return this.on({keydown: fn}, options)
    }
    
    keyup() {
        // https://api.jquery.com/keyup/
        throw new Error("NOT IMPLEMENTED")
    }
    
    keypress() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED")
    }
    
    mousedown() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED")
    }
    
    hover() {
        // https://api.jquery.com/hover/
        // binds to both mouseenter and mouseleave
        // https://stackoverflow.com/questions/17589420/when-to-choose-mouseover-and-hover-function
        throw new Error("NOT IMPLEMENTED")
    }
    
    mouseleave() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED")
    }
    
    mousemove() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED")
    }
    
    mouseout() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED")
    }
    
    mouseover() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED")
    }
    
    mouseup() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED")
    }
    
    transform(options: TransformOptions) {
        let transform: string = '';
        for (let [k, v] of enumerate(options)) {
            transform += `${k}(${v}) `
        }
        return new Promise(resolve => {
            this.on({
                transitionend: resolve
            }, {once: true});
            this.css({transform})
        })
    }
    
    /** Remove the event listener of `event`, if exists.*/
    off(event: TEvent): this {
        this.e.removeEventListener(event, this._listeners[event]);
        return this;
    }
    
    // ***  Attributes
    
    /** For each `[attr, val]` pair, apply `setAttribute`*/
    attr(attrValPairs: TMap<string>): this
    /** apply `getAttribute`*/
    attr(attributeName: string): string
    attr(attrValPairs) {
        if (typeof attrValPairs === 'string') {
            return this.e.getAttribute(attrValPairs);
        } else {
            for (let [attr, val] of enumerate(attrValPairs))
                this.e.setAttribute(attr, val);
            return this;
        }
    }
    
    /** `removeAttribute` */
    removeAttr(qualifiedName: string, ...qualifiedNames: string[]): this {
        let _removeAttribute;
        if (this._isSvg)
            _removeAttribute = (qualifiedName) => this.e.removeAttributeNS(SVG_NS_URI, qualifiedName);
        else
            _removeAttribute = (qualifiedName) => this.e.removeAttribute(qualifiedName);
        
        _removeAttribute(qualifiedName);
        for (let qn of qualifiedNames)
            _removeAttribute(qn);
        return this;
    }
    
    /**`getAttribute(`data-${key}`)`. JSON.parse it by default.*/
    data(key: string, parse: boolean = true): string | TMap<string> {
        // TODO: jquery doesn't affect data-* attrs in DOM. https://api.jquery.com/data/
        const data = this.e.getAttribute(`data-${key}`);
        if (parse)
            return JSON.parse(data);
        else
            return data
    }
    
    // **  Fade
    async fade(dur: number, to: 0 | 1): Promise<this> {
        const styles = window.getComputedStyle(this.e);
        const transProp = styles.transitionProperty.split(', ');
        const indexOfOpacity = transProp.indexOf('opacity');
        // css opacity:0 => transDur[indexOfOpacity]: 0s
        // css opacity:500ms => transDur[indexOfOpacity]: 0.5s
        // css NO opacity => transDur[indexOfOpacity]: undefined
        if (indexOfOpacity !== -1) {
            const transDur = styles.transitionDuration.split(', ');
            const opacityTransDur = transDur[indexOfOpacity];
            const trans = styles.transition.split(', ');
            // transition: opacity was defined in css.
            // set transition to dur, set opacity to 0, leave the animation to native transition, wait dur and return this
            console.warn(`fade(${dur}, ${to}), opacityTransDur !== undefined. nullifying transition. SHOULD NOT WORK`);
            console.log(`trans:\t${trans}\ntransProp:\t${transProp}\nindexOfOpacity:\t${indexOfOpacity}\nopacityTransDur:\t${opacityTransDur}`);
            // trans.splice(indexOfOpacity, 1, `opacity ${dur / 1000}s`);
            trans.splice(indexOfOpacity, 1, `opacity 0s`);
            console.log(`after, trans: ${trans}`);
            this.e.style.transition = trans.join(', ');
            this.css({opacity: to});
            await wait(dur);
            return this;
        }
        // transition: opacity was NOT defined in css.
        if (dur == 0) {
            return this.css({opacity: to});
        }
        const isFadeOut = to === 0;
        let opacity = parseFloat(this.e.style.opacity);
        
        if (opacity === undefined || isNaN(opacity)) {
            console.warn(`fade(${dur}, ${to}) htmlElement has NO opacity at all. recursing`, {
                opacity,
                this: this
            });
            return this.css({opacity: Math.abs(1 - to)}).fade(dur, to)
        } else {
            
            if (isFadeOut ? opacity <= 0 : opacity > 1) {
                console.warn(`fade(${dur}, ${to}) opacity was beyond target opacity. returning this as is.`, {
                    opacity,
                    this: this
                });
                return this;
            }
        }
        
        let steps = 30;
        let opStep = 1 / steps;
        let everyms = dur / steps;
        if (everyms < 1) {
            everyms = 1;
            steps = dur;
            opStep = 1 / steps;
        }
        console.log(`fade(${dur}, ${to}) had opacity, no transition. (good) opacity: ${opacity}`, {
            steps,
            opStep,
            everyms
        });
        const reachedTo = isFadeOut ? (op) => op - opStep > 0 : (op) => op + opStep < 1;
        const interval = setInterval(() => {
            if (reachedTo(opacity)) {
                if (isFadeOut)
                    opacity -= opStep;
                else
                    opacity += opStep;
                this.css({opacity});
            } else {
                opacity = to;
                this.css({opacity});
                clearInterval(interval);
            }
        }, everyms);
        await wait(dur);
        return this;
    }
    
    async fadeOut(dur: number): Promise<this> {
        return await this.fade(dur, 0);
    }
    
    
    async fadeIn(dur: number): Promise<this> {
        return await this.fade(dur, 1);
    }
    
    
}


customElements.define('better-html-element', BetterHTMLElement);

class Div extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLDivElement;
    
    /**Create a Div element. Optionally set its id, text or cls.*/
    constructor({id, text, cls}: TSubElemOptions = {}) {
        super({tag: "div", text, cls});
        if (id)
            this.id(id);
    }
}

class Span extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLSpanElement;
    
    /**Create a Span element. Optionally set its id, text or cls.*/
    constructor({id, text, cls}: TSubElemOptions = {}) {
        super({tag: 'span', text, cls});
        if (id)
            this.id(id);
        
    }
}

class Img extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLImageElement;
    
    /**Create an Img element. Optionally set its id, src or cls.*/
    constructor({id, src, cls}: TImgOptions) {
        // if (!src)
        //     throw new Error(`Img constructor didn't receive src`);
        super({tag: 'img', cls});
        if (id)
            this.id(id);
        if (src)
            this._htmlElement.src = src;
        
    }
    
    src(src: string): this;
    src(): string;
    src(src?) {
        if (src === undefined) {
            return this._htmlElement.src
        } else {
            this._htmlElement.src = src;
            return this;
        }
    }
}

/**Create an element of `tag`. Optionally, set its `text` and / or `cls`*/
function elem({tag, text, cls}: { tag: QuerySelector, text?: string, cls?: string }): BetterHTMLElement;
/**Get an existing element by `id`. Optionally, set its `text`, `cls` or cache `children`*/
function elem({id, text, cls, children}: { id: string, text?: string, cls?: string, children?: TMap<string> }): BetterHTMLElement;
/**Get an existing element by `query`. Optionally, set its `text`, `cls` or cache `children`*/
function elem({query, text, cls, children}: { query: QuerySelector, text?: string, cls?: string, children?: TMap<string> }): BetterHTMLElement;
/**Wrap an existing HTMLElement. Optionally, set its `text`, `cls` or cache `children`*/
function elem({htmlElement, text, cls, children}: { htmlElement: HTMLElement, text?: string, cls?: string, children?: TMap<string> }): BetterHTMLElement;
function elem(elemOptions): BetterHTMLElement {
    return new BetterHTMLElement(elemOptions);
}

/**Create an Span element. Optionally set its id, text or cls.*/
function span({id, text, cls}: TSubElemOptions = {}): Span {
    return new Span({id, text, cls});
}

/**Create an Div element. Optionally set its id, text or cls.*/
function div({id, text, cls}: TSubElemOptions = {}): Div {
    return new Div({id, text, cls});
}

/**Create an Img element. Optionally set its id, src or cls.*/
function img({id, src, cls}: TImgOptions = {}): Img {
    return new Img({id, src, cls});
}


