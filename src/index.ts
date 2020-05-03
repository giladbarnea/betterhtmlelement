const SVG_NS_URI = 'http://www.w3.org/2000/svg';


class BetterHTMLElement<T extends HTMLElement = HTMLElement> {
    protected _htmlElement: T;
    private readonly _isSvg: boolean = false;
    private readonly _listeners: TEventFunctionMap<TEvent> = {};
    private _cachedChildren: TMap<BetterHTMLElement> = {};

    /**Create an element of `tag`. Optionally, set its `text`, `cls` or `id`. */
    constructor({tag, cls, setid}: NewBHEConstructor<T>);
    /**Wrap an existing element by `byid`. Optionally cache existing `children`*/
    constructor({byid, children}: ByIdBHEConstructor);
    /**Wrap an existing element by `query`. Optionally cache existing `children`*/
    constructor({query, children}: QueryBHEConstructor<T>);
    /**Wrap an existing HTMLElement. Optionally cache existing `children`*/
    constructor({htmlElement, children}: ByHtmlElementBHEConstructor<T>);
    constructor(elemOptions) {
        const {
            tag, cls, setid, // create
            htmlElement, byid, query, children // wrap existing
        } = elemOptions;

        // *** Argument Errors
        // ** wrapping args: only one
        if ([byid, htmlElement, query].filter(x => Boolean(x)).length > 1) {
            throw new MutuallyExclusiveArgs({
                byid, query, htmlElement
            }, `Choose only one way to get an existing element; by its id, query, or actual element`)
        }
        // ** creating new elem args: both creators and wrappers
        // * if creating new with `tag`, no meaning to either children, byid, htmlElement, or query
        if (tag !== undefined && anyValue([children, byid, htmlElement, query])) {
            throw new MutuallyExclusiveArgs({
                tag,
                byid,
                htmlElement,
                query
            }, `Either create a new elem via "tag", or get an existing one via either "byid", "htmlElement", or "query" (and maybe cache its "children")`)
        }
        if (anyValue([tag, cls, setid]) && anyValue([children, byid, htmlElement, query])) {
            throw new MutuallyExclusiveArgs({
                group1: {cls, setid},
                group2: {children, byid, htmlElement, query}
            }, `Can't have args from both groups`)
        }
        if (noValue([tag, cls, setid]) && noValue([children, byid, htmlElement, query])) {
            throw new NotEnoughArgs([1], {
                group1: {cls, setid},
                group2: {children, byid, htmlElement, query}
            }, `Expecting at least one arg from a given group`)
        }

        // ** tag (CREATE element)
        if (tag !== undefined) {
            if (['svg', 'path'].includes(tag.toLowerCase())) {
                this._isSvg = true;
                this._htmlElement = document.createElementNS(SVG_NS_URI, tag);
            } else {
                this._htmlElement = document.createElement(tag) as T;
            }
            // ** wrap EXISTING element
            // * byid
        } else if (byid !== undefined) {
            this._htmlElement = document.getElementById(byid) as T;
        } else {
            // * query
            if (query !== undefined) {
                this._htmlElement = document.querySelector(query) as T;
            } else {
                // * htmlElement
                if (htmlElement !== undefined) {
                    this._htmlElement = htmlElement;
                }
            }
        }

        if (cls !== undefined) {
            this.class(cls);
        }
        if (children !== undefined) {
            this.cacheChildren(children);
        }
        if (setid !== undefined) {
            this.id(setid);
        }


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
            for (let [styleAttr, styleVal] of enumerate(css)) {
                this.e.style[<string>styleAttr] = styleVal;
            }
            return this;
        }
    }

    /**Remove the value of the passed style properties*/
    uncss(...removeProps: (keyof CssOptions)[]): this {
        let css = {};
        for (let prop of removeProps) {
            css[prop] = '';
        }
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
        for (let c of clses) {
            this.e.classList.add(c);
        }
        return this;
    }

    removeClass(cls: TReturnBoolean, ...clses: TReturnBoolean[]): this;
    removeClass(cls: string, clses?: string[]): this;
    removeClass(cls, ...clses) {
        if (isFunction(cls)) {
            this.e.classList.remove(this.class(cls));
            for (let c of <TReturnBoolean[]>clses) {
                this.e.classList.remove(this.class(c));
            }
        } else {
            this.e.classList.remove(cls);
            for (let c of clses) {
                this.e.classList.remove(c);
            }
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
        if (isFunction(cls)) {
            this.e.classList.toggle(this.class(cls), force);
        } else {
            this.e.classList.toggle(cls, force);
        }
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
            if (node instanceof BetterHTMLElement) {
                this.e.after(node.e);
            } else {
                this.e.after(node);
            }
        }
        return this;
    }

    /**Insert `this` just after a `BetterHTMLElement` or a vanilla `Node`.*/
    insertAfter(node: BetterHTMLElement | HTMLElement): this {
        if (node instanceof BetterHTMLElement) {
            node.e.after(this.e);
        } else {
            node.after(this.e);
        }
        return this;
    }

    /**Insert at least one `node` after the last child of `this`.
     * Any `node` can be either a `BetterHTMLElement`, a vanilla `Node`,
     * a `{someKey: BetterHTMLElement}` pairs object, or a `[someKey, BetterHTMLElement]` tuple.*/
    append(...nodes: Array<BetterHTMLElement | Node | TMap<BetterHTMLElement> | [string, BetterHTMLElement]>): this {
        for (let node of nodes) {
            if (node instanceof BetterHTMLElement) {
                this.e.append(node.e);
            } else {
                if (node instanceof Node) {
                    this.e.append(node);
                } else {
                    if (Array.isArray(node)) {
                        this.cacheAppend([node]);
                    } else {
                        this.cacheAppend(node)
                    }
                }
            }
        }
        return this;

    }

    /**Append `this` to a `BetterHTMLElement` or a vanilla `Node`*/
    appendTo(node: BetterHTMLElement | HTMLElement): this {
        if (node instanceof BetterHTMLElement) {
            node.e.append(this.e);
        } else {
            node.append(this.e);
        }

        return this;
    }

    /**Insert at least one `node` just before `this`. Any `node` can be either `BetterHTMLElement`s or vanilla `Node`.*/
    before(...nodes: Array<BetterHTMLElement | Node>): this {
        for (let node of nodes) {
            if (node instanceof BetterHTMLElement) {
                this.e.before(node.e);
            } else {
                this.e.before(node);
            }
        }
        return this;
    }

    /**Insert `this` just before a `BetterHTMLElement` or a vanilla `Node`s.*/
    insertBefore(node: BetterHTMLElement | HTMLElement): this {
        if (node instanceof BetterHTMLElement) {
            node.e.before(this.e);
        } else {
            node.before(this.e);
        }
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
            for (let [key, child] of keyChildPairs) {
                _cacheAppend(key, child);
            }
        } else {
            for (let [key, child] of enumerate(keyChildPairs)) {
                _cacheAppend(key, child);
            }
        }
        return this;
    }

    /**Get a child with `querySelector` and return a `BetterHTMLElement` of it*/
    child<K extends Tag, T extends HTMLElementTagNameMap[K]>(selector: K): BetterHTMLElement<T>;
    child(selector: string): BetterHTMLElement
    child(selector) {
        const htmlElement = this.e.querySelector(selector);
        const tag = htmlElement.tagName.toLowerCase() as Tag;
        const bhe = wrapWithBHE(tag, htmlElement);
        return bhe;
    }


    /**Return a `BetterHTMLElement` list of all children */
    children(): BetterHTMLElement[];
    /**Return a `BetterHTMLElement` list of all children selected by `selector` */
    children<K extends Tag>(selector: K): BetterHTMLElement[];
    /**Return a `BetterHTMLElement` list of all children selected by `selector` */
    children(selector: string | Tag): BetterHTMLElement[];
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

    /**For each `[key, selector]` pair, where `selector` is either an `Tag` or a `string`, get `this.child(selector)`, and store it in `this[key]`.
     * @example
     * // Using `cacheChildren` directly
     * const navbar = elem({ id: 'navbar' });
     * navbar.cacheChildren({ home: '.navbar-item-home', about: '.navbar-item-about' });
     * navbar.home.toggleClass("selected");
     * navbar.about.css(...);
     * @example
     * // Using `cacheChildren` indirectly through `children` constructor option
     * const navbar = elem({ id: 'navbar', children: { home: '.navbar-item-home', about: '.navbar-item-about' }});
     * navbar.home.toggleClass("selected");
     * navbar.about.css(...);
     * @see this.child*/
    cacheChildren(queryMap: TMap<QuerySelector>): this
    /**For each `[key, selector]` pair, where `selector` is a recursive `{subselector: keySelectorObj}` object,
     * extract `this.child(subselector)`, store it in `this[key]`, then call `this[key].cacheChildren` passing the recursive object.
     * @example
     * // Using `cacheChildren` directly
     * const navbar = elem({ id: 'navbar' });
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
     * const navbar = elem({query: '#navbar', children: {
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
    cacheChildren(recursiveQueryMap: TRecMap<QuerySelector>): this
    cacheChildren(bheMap: TMap<BetterHTMLElement>): this
    /**For each `[key, selector]` pair, where `selector` is a `BetterHTMLElement`, store it in `this[key]`.
     * @example
     * // Using `cacheChildren` directly
     * const home = elem({ query: '.navbar-item-home' });
     * const navbar = elem({ id: 'navbar' });
     * navbar.cacheChildren({ home });
     * navbar.home.toggleClass("selected");
     * @example
     * // Using `cacheChildren` indirectly through `children` constructor option
     * const home = elem({ query: '.navbar-item-home' });
     * const navbar = elem({id: 'navbar', children: { home }});
     * navbar.home.toggleClass("selected");
     * @see this.child*/

    cacheChildren(recursiveBHEMap: TRecMap<BetterHTMLElement>): this
    /**key: string. value: either "selector string" OR {"selector string": <recurse down>}*/
    cacheChildren(map) {
        for (let [key, value] of enumerate(map)) {
            let type = typeof value;
            if (isObject(value)) {
                if (value instanceof BetterHTMLElement) {
                    this._cache(key, value)
                } else {
                    // let entries = Object.entries(<TMap<QuerySelector> | TRecMap<QuerySelector>>value);
                    let entries = Object.entries(value);
                    if (entries[1] !== undefined) {
                        console.warn(
                            `cacheChildren() received recursive obj with more than 1 selector for a key. Using only 0th selector`, {
                                key,
                                "multiple selectors": entries.map(e => e[0]),
                                value,
                                this: this
                            }
                        );
                    }
                    // only first because 1:1 for key:selector.
                    // (ie can't do {right: {.right: {...}, .right2: {...}})
                    let [selector, obj] = entries[0];
                    this._cache(key, this.child(selector));
                    this[key].cacheChildren(obj)
                }
            } else if (type === "string") {
                this._cache(key, this.child(value));
            } else {
                console.warn(`cacheChildren, bad value type: "${type}". key: "${key}", value: "${value}". map:`, map,);
            }
        }
        return this;

    }

    /**Remove all children from DOM*/
    empty(): this {
        while (this.e.firstChild) {
            this.e.removeChild(this.e.firstChild);
        }
        return this;
    }

    /**Remove element from DOM*/
    remove(): this {
        this.e.remove();
        return this;
    }


    // *** Events

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
            {
                this.removeEventListener('touchstart', _f);
            }
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
            {
                this.removeEventListener(action, _f);
            }
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

    // *** Attributes

    /** For each `[attr, val]` pair, apply `setAttribute`*/
    attr(attrValPairs: TMap<string | boolean>): this
    /** apply `getAttribute`*/
    attr(attributeName: string): string
    attr(attrValPairs) {
        if (typeof attrValPairs === 'string') {
            return this.e.getAttribute(attrValPairs);
        } else {
            for (let [attr, val] of enumerate(attrValPairs)) {
                this.e.setAttribute(attr, val);
            }
            return this;
        }
    }

    /** `removeAttribute` */
    removeAttr(qualifiedName: string, ...qualifiedNames: string[]): this {
        let _removeAttribute;
        if (this._isSvg) {
            _removeAttribute = (qualifiedName) => this.e.removeAttributeNS(SVG_NS_URI, qualifiedName);
        } else {
            _removeAttribute = (qualifiedName) => this.e.removeAttribute(qualifiedName);
        }

        _removeAttribute(qualifiedName);
        for (let qn of qualifiedNames) {
            _removeAttribute(qn);
        }
        return this;
    }

    /**`getAttribute(`data-${key}`)`. JSON.parse it by default.*/
    data(key: string, parse: boolean = true): string | TMap<string> {
        // TODO: jquery doesn't affect data-* attrs in DOM. https://api.jquery.com/data/
        const data = this.e.getAttribute(`data-${key}`);
        if (parse === true) {
            return JSON.parse(data);
        } else {
            return data
        }
    }


}

