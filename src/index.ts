const SVG_NS_URI = 'http://www.w3.org/2000/svg';


class BetterHTMLElement {
    protected _htmlElement: HTMLElement;
    private readonly _isSvg: boolean = false;
    private readonly _listeners: TEventFunctionMap<TEvent> = {};
    private _cachedChildren: TMap<BetterHTMLElement> = {};
    
    /**Create an element of `tag`. Optionally, set its `text` and / or `cls`*/
    constructor({tag, text, cls}: { tag: QuerySelector, text?: string, cls?: string });
    /**Get an existing element by `id`. Optionally, set its `text`, `cls` or cache `children`*/
    constructor({id, text, cls, children}: { id: string, text?: string, cls?: string, children?: ChildrenObj });
    /**Get an existing element by `query`. Optionally, set its `text`, `cls` or cache `children`*/
    constructor({query, text, cls, children}: { query: QuerySelector, text?: string, cls?: string, children?: ChildrenObj });
    /**Wrap an existing HTMLElement. Optionally, set its `text`, `cls` or cache `children`*/
    constructor({htmlElement, text, cls, children}: { htmlElement: HTMLElement, text?: string, cls?: string, children?: ChildrenObj });
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
        if (tag !== undefined && children !== undefined)
            throw new BadArgumentsAmountError(1, {
                tag,
                children
            }, '"children" and "tag" options are mutually exclusive, because tag implies creating a new element and children implies getting an existing one.');
        
        if (tag !== undefined) {
            if (['svg', 'path'].includes(tag.toLowerCase())) {
                this._isSvg = true;
                this._htmlElement = document.createElementNS(SVG_NS_URI, tag);
            } else {
                this._htmlElement = document.createElement(tag);
            }
        } else if (id !== undefined)
            this._htmlElement = document.getElementById(id);
        else if (query !== undefined)
            this._htmlElement = document.querySelector(query);
        else if (htmlElement !== undefined)
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
    wrapSomethingElse(newHtmlElement: Node): this
    wrapSomethingElse(newHtmlElement) {
        this._cachedChildren = {};
        if (newHtmlElement instanceof BetterHTMLElement) {
            this._htmlElement.replaceWith(newHtmlElement.e);
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
            this._htmlElement.replaceWith(newHtmlElement);
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
    
    /**For each `{<styleAttr>: <styleVal>}` pair, set the `style[styleAttr]` to `styleVal`.*/
    css(css: Partial<CssOptions>): this
    /**Get `style[css]`*/
    css(css: string): string
    css(css) {
        if (typeof css === 'string') {
            return this.e.style[css];
        } else {
            for (let [styleAttr, styleVal] of enumerate(css))
                this.e.style[<string>styleAttr] = styleVal;
            return this;
        }
    }
    
    /**Remove the value of the passed style properties*/
    uncss(...removeProps: (keyof CssOptions)[]): this {
        let css = {};
        for (let prop of removeProps)
            css[prop] = '';
        return this.css(css);
    }
    
    
    // ***  Classes
    /**`.className = cls`*/
    class(cls: string): this;
    /**Return the first class that matches `cls` predicate.*/
    class(cls: TReturnBoolean): string;
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
                // noinspection JSConstantReassignment
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
    
    removeClass(cls: TReturnBoolean, ...clses: TReturnBoolean[]): this;
    removeClass(cls: string, clses?: string[]): this;
    removeClass(cls, ...clses) {
        if (isFunction(cls)) {
            this.e.classList.remove(this.class(cls));
            for (let c of <TReturnBoolean[]>clses)
                this.e.classList.remove(this.class(c));
        } else {
            this.e.classList.remove(cls);
            for (let c of clses)
                this.e.classList.remove(c);
        }
        return this;
    }
    
    replaceClass(oldToken: TReturnBoolean, newToken: string): this;
    replaceClass(oldToken: string, newToken: string): this
    replaceClass(oldToken, newToken) {
        if (isFunction(oldToken)) {
            this.e.classList.replace(this.class(oldToken), newToken);
        } else {
            this.e.classList.replace(oldToken, newToken);
        }
        return this;
    }
    
    toggleClass(cls: TReturnBoolean, force?: boolean): this
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
    hasClass(cls: TReturnBoolean): boolean
    hasClass(cls) {
        if (isFunction(cls)) {
            return this.class(cls) !== undefined;
        } else {
            return this.e.classList.contains(cls);
        }
    }
    
    // ***  Nodes
    /**Insert at least one `node` just after `this`. Any `node` can be either `BetterHTMLElement`s or vanilla `Node`.*/
    after(...nodes: Array<BetterHTMLElement | Node>): this {
        for (let node of nodes) {
            if (node instanceof BetterHTMLElement)
                this.e.after(node.e);
            else
                this.e.after(node);
        }
        return this;
    }
    
    /**Insert `this` just after a `BetterHTMLElement` or a vanilla `Node`.*/
    insertAfter(node: BetterHTMLElement | HTMLElement): this {
        if (node instanceof BetterHTMLElement)
            node.e.after(this.e);
        else
            node.after(this.e);
        return this;
    }
    
    /**Insert at least one `node` after the last child of `this`.
     * Any `node` can be either a `BetterHTMLElement`, a vanilla `Node`,
     * a `{someKey: BetterHTMLElement}` pairs object, or a `[someKey, BetterHTMLElement]` tuple.*/
    append(...nodes: Array<BetterHTMLElement | Node | TMap<BetterHTMLElement> | [string, BetterHTMLElement]>): this {
        for (let node of nodes) {
            if (node instanceof BetterHTMLElement)
                this.e.append(node.e);
            else if (node instanceof Node)
                this.e.append(node);
            else if (Array.isArray(node))
                this.cacheAppend([node]);
            else
                this.cacheAppend(node)
        }
        return this;
        
    }
    
    /**Append `this` to a `BetterHTMLElement` or a vanilla `Node`*/
    appendTo(node: BetterHTMLElement | HTMLElement): this {
        if (node instanceof BetterHTMLElement)
            node.e.append(this.e);
        else
            node.append(this.e);
        
        return this;
    }
    
    /**Insert at least one `node` just before `this`. Any `node` can be either `BetterHTMLElement`s or vanilla `Node`.*/
    before(...nodes: Array<BetterHTMLElement | Node>): this {
        for (let node of nodes) {
            if (node instanceof BetterHTMLElement)
                this.e.before(node.e);
            else
                this.e.before(node);
        }
        return this;
    }
    
    /**Insert `this` just before a `BetterHTMLElement` or a vanilla `Node`s.*/
    insertBefore(node: BetterHTMLElement | HTMLElement): this {
        if (node instanceof BetterHTMLElement)
            node.e.before(this.e);
        else
            node.before(this.e);
        return this;
    }
    
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
        while (this.e.firstChild)
            this.e.removeChild(this.e.firstChild);
        return this;
    }
    
    /**Remove element from DOM*/
    remove(): this {
        this.e.remove();
        return this;
    }
    
    
    // ***  Events
    
    on(evTypeFnPairs: TEventFunctionMap<TEvent>, options?: AddEventListenerOptions): this {
        for (let [evType, evFn] of enumerate(evTypeFnPairs)) {
            const _f = function _f(evt) {
                evFn(evt);
            };
            this.e.addEventListener(evType, _f, options);
            this._listeners[evType] = _f;
        }
        return this;
    }
    
    
    /*
    Chronology:
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
    
    
    /**Add a `keydown` event listener*/
    keydown(fn: (event: KeyboardEvent) => any, options?: AddEventListenerOptions): this {
        return this.on({keydown: fn}, options)
    }
    
    
    /**Add a `mouseout` event listener*/
    mouseout(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this {
        //mouseleave and mouseout are similar but differ in that mouseleave does not bubble and mouseout does.
        // This means that mouseleave is fired when the pointer has exited the element and all of its descendants,
        // whereas mouseout is fired when the pointer leaves the element or leaves one of the element's descendants
        // (even if the pointer is still within the element).
        return this.on({mouseout: fn}, options)
    }
    
    
    /**Add a `mouseover` event listener*/
    mouseover(fn: (event: MouseEvent) => any, options?: AddEventListenerOptions): this {
        // mouseover: also child elements
        // mouseenter: only bound element
        return this.on({mouseover: fn}, options)
    }
    
    
    /** Remove the event listener of `event`, if exists.*/
    off(event: TEvent): this {
        // TODO: Should remove listener from this._listeners?
        this.e.removeEventListener(event, this._listeners[event]);
        return this;
    }
    
    /** Remove all event listeners in `_listeners`*/
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
        if (parse === true)
            return JSON.parse(data);
        else
            return data
    }
    
    
}

class Div extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLDivElement;
    readonly e: HTMLDivElement;
    
