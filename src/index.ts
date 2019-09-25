type TEvent = keyof HTMLElementEventMap;
type TEventFunctionMap<K extends TEvent> = {
    [P in K]?: (event: HTMLElementEventMap[P]) => void;
};

type HTMLTag = keyof HTMLElementTagNameMap;
type QuerySelector = HTMLTag | string;

interface BaseElemConstructor {
    id?: string;
    cls?: string;
}

interface SubElemConstructor extends BaseElemConstructor {
    text?: string;
}

interface ImgConstructor extends BaseElemConstructor {
    src?: string;
}

interface AnchorConstructor extends SubElemConstructor {
    href?: string;
}

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

type TChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>
type TFunction = (s: string) => boolean

function isFunction(fn: TFunction): fn is TFunction {
    return fn && {}.toString.call(fn) === '[object Function]'
}

// TODO: make BetterHTMLElement<T>, for use in eg child[ren] function
// maybe use https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypet
class BetterHTMLElement {
    protected _htmlElement: HTMLElement;
    private readonly _isSvg: boolean = false;
    private readonly _listeners: TEventFunctionMap<TEvent> = {};
    private _cachedChildren: TMap<BetterHTMLElement> = {};
    
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
    
    // TODO: query should also be a predicate function
    /**Create an element of `tag`. Optionally, set its `text` and / or `cls`*/
    constructor({tag, text, cls}: { tag: QuerySelector, text?: string, cls?: string });
    /**Get an existing element by `id`. Optionally, set its `text`, `cls` or cache `children`*/
    constructor({id, text, cls, children}: { id: string, text?: string, cls?: string, children?: TChildrenObj });
    /**Get an existing element by `query`. Optionally, set its `text`, `cls` or cache `children`*/
    constructor({query, text, cls, children}: { query: QuerySelector, text?: string, cls?: string, children?: TChildrenObj });
    /**Wrap an existing HTMLElement. Optionally, set its `text`, `cls` or cache `children`*/
    constructor({htmlElement, text, cls, children}: { htmlElement: HTMLElement, text?: string, cls?: string, children?: TChildrenObj });
    constructor(elemOptions) {
        const {tag, id, htmlElement, text, query, children, cls} = elemOptions;
        
        if ([tag, id, htmlElement, query].filter(x => x !== undefined).length > 1) {
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
            }, '"children" and "tag" options are mutually exclusive, because tag implies creating a new element and children implies getting an existing one.');
        
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
    