class Div extends BetterHTMLElement<HTMLDivElement> {

    /**Create a new Div element, or wrap an existing one by passing htmlElement. Optionally set its id, text or cls.*/
    constructor({setid, cls, byid, text, query, htmlElement, children}: DivConstructor) {
        if (noValue(arguments[0])) {
            throw new NotEnoughArgs([1], arguments[0])
        }
        if (htmlElement !== undefined) {
            super({htmlElement, children});
        } else if (byid !== undefined) {
            super({byid, children});
        } else if (query !== undefined) {
            super({query, children});
        } else {
            super({tag: "div", cls, setid})
        }
        if (text !== undefined) {
            this.text(text);
        }
    }
}


class Button extends BetterHTMLElement<HTMLButtonElement> {


    /**Create a new Button element, or wrap an existing one by passing htmlElement. Optionally set its id, text or cls.*/
    constructor({setid, cls, text, byid, query, htmlElement, children}: SubElemConstructor<HTMLButtonElement>) {
        if (noValue(arguments[0])) {
            throw new NotEnoughArgs([1], arguments[0])
        }
        if (htmlElement !== undefined) {
            super({htmlElement, children});
        } else if (byid !== undefined) {
            super({byid, children});
        } else if (query !== undefined) {
            super({query, children});
        } else {
            super({tag: "button", setid, cls})
        }
        if (text !== undefined) {
            this.text(text);
        }
    }
}