    /**Create a Div element. Optionally set its id, text or cls.*/
    constructor({id, text, cls}: SubElemConstructor = {}) {
        super({tag: 'div', text, cls});
        if (id !== undefined)
            this.id(id);
    }
}

class Paragraph extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLParagraphElement;
    readonly e: HTMLParagraphElement;
    
    /**Create a Paragraph element. Optionally set its id, text or cls.*/
    constructor({id, text, cls}: SubElemConstructor = {}) {
        super({tag: 'p', text, cls});
        if (id !== undefined)
            this.id(id);
    }
}

class Span extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLSpanElement;
    readonly e: HTMLSpanElement;
    
    /**Create a Span element. Optionally set its id, text or cls.*/
    constructor({id, text, cls}: SubElemConstructor = {}) {
        super({tag: 'span', text, cls});
        if (id !== undefined)
            this.id(id);
        
    }
}

class Img extends BetterHTMLElement {
    protected readonly _htmlElement: HTMLImageElement;
    
    /**Create an Img element. Optionally set its id, src or cls.*/
    constructor({id, src, cls}: ImgConstructor) {
        super({tag: 'img', cls});
        if (id !== undefined)
            this.id(id);
        if (src !== undefined)
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
        if (id !== undefined)
            this.id(id);
        if (href !== undefined)
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


customElements.define('better-html-element', BetterHTMLElement);
customElements.define('better-div', Div, {extends: 'div'});
customElements.define('better-p', Paragraph, {extends: 'p'});
customElements.define('better-span', Span, {extends: 'span'});
customElements.define('better-img', Img, {extends: 'img'});
customElements.define('better-a', Anchor, {extends: 'a'});

// customElements.define('better-svg', Svg, {extends: 'svg'});

/**Create an element of `tag`. Optionally, set its `text` and / or `cls`*/
function elem({tag, text, cls}: { tag: QuerySelector, text?: string, cls?: string }): BetterHTMLElement;
/**Get an existing element by `id`. Optionally, set its `text`, `cls` or cache `children`*/
function elem({id, text, cls, children}: { id: string, text?: string, cls?: string, children?: ChildrenObj }): BetterHTMLElement;
/**Get an existing element by `query`. Optionally, set its `text`, `cls` or cache `children`*/
function elem({query, text, cls, children}: { query: QuerySelector, text?: string, cls?: string, children?: ChildrenObj }): BetterHTMLElement;
/**Wrap an existing HTMLElement. Optionally, set its `text`, `cls` or cache `children`*/
function elem({htmlElement, text, cls, children}: { htmlElement: HTMLElement, text?: string, cls?: string, children?: ChildrenObj }): BetterHTMLElement;
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