    /**Sets `this._htmlElement` to `newHtmlElement._htmlElement`.
     * Resets `this._cachedChildren` and caches `newHtmlElement._cachedChildren`.
     * Adds event listeners from `newHtmlElement._listeners`, while keeping `this._listeners`.*/
    wrapSomethingElse(newHtmlElement: BetterHTMLElement): this
    /**Sets `this._htmlElement` to `newHtmlElement`.
     * Keeps `this._listeners`.
     * NOTE: this reinitializes `this._cachedChildren` and all event listeners belonging to `newHtmlElement` are lost. Pass a `BetterHTMLElement` to keep them.*/
    wrapSomethingElse(newHtmlElement: HTMLElement): this
    wrapSomethingElse(newHtmlElement) {
        this._cachedChildren = {};
        if (newHtmlElement instanceof BetterHTMLElement) {
            this._htmlElement = newHtmlElement.e;
            for (let [_key, _cachedChild] of enumerate(newHtmlElement._cachedChildren)) {
                this._cache(_key, _cachedChild)
            }
            if (
                Object.keys(this._cachedChildren).length
                !== Object.keys(newHtmlElement._cachedChildren).length
                ||
                Object.values(this._cachedChildren).filter(v => v !== undefined).length
                !== Object.values(newHtmlElement._cachedChildren).filter(v => v !== undefined).length
            ) {
                console.warn(`wrapSomethingElse this._cachedChildren length !== newHtmlElement._cachedChildren.length`, {
                        this: this,
                        newHtmlElement
                    }
                )
            }
            this.on({...this._listeners, ...newHtmlElement._listeners,});
        } else {
            // No way to get newHtmlElement event listeners besides hacking Element.prototype
            this.on(this._listeners);
            this._htmlElement = newHtmlElement;
        }
        
        return this;
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
    text(txt: string | number): this;
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
    css(css: Partial<CssOptions>): this {
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
    
    /**@deprecated*/
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
    /**Return the first class that matches `cls` predicate.*/
    class(cls: Function): string;
    /**Return a string array of the element's classes (not a classList)*/
    class(): string[];
    class(cls?) {
        if (cls === undefined) {
            return Array.from(this.e.classList);
        } else if (isFunction(cls)) {
            return Array.from(this.e.classList).find(cls);
        } else {
            if (this._isSvg) {
                // @ts-ignore
                this.e.classList = [cls];
            } else {
                this.e.className = cls;
            }
            return this;
        }
    }
    
    addClass(cls: string, ...clses: string[]): this {
        this.e.classList.add(cls);
        for (let c of clses)
            this.e.classList.add(c);
        return this;
    }
    
    removeClass(cls: TFunction, ...clses: TFunction[]): this;
    removeClass(cls: string, clses?: string[]): this;
    removeClass(cls, ...clses) {
        if (isFunction(cls)) {
            this.e.classList.remove(this.class(cls));
            for (let c of <TFunction[]>clses)
                this.e.classList.remove(this.class(c));
        } else {
            this.e.classList.remove(cls);
            for (let c of clses)
                this.e.classList.remove(c);
        }
        return this;
    }
    
    replaceClass(oldToken: TFunction, newToken: string): this;
    replaceClass(oldToken: string, newToken: string): this
    replaceClass(oldToken, newToken) {
        if (isFunction(oldToken)) {
            this.e.classList.replace(this.class(oldToken), newToken);
        } else {
            this.e.classList.replace(oldToken, newToken);
        }
        return this;
    }
    
    toggleClass(cls: TFunction, force?: boolean): this
    toggleClass(cls: string, force?: boolean): this
    toggleClass(cls, force) {
        if (isFunction(cls))
            this.e.classList.toggle(this.class(cls), force);
        else
            this.e.classList.toggle(cls, force);
        return this;
    }
    
    /**Returns `this.e.classList.contains(cls)` */
    hasClass(cls: string): boolean
    /**Returns whether `this` has a class that matches passed function */
    hasClass(cls: TFunction): boolean
    hasClass(cls) {
        if (isFunction(cls)) {
            return this.class(cls) !== undefined;
        } else {
            return this.e.classList.contains(cls);
        }
    }
    
    // ***  Nodes
    /**Insert one or several `BetterHTMLElement`s or vanilla `Node`s just after `this`.*/
    after(...nodes: BetterHTMLElement[] | (string | Node)[]): this {
        if (nodes[0] instanceof BetterHTMLElement)
            for (let bhe of <BetterHTMLElement[]>nodes)
                this.e.after(bhe.e);
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
            for (let bhe of <BetterHTMLElement[]>nodes)
                this.e.append(bhe.e);
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
            for (let bhe of <BetterHTMLElement[]>nodes)
                this.e.before(bhe.e);
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
    
    // TODO: if append supports strings, so should this
    replaceChild(newChild: Node, oldChild: Node): this;
    replaceChild(newChild: BetterHTMLElement, oldChild: BetterHTMLElement): this;
    replaceChild(newChild, oldChild) {
        this.e.replaceChild(newChild, oldChild);
        return this;
    }
    
    private _cache(key: string, child: BetterHTMLElement) {
        this[key] = child;
        this._cachedChildren[key] = child;
    }
    
    /**For each `[key, child]` pair, `append(child)` and store it in `this[key]`. */
    cacheAppend(keyChildPairs: TMap<BetterHTMLElement>): this
    /**For each `[key, child]` tuple, `append(child)` and store it in `this[key]`. */
    cacheAppend(keyChildPairs: [string, BetterHTMLElement][]): this
    cacheAppend(keyChildPairs) {
        const _cacheAppend = (_key: string, _child: BetterHTMLElement) => {
            this.append(_child);
            this._cache(_key, _child);
        };
        if (Array.isArray(keyChildPairs)) {
            for (let [key, child] of keyChildPairs)
                _cacheAppend(key, child);
        } else {
            for (let [key, child] of enumerate(keyChildPairs))
                _cacheAppend(key, child);
        }
        return this;
    }
    
    /**Get a child with `querySelector` and return a `BetterHTMLElement` of it*/
    child<K extends HTMLTag>(selector: K): BetterHTMLElement;
    /**Get a child with `querySelector` and return a `BetterHTMLElement` of it*/
    child(selector: string): BetterHTMLElement;
    child(selector) {
        return new BetterHTMLElement({htmlElement: this.e.querySelector(selector)});
    }
    
    
    /**Return a `BetterHTMLElement` list of all children */
    children(): BetterHTMLElement[];
    /**Return a `BetterHTMLElement` list of all children selected by `selector` */
    children<K extends HTMLTag>(selector: K): BetterHTMLElement[];
    /**Return a `BetterHTMLElement` list of all children selected by `selector` */
    children(selector: string | HTMLTag): BetterHTMLElement[];
    children(selector?) {
        let childrenVanilla;
        let childrenCollection;
        if (selector === undefined) {
            childrenCollection = this.e.children;
        } else {
            childrenCollection = this.e.querySelectorAll(selector);
        }
        childrenVanilla = <HTMLElement[]>Array.from(childrenCollection);
        const toElem = (c: HTMLElement) => new BetterHTMLElement({htmlElement: c});
        return childrenVanilla.map(toElem);
    }
    
    clone(deep?: boolean): BetterHTMLElement {
        // @ts-ignore
        return new BetterHTMLElement({htmlElement: this.e.cloneNode(deep)});
    }
    
    /**For each `[key, selector]` pair, where `selector` is either an `HTMLTag` or a `string`, get `this.child(selector)`, and store it in `this[key]`.
     * @example
     * // Using `cacheChildren` directly
     * navbar.cacheChildren({ home: '.navbar-item-home', about: '.navbar-item-about' });
     * navbar.home.toggleClass("selected");
     * navbar.about.css(...);
     * @example
     * // Using `cacheChildren` indirectly through `children` constructor option
     * elem({query: '#navbar', children: { home: '.navbar-item-home', about: '.navbar-item-about' }});
     * navbar.home.toggleClass("selected");
     * navbar.about.css(...);
     * @see this.child*/
    cacheChildren(keySelectorObj: TMap<QuerySelector>): BetterHTMLElement
    /**For each `[key, selector]` pair, where `selector` is a recursive `{subselector: keySelectorObj}` object,
     * extract `this.child(subselector)`, store it in `this[key]`, then call `this[key].cacheChildren` passing the recursive object.
     * @example
     * // Using `cacheChildren` directly
     * navbar.cacheChildren({
     *      home: {
     *          '.navbar-item-home': {
     *              news: '.navbar-subitem-news,
     *              support: '.navbar-subitem-support'
     *          }
     *      }
     *  });
     * navbar.home.toggleClass("selected");
     * navbar.home.news.css(...);
     * navbar.home.support.pointerdown(...);
     * @example
     * // Using `cacheChildren` indirectly through `children` constructor option
     * elem({query: '#navbar', children: {
     *      home: {
     *          '.navbar-item-home': {
     *              news: '.navbar-subitem-news,
     *              support: '.navbar-subitem-support'
     *          }
     *      }
     *  }});
     * navbar.home.toggleClass("selected");
     * navbar.home.news.css(...);
     * navbar.home.support.pointerdown(...);
     * @see this.child*/
    cacheChildren(keySelectorObj: TRecMap<QuerySelector>): BetterHTMLElement
    /**key: string. value: either "selector string" OR {"selector string": <recurse down>}*/
    cacheChildren(keySelectorObj) {
        for (let [key, selectorOrObj] of enumerate(keySelectorObj)) {
            if (typeof selectorOrObj === 'object') {
                let entries = Object.entries(<TMap<QuerySelector> | TRecMap<QuerySelector>>selectorOrObj);
                if (entries[1] !== undefined) {
                    console.warn(
                        `cacheChildren() received recursive obj with more than 1 selector for a key. Using only 0th selector`, {
                            key,
                            "multiple selectors": entries.map(e => e[0]),
                            selectorOrObj,
                            this: this
                        }
                    );
                }
                // only first because 1:1 for key:selector.
                // (ie can't do {right: {.right: {...}, .right2: {...}})
                let [selector, obj] = entries[0];
                this._cache(key, this.child(selector));
                // this[key] = this.child(selector);
                this[key].cacheChildren(obj)
            } else {
                // this[key] = this.child(<QuerySelector>selectorOrObj);
                this._cache(key, this.child(<QuerySelector>selectorOrObj));
            }
        }
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
    
    // TODO: recursively yield children
    //  (unlike .children(), this doesn't return only the first level)
    /**@deprecated*/
    find() {
        // https://api.jquery.com/find/
        throw new Error("NOT IMPLEMENTED")
    }
    
    /**@deprecated*/
    first() {
        // https://api.jquery.com/first/
        // this.e.firstChild
        throw new Error("NOT IMPLEMENTED")
    }
    
    /**@deprecated*/
    last() {
        // https://api.jquery.com/last/
        // this.e.lastChild
        throw new Error("NOT IMPLEMENTED")
    }
    
    /**@deprecated*/
    next() {
        throw new Error("NOT IMPLEMENTED")
    }
    
    /**@deprecated*/
    not() {
        throw new Error("NOT IMPLEMENTED")
    }
    
    /**@deprecated*/
    parent() {
        throw new Error("NOT IMPLEMENTED")
    }
    
    /**@deprecated*/
    parents() {
        throw new Error("NOT IMPLEMENTED")
    }
    
    
    // ***  Events
    
    on(evTypeFnPairs: TEventFunctionMap<TEvent>, options?: AddEventListenerOptions): this {
        // const that = this; // "this" changes inside function _f
        for (let [evType, evFn] of enumerate(evTypeFnPairs)) {
            const _f = function _f(evt) {
                evFn(evt);
            };
            this.e.addEventListener(evType, _f, options);
            this._listeners[evType] = _f;
        }
        return this;
    }
    
    /**@deprecated*/
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
    touchstart(fn: (ev: TouchEvent) => any, options?: AddEventListenerOptions): this {
        this.e.addEventListener('touchstart', function _f(ev: TouchEvent) {
            ev.preventDefault(); // otherwise "touchmove" is triggered
            fn(ev);
            if (options && options.once) // TODO: maybe native options.once is enough
                this.removeEventListener('touchstart', _f);
        }, options);
        // TODO: this._listeners, or use this.on(
        return this;
    }
    
    /** Add a `pointerdown` event listener if browser supports `pointerdown`, else send `mousedown` (safari). */
    pointerdown(fn: (event: PointerEvent | MouseEvent) => any, options?: AddEventListenerOptions): this {
        
        let action;
        try {
            // TODO: check if PointerEvent exists instead of try/catch
            // @ts-ignore
            action = window.PointerEvent ? 'pointerdown' : 'mousedown'; // safari doesn't support pointerdown
        } catch (e) {
            action = 'mousedown'
        }
        const _f = function _f(ev: PointerEvent | MouseEvent): void {
            ev.preventDefault();
            fn(ev);
            if (options && options.once) // TODO: maybe native options.once is enough
                this.removeEventListener(action, _f);
        };
        this.e.addEventListener(action, _f, options);
        this._listeners.pointerdown = _f;
        return this;
    }
    
    /**Simulate a click of the element. Useful for `<a>` elements.*/
    click(): this;
    /**Add a `click` event listener. You should probably use `pointerdown()` if on desktop, or `touchstart()` if on mobile.*/
    click(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    click(fn?, options?) {
        if (fn === undefined) {
            this.e.click();
            return this;
        } else {
            return this.on({click: fn}, options);
        }
    }
    
    /**Blur (unfocus) the element.*/
    blur(): this;
    /**Add a `blur` event listener*/
    blur(fn: (event: FocusEvent) => any, options?: AddEventListenerOptions): this;
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
    focus(fn: (event: FocusEvent) => any, options?: AddEventListenerOptions): this;
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
    contextmenu(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this {
        return this.on({contextmenu: fn}, options);
    }
    
    /**Simulate a double click of the element.*/
    dblclick(): this;
    /**Add a `dblclick` event listener*/
    dblclick(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
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
    mouseenter(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    mouseenter(fn?, options?) {
        // mouseover: also child elements
        // mouseenter: only bound element
        
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
    
    /**@deprecated*/
    keyup() {
        // https://api.jquery.com/keyup/
        throw new Error("NOT IMPLEMENTED")
    }
    
    /**@deprecated*/
    keypress() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED")
    }
    
    /**@deprecated*/
    hover() {
        // https://api.jquery.com/hover/
        // binds to both mouseenter and mouseleave
        // https://stackoverflow.com/questions/17589420/when-to-choose-mouseover-and-hover-function
        throw new Error("NOT IMPLEMENTED")
    }
    
    /**@deprecated*/
    mousedown() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED")
    }
    
    /**@deprecated*/
    mouseleave() {
        // https://api.jquery.com/keypress/
        //mouseleave and mouseout are similar but differ in that mouseleave does not bubble and mouseout does.
        // This means that mouseleave is fired when the pointer has exited the element and all of its descendants,
        // whereas mouseout is fired when the pointer leaves the element or leaves one of the element's descendants
        // (even if the pointer is still within the element).
        throw new Error("NOT IMPLEMENTED")
    }
    
    /**@deprecated*/
    mousemove() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED")
    }
    
    /**Simulate a mouseout event to the element.*/
    // @ts-ignore
    mouseout(): this;
    /**Add a `mouseout` event listener*/
    mouseout(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    mouseout(fn?, options?) {
        //mouseleave and mouseout are similar but differ in that mouseleave does not bubble and mouseout does.
        // This means that mouseleave is fired when the pointer has exited the element and all of its descendants,
        // whereas mouseout is fired when the pointer leaves the element or leaves one of the element's descendants
        // (even if the pointer is still within the element).
        if (fn === undefined) throw new Error("NOT IMPLEMENTED");
        else
            return this.on({mouseout: fn}, options)
    }
    
    /**Simulate a mouseover event to the element.*/
    mouseover(): this;
    /**Add a `mouseover` event listener*/
    mouseover(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this;
    mouseover(fn?, options?) {
        // mouseover: also child elements
        // mouseenter: only bound element
        if (fn === undefined) throw new Error("NOT IMPLEMENTED");
        else
            return this.on({mouseover: fn}, options)
    }
    
    /**@deprecated*/
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
    
    allOff(): this {
        for (let event in this._listeners) {
            this.off(<TEvent>event);
        }
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
    readonly e: HTMLDivElement;
    
    /**Create a Div element. Optionally set its id, text or cls.*/
    constructor({id, text, cls}: SubElemConstructor = {}) {
        super({tag: 'div', text, cls});
        if (id)
            this.id(id);
    }
}

class Paragraph extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLParagraphElement;
    readonly e: HTMLParagraphElement;
    
    /**Create a Paragraph element. Optionally set its id, text or cls.*/
    constructor({id, text, cls}: SubElemConstructor = {}) {
        super({tag: 'p', text, cls});
        if (id)
            this.id(id);
    }
}

class Span extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLSpanElement;
    readonly e: HTMLSpanElement;
    
    /**Create a Span element. Optionally set its id, text or cls.*/
    constructor({id, text, cls}: SubElemConstructor = {}) {
        super({tag: 'span', text, cls});
        if (id)
            this.id(id);
        
    }
}

class Img extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLImageElement;
    
    /**Create an Img element. Optionally set its id, src or cls.*/
    constructor({id, src, cls}: ImgConstructor) {
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
    
    readonly e: HTMLImageElement;
}

class Anchor extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLAnchorElement;
    readonly e: HTMLAnchorElement;
    
    /**Create an Anchor element. Optionally set its id, text, href or cls.*/
    constructor({id, text, cls, href}: AnchorConstructor = {}) {
        super({tag: 'a', text, cls});
        if (id)
            this.id(id);
        if (href)
            this.href(href)
        
    }
    
    href(): string
    href(val: string): this
    href(val?) {
        if (val === undefined)
            return this.attr('href');
        else
            return this.attr({href: val})
    }
    
    target(): string
    target(val: string): this
    target(val?) {
        if (val === undefined)
            return this.attr('target');
        else
            return this.attr({target: val})
    }
}

/**Create an element of `tag`. Optionally, set its `text` and / or `cls`*/
function elem({tag, text, cls}: { tag: QuerySelector, text?: string, cls?: string }): BetterHTMLElement;
/**Get an existing element by `id`. Optionally, set its `text`, `cls` or cache `children`*/
function elem({id, text, cls, children}: { id: string, text?: string, cls?: string, children?: TChildrenObj }): BetterHTMLElement;
/**Get an existing element by `query`. Optionally, set its `text`, `cls` or cache `children`*/
function elem({query, text, cls, children}: { query: QuerySelector, text?: string, cls?: string, children?: TChildrenObj }): BetterHTMLElement;
/**Wrap an existing HTMLElement. Optionally, set its `text`, `cls` or cache `children`*/
function elem({htmlElement, text, cls, children}: { htmlElement: HTMLElement, text?: string, cls?: string, children?: TChildrenObj }): BetterHTMLElement;
function elem(elemOptions): BetterHTMLElement {
    return new BetterHTMLElement(elemOptions);
}

/**Create an Span element. Optionally set its id, text or cls.*/
function span({id, text, cls}: SubElemConstructor = {}): Span {
    return new Span({id, text, cls});
}

/**Create an Div element. Optionally set its id, text or cls.*/
function div({id, text, cls}: SubElemConstructor = {}): Div {
    return new Div({id, text, cls});
}

/**Create an Img element. Optionally set its id, src or cls.*/
function img({id, src, cls}: ImgConstructor = {}): Img {
    return new Img({id, src, cls});
}

/**Create a Paragraph element. Optionally set its id, text or cls.*/
function paragraph({id, text, cls}: SubElemConstructor = {}): Paragraph {
    return new Paragraph({id, text, cls});
}

/**Create an Anchor element. Optionally set its id, text, href or cls.*/
function anchor({id, text, cls, href}: AnchorConstructor = {}): Anchor {
    return new Anchor({id, text, cls, href});
}