class Paragraph extends BetterHTMLElement<HTMLParagraphElement> {

    /**Create a new Paragraph element, or wrap an existing one by passing htmlElement. Optionally set its id, text or cls.*/
    constructor({setid, cls, text, byid, query, htmlElement, children}: SubElemConstructor<HTMLParagraphElement>) {
        if (noValue(arguments[0])) {
            throw new NotEnoughArgs([1], arguments[0])
        }
        if (htmlElement !== undefined) {
            super({htmlElement, children});
        } else if (byid !== undefined) {
            super({byid, children});
        } else if (query !== undefined) {
            super({query, children});
        } else {
            super({tag: "p", setid, cls})
        }
        if (text !== undefined) {
            this.text(text);
        }
    }
}

class Input extends BetterHTMLElement<HTMLInputElement> {
    constructor({setid, cls, type, placeholder, byid, query, htmlElement, children}: InputConstructor) {
        if (noValue(arguments[0])) {
            throw new NotEnoughArgs([1], arguments[0])
        }

        if (htmlElement !== undefined) {
            super({htmlElement, children});
        } else if (byid !== undefined) {
            super({byid, children});
        } else if (query !== undefined) {
            super({query, children});
        } else {
            super({tag: "input", cls, setid})
        }

        if (type !== undefined) {
            this._htmlElement.type = type;
        }
        if (placeholder !== undefined) {
            if (type) {
                if (type === "number" && typeof placeholder !== "number") {
                    console.warn(`placeholder type is ${typeof placeholder} but input type is number. ignoring`)
                } else if (type !== "text") {
                    console.warn(`placeholder type is ${typeof placeholder} but input type not number nor text. ignoring`)
                } else {
                    this.placeholder(placeholder);
                }
            }
        }
    }

    check(): this {
        this.e.checked = true;
        return this;
    }

    uncheck(): this {
        this.e.checked = false;
        return this;
    }

    toggleChecked(on: boolean): this {
        if (on) {
            return this.check()
        } else {
            return this.uncheck()
        }
    }

    get checked(): boolean {
        return this.e.checked;
    }

    disable(): this {
        this.e.disabled = true;
        return this;
    }

    enable(): this {
        this.e.disabled = false;
        return this;
    }

    toggleEnabled(on: boolean): this {
        if (on) {
            return this.enable()
        } else {
            return this.disable()
        }
    }

    get disabled(): boolean {
        return this.e.disabled;
    }

    /**Returns `value`*/
    value(): string;
    /**`value(null)` or `value('')` → reset. */
    value(val: any): this;
    value(val?) {
        if (val === undefined) {
            return this.e.value;
        } else {
            this.e.value = val;
            return this;
        }
    }

    placeholder(val: string): this;
    placeholder(): string;
    placeholder(val?) {
        if (val === undefined) {
            return this.e.placeholder;
        } else {
            this.e.placeholder = val;
            return this;
        }

    }


}

class Span extends BetterHTMLElement<HTMLSpanElement> {

    /**Create a new Span element, or wrap an existing one by passing htmlElement. Optionally set its id, text or cls.*/
    constructor({setid, cls, text, byid, query, htmlElement, children}: SubElemConstructor<HTMLSpanElement>) {
        if (noValue(arguments[0])) {
            throw new NotEnoughArgs([1], arguments[0])
        }
        if (htmlElement !== undefined) {
            super({htmlElement, children});
        } else if (byid !== undefined) {
            super({byid, children});
        } else if (query !== undefined) {
            super({query, children});
        } else {
            super({tag: "span", setid, cls})
        }
        if (text !== undefined) {
            this.text(text);
        }

    }
}

class Img extends BetterHTMLElement<HTMLImageElement> {

    /**Create a new Img element, or wrap an existing one by passing htmlElement. Optionally set its id, src or cls.*/
    constructor({setid, cls, src, byid, query, htmlElement, children}: ImgConstructor) {
        if (noValue(arguments[0])) {
            throw new NotEnoughArgs([1], arguments[0])
        }
        if (htmlElement !== undefined) {
            super({htmlElement, children});
        } else if (byid !== undefined) {
            super({byid, children});
        } else if (query !== undefined) {
            super({query, children});
        } else {
            super({tag: "img", setid, cls})
        }
        if (src !== undefined) {
            this.src(src);
        }

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

class Anchor extends BetterHTMLElement<HTMLAnchorElement> {


    /**Create a new Input element, or wrap an existing one by passing htmlElement. Optionally set its id, text, href or cls.*/
    constructor({setid, cls, text, href, target, byid, query, htmlElement, children}: AnchorConstructor) {
        if (noValue(arguments[0])) {
            throw new NotEnoughArgs([1], arguments[0])
        }
        if (htmlElement !== undefined) {
            super({htmlElement, children});
        } else if (byid !== undefined) {
            super({byid, children});
        } else if (query !== undefined) {
            super({query, children});
        } else {
            super({tag: "a", setid, cls})
        }
        if (text !== undefined) {
            this.text(text);
        }
        if (href !== undefined) {
            this.href(href);
        }
        if (target !== undefined) {
            this.target(target);
        }

    }

    href(): string
    href(val: string): this
    href(val?) {
        if (val === undefined) {
            return this.attr('href');
        } else {
            return this.attr({href: val})
        }
    }

    target(): string
    target(val: string): this
    target(val?) {
        if (val === undefined) {
            return this.attr('target');
        } else {
            return this.attr({target: val})
        }
    }
}


/*customElements.define('better-html-element', BetterHTMLElement);
customElements.define('better-div', Div, {extends: 'div'});
customElements.define('better-input', Input, {extends: 'input'});
customElements.define('better-p', Paragraph, {extends: 'p'});
customElements.define('better-span', Span, {extends: 'span'});
customElements.define('better-img', Img, {extends: 'img'});
customElements.define('better-a', Anchor, {extends: 'a'});*/

// customElements.define('better-svg', Svg, {extends: 'svg'});

/**Create an element of `create`. Optionally, set its `text` and / or `cls`*/
function elem<T extends Tag>({tag, cls, setid}: { tag: T, cls?: string, setid?: string }): BetterHTMLElement<Tag2Element<T>>;
/**Get an existing element by `id`. Optionally, set its `text`, `cls` or cache `children`*/
function elem({byid, children}: { byid: string, children?: ChildrenObj }): BetterHTMLElement;
/**Get an existing element by `query`. Optionally, set its `text`, `cls` or cache `children`*/
function elem<Q extends QuerySelector>({query, children}: { query: Q, children?: ChildrenObj }): Q extends Tag ? BetterHTMLElement<Tag2Element<Q>> : BetterHTMLElement;
/**Wrap an existing HTMLElement. Optionally, set its `text`, `cls` or cache `children`*/
function elem<E extends HTMLElement>({htmlElement, children}: { htmlElement: E; children?: ChildrenObj }): BetterHTMLElement<E>;
function elem(elemOptions) {
    return new BetterHTMLElement(elemOptions);
}

/**Create an Span element, or wrap an existing one by passing htmlElement. Optionally set its id, text or cls.*/
function span({setid, cls, text, byid, query, htmlElement, children}: SubElemConstructor<HTMLSpanElement> = {}): Span {
    return new Span({setid, cls, text, byid, query, htmlElement, children});
}

/**Create a Div element, or wrap an existing one by passing htmlElement. Optionally set its id, text or cls.*/
function div({setid, cls, text, byid, query, htmlElement, children}: DivConstructor = {}): Div {
    return new Div({setid, cls, text, byid, query, htmlElement, children});
}

/**Create a Button element, or wrap an existing one by passing htmlElement. Optionally set its id, text or cls.*/
function button({setid, cls, text, byid, query, htmlElement, children}: SubElemConstructor<HTMLButtonElement> = {}): Button {
    return new Button({setid, cls, text, byid, query, htmlElement, children});
}


function input({setid, cls, type, placeholder, byid, query, htmlElement, children}: InputConstructor = {}): Input {
    return new Input({setid, cls, type, placeholder, byid, query, htmlElement, children})
}

// getInput("a");
// getInput(document.createElement("div"));

/**Create an Img element, or wrap an existing one by passing htmlElement. Optionally set its id, src or cls.*/
function img({setid, cls, src, byid, query, htmlElement, children}: ImgConstructor = {}): Img {
    return new Img({setid, cls, src, byid, query, htmlElement, children});
}


/**Create a Paragraph element, or wrap an existing one by passing htmlElement. Optionally set its id, text or cls.*/
function paragraph({setid, cls, text, byid, query, htmlElement, children}: SubElemConstructor<HTMLParagraphElement> = {}): Paragraph {
    return new Paragraph({setid, cls, text, byid, query, htmlElement, children});
}

/**Create a new Anchor element, or wrap an existing one by passing htmlElement. Optionally set its id, text, href or cls.*/
function anchor({setid, cls, text, href, target, byid, query, htmlElement, children}: AnchorConstructor = {}): Anchor {
    return new Anchor({setid, cls, text, href, target, byid, query, htmlElement, children});
}

/*// ** get EXISTING vanilla HTMLElement: by id, query or htmlElement
function getHtmlElement<K extends (Tag | string)>(query: K): Tag2Element<K>;
function getHtmlElement<T extends HTMLElement>(htmlElement: T): T;
function getHtmlElement(idOrQueryOrHtmlElement) {
    if (idOrQueryOrHtmlElement instanceof HTMLElement) {
        return idOrQueryOrHtmlElement;
    }
    return document.querySelector(idOrQueryOrHtmlElement);
}

// ** create NEW vanilla HTMLElement: by tag
function newHtmlElement<K extends Tag>(tag: K) {
    if (tag === undefined) {
        throw new NotEnoughArgs(1, {tag})
    }
    if (['svg', 'path'].includes(tag.toLowerCase())) {
        throw new Error("Not impl");
        // this._isSvg = true;
        // this._htmlElement = document.createElementNS(SVG_NS_URI, tag);
    } else {
        return document.createElement(tag);
    }
}

// getHtmlElement("diva");
// getHtmlElement(document.createElement("div"));
// getHtmlElement(5);
// getHtmlElement("div");
// newHtmlElement("div");
*/

const query_input = elem({query: 'input'});
const tag_input = elem({tag: 'input'});


const askjhf: Tag2Element<'input'> = undefined;

const shdjgjkhdskj: BetterHTMLElement<Tag2Element<"input">> = undefined;

const ashdjgjkhdskj: BetterHTMLElement<HTMLInputElement> = undefined;

const ashdjgjkhdsskj: Input = undefined;


function wrapWithBHE<K extends Tag, T extends Tag2Element<K>>(tag: K, htmlElement: T): BetterHTMLElement<T> {
// function wrapWithBHE<K extends BHETag>(tag: K, htmlElement: BHETag2HTMLElement<K>): Tag2BHE<K> {
// function wrapWithBHE<K extends BHETag, T extends Tag2Element<K>>(tag: K, htmlElement: T): BetterHTMLElement<T> {

    switch (tag) {
        case 'div':
            let e = div({htmlElement: htmlElement});
            return e;
        case 'a':
            return anchor({htmlElement});
        case 'p':
            return paragraph({htmlElement});
        case 'img':
            return img({htmlElement});
        case 'input':
            return input({htmlElement});
        case 'button':
            return button({htmlElement});
        case 'span':
            return span({htmlElement});
        default:
            return elem({htmlElement});
    }
}