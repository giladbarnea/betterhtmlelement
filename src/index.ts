const SVG_NS_URI = 'http://www.w3.org/2000/svg';
const TAG_RE = /<(\w+)>$/.compile();

class BetterHTMLElement<T extends HTMLElement = HTMLElement> {
    protected _htmlElement: T;
    private readonly _isSvg: boolean = false;
    private readonly _listeners: TEventFunctionMap<TEvent> = {};
    private _cachedChildren: TMap<BetterHTMLElement> = {};

    /**Create an element of `tag`. Optionally, set its `text`, `cls` or `id`. */
    constructor({tag, cls, setid}: { tag: Element2Tag<T>, cls?: string, setid?: string });
    /**Wrap an existing element by `byid`. Optionally cache existing `children`*/
    constructor({byid, children}: { byid: string, children?: ChildrenObj });
    /**Wrap an existing element by `query`. Optionally cache existing `children`*/
    constructor({query, children}: { query: QuerySelector, children?: ChildrenObj });
    /**Wrap an existing HTMLElement. Optionally cache existing `children`*/
    constructor({htmlElement, children}: { htmlElement: T; children?: ChildrenObj });
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

    private _cache(key: string, child: BetterHTMLElement<any>) {
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


    child(selector: "img"): Img;
    child(selector: "a"): Anchor;
    child(selector: "input"): Input;
    child(selector: "p"): Paragraph;
    child(selector: "span"): Span;
    child(selector: "button"): Button;
    child(selector: "div"): Div;
    child<T extends Tag>(selector: T): BetterHTMLElement<HTMLElementTagNameMap[T]>;
    child(selector: string): BetterHTMLElement;
    child(selector) {
        const htmlElement = this.e.querySelector(selector) as HTMLElement;
        if (htmlElement === null) {
            console.warn(`${this.e}.child(${selector}): no child. returning undefined`);
            return undefined;
        }
        const bhe = wrapWithBHE(htmlElement);
        return bhe;
    }


    /**Return a `BetterHTMLElement` list of all children */
    children(): BetterHTMLElement[];
    /**Return a `BetterHTMLElement` list of all children selected by `selector` */
    children<K extends Tag>(selector: K): BetterHTMLElement[];
    /**Return a `BetterHTMLElement` list of all children selected by `selector` */
    children(selector: QuerySelector): BetterHTMLElement[];
    children(selector?) {
        let childrenVanilla;
        let childrenCollection;
        if (selector === undefined) {
            childrenCollection = this.e.children;
        } else {
            childrenCollection = this.e.querySelectorAll(selector);
        }

        childrenVanilla = Array.from(childrenCollection);

        return childrenVanilla.map(wrapWithBHE);
    }

    clone(deep?: boolean): BetterHTMLElement {
        console.warn(`${this}.clone() doesnt return a matching BHE subtype, but a regular BHE`);
        // TODO: return new this()?
        return new BetterHTMLElement({htmlElement: this.e.cloneNode(deep) as HTMLElement});
    }

    /**
     * Stores child BHE's in `this` so they can be accessed e.g. `navbar.home.class('selected')`.
     * @example
     * navbar.cacheChildren({ 'home': 'button.home' })
     * // or
     * maindiv.cacheChildren({ 'welcome': paragraph({ 'query': 'p.welcome' }) })
     * // `childrenObj` can be recursive and mixed, e.g.
     * navbar.cacheChildren({
     *      home: {
     *          'li.navbar-item-home': {
     *              thumbnail: 'img.home-thumbnail',
     *              expand: button({ byid: 'home_expand' })
     *          }
     *      }
     *  });
     * navbar.home.class("selected");
     * navbar.home.thumbnail.css(...);
     * navbar.home.expand.click( e => {...} )
     * @see this.child*/
    cacheChildren(childrenObj: ChildrenObj): this {
        for (let [key, value] of enumerate(childrenObj)) {
            let type = typeof value;
            if (isObject(value)) {
                if (value instanceof BetterHTMLElement) {
                    // { "myimg": img(...) }
                    this._cache(key, value)
                } else {
                    // { "mydiv": { "myimg": img(...), "myinput": input(...) } }
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
                    let [selector, obj] = entries[0];
                    this._cache(key, this.child(selector));
                    this[key].cacheChildren(obj)
                }
            } else if (type === "string") {
                let tagName = TAG_RE.exec(value as string)[1] as Tag;
                if (tagName) {
                    // { "options": "<option>" }
                    // @ts-ignore
                    const htmlElements = [...this.e.getElementsByTagName(tagName)] as Array<HTMLElementTagNameMap[typeof tagName]>;
                    let bhes = [];
                    for (let htmlElement of htmlElements) {
                        bhes.push(wrapWithBHE(htmlElement));
                    }
                    this._cache(key, bhes);
                } else {
                    // { "myinput": "input[type=checkbox]" }
                    this._cache(key, this.child(value as TagOrString));
                }
            } else {
                console.warn(`cacheChildren, bad value type: "${type}". key: "${key}", value: "${value}". childrenObj:`, childrenObj,);
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

    constructor(divOpts) {
        // if (noValue(arguments[0])) {
        //     throw new NotEnoughArgs([1], arguments[0])
        // }
        const {setid, cls, text, byid, query, htmlElement, children} = divOpts;
        if (htmlElement !== undefined) {
            super({htmlElement, children});
        } else if (byid !== undefined) {
            super({byid, children});
        } else if (query !== undefined) {
            super({query, children});
        } else {
            super({tag: "div", setid, cls})
        }
        if (text !== undefined) {
            this.text(text);
        }
    }

}

abstract class Form<E extends HTMLButtonElement | HTMLInputElement>
    extends BetterHTMLElement<E> {
    /**Props in comming with HTMLButtonElement and HTMLInputElement:
     Exclude<keyof HTMLInputElement & keyof HTMLButtonElement, keyof HTMLElement>*/
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
}

class Button extends Form<HTMLButtonElement> {

    constructor(buttonOpts) {
        // if (noValue(arguments[0])) {
        //     throw new NotEnoughArgs([1], arguments[0])
        // }
        const {setid, cls, text, byid, query, htmlElement, children} = buttonOpts;
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

    constructor(pOpts) {
        // if (noValue(arguments[0])) {
        //     throw new NotEnoughArgs([1], arguments[0])
        // }
        const {setid, cls, text, byid, query, htmlElement, children} = pOpts;
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

class Span extends BetterHTMLElement<HTMLSpanElement> {

    /**Create a new Span element, or wrap an existing one by passing htmlElement. Optionally set its id, text or cls.*/
    constructor({cls, setid, text}: { cls?: string, setid?: string, text?: string })
    constructor({byid, children}: { byid: string, children?: ChildrenObj })
    constructor({query, children}: {
        query: string,
        children?: ChildrenObj
    })
    constructor({htmlElement, children}: {
        htmlElement: HTMLSpanElement;
        children?: ChildrenObj
    })
    constructor(spanOpts) {
        const {setid, cls, text, byid, query, htmlElement, children} = spanOpts;
        // if (noValue(arguments[0])) {
        //     throw new NotEnoughArgs([1], arguments[0])
        // }
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

class Input extends Form<HTMLInputElement> {
    // constructor({cls, setid, type, placeholder}: {
    //     cls?: string, setid?: string,
    //     type?: "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local",
    //     placeholder?: string
    // });
    // constructor({byid, children}: { byid: string, children?: ChildrenObj });
    // constructor({query, children}: { query: string, children?: ChildrenObj });
    // constructor({htmlElement, children}: { htmlElement: HTMLInputElement; children?: ChildrenObj });
    constructor(inputOpts) {
        const {setid, cls, type, placeholder, byid, query, htmlElement, children} = inputOpts;
        // if (noValue(arguments[0])) {
        //     throw new NotEnoughArgs([1], arguments[0])
        // }

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

class Img extends BetterHTMLElement<HTMLImageElement> {

    /**Create a new Img element, or wrap an existing one by passing htmlElement. Optionally set its id, src or cls.*/
    constructor({setid, cls, src, byid, query, htmlElement, children}) {

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
    constructor({setid, cls, text, href, target, byid, query, htmlElement, children}) {

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
function elem<T extends Tag>({tag, cls, setid}: { tag: T, cls?: string, setid?: string }):
    T extends Tag ? BetterHTMLElement<HTMLElementTagNameMap[T]> : never;
/**Get an existing element by `id`. Optionally, set its `text`, `cls` or cache `children`*/
function elem({byid, children}: { byid: string, children?: ChildrenObj }):
    BetterHTMLElement;
/**Get an existing element by `query`. Optionally, set its `text`, `cls` or cache `children`*/
function elem<Q extends QuerySelector>({query, children}: { query: Q, children?: ChildrenObj }):
    Q extends Tag ? BetterHTMLElement<HTMLElementTagNameMap[Q]> : BetterHTMLElement;
/**Wrap an existing HTMLElement. Optionally, set its `text`, `cls` or cache `children`*/
function elem<E extends HTMLElement>({htmlElement, children}: { htmlElement: E; children?: ChildrenObj }):
    BetterHTMLElement<E>;

function elem(elemOptions) {
    return new BetterHTMLElement(elemOptions);
}


function span({cls, setid, text}: { cls?: string, setid?: string, text?: string }): Span;
function span({byid, children}: { byid: string, children?: ChildrenObj }): Span;
function span<Q extends QuerySelector>({query, children}: {
    query: Q extends QuerySelector<NotTag<"span">> ? never : Q,
    children?: ChildrenObj
}): Span;
function span<E extends HTMLSpanElement>({htmlElement, children}: {
    htmlElement: E;
    children?: ChildrenObj
}): Span;
function span(): Span
function span(spanOpts?): Span {
    if (!bool(spanOpts)) {
        spanOpts = {}
    }
    return new Span(spanOpts)
}

/**Create a Div element, or wrap an existing one by passing htmlElement. Optionally set its id, text or cls.*/
function div({cls, setid, text}: {
    cls?: string, setid?: string, text?: string
}): Div;
function div({byid, children}: {
    byid: string, children?: ChildrenObj
}): Div;
function div<Q extends QuerySelector>({query, children}: {
    query: Q extends QuerySelector<NotTag<"div">> ? never : Q,
    children?: ChildrenObj
}): Div;
function div<E extends HTMLDivElement>({htmlElement, children}: {
    htmlElement: E;
    children?: ChildrenObj
}): Div;
function div(): Div
function div(divOpts?): Div {
    if (!bool(divOpts)) {
        divOpts = {}
    }
    return new Div(divOpts)
}


function button({cls, setid, text}: {
    cls?: string, setid?: string, text?: string
}): Button;
function button({byid, children}: {
    byid: string, children?: ChildrenObj
}): Button;
function button<Q extends QuerySelector>({query, children}: {
    query: Q extends QuerySelector<NotTag<"button">> ? never : Q,
    children?: ChildrenObj
}): Button;
function button<E extends HTMLButtonElement>({htmlElement, children}: {
    htmlElement: E;
    children?: ChildrenObj
}): Button;
function button(): Button
function button(buttonOpts?): Button {
    if (!bool(buttonOpts)) {
        buttonOpts = {}
    }
    return new Button(buttonOpts)
}


function input({cls, setid, type, placeholder}: {
    cls?: string, setid?: string,
    type?: "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local",
    placeholder?: string
}): Input;
function input({byid, children}: { byid: string, children?: ChildrenObj }): Input;
function input<Q extends QuerySelector>({query, children}: {
    query: Q extends QuerySelector<NotTag<"input">> ? never : Q,
    children?: ChildrenObj
}): Input;
function input<E extends HTMLInputElement>({htmlElement, children}: {
    htmlElement: E;
    children?: ChildrenObj
}): Input;
function input(): Input
function input(inputOpts?): Input {
    if (!bool(inputOpts)) {
        inputOpts = {}
    }
    return new Input(inputOpts)
}


/**Create an Img element, or wrap an existing one by passing htmlElement. Optionally set its id, src or cls.*/
function img({cls, setid, src}: {
    cls?: string, setid?: string,
    src?: string
}): Img;
function img({byid, children}: {
    byid: string, children?: ChildrenObj
}): Img;
function img<Q extends QuerySelector>({query, children}: {
    query: Q extends QuerySelector<NotTag<"img">> ? never : Q,
    children?: ChildrenObj
}): Img;
function img<E extends HTMLImageElement>({htmlElement, children}: {
    htmlElement: E;
    children?: ChildrenObj
}): Img;
function img(): Img
function img(imgOpts?): Img {
    if (!bool(imgOpts)) {
        imgOpts = {}
    }
    return new Img(imgOpts)
}


function paragraph({cls, setid, text}: { cls?: string, setid?: string, text?: string }): Paragraph;
function paragraph({byid, children}: { byid: string, children?: ChildrenObj }): Paragraph;
function paragraph<Q extends QuerySelector>({query, children}: {
    query: Q extends QuerySelector<NotTag<"p">> ? never : Q,
    children?: ChildrenObj
}): Paragraph;
function paragraph<E extends HTMLParagraphElement>({htmlElement, children}: {
    htmlElement: E;
    children?: ChildrenObj
}): Paragraph;
function paragraph(): Paragraph
function paragraph(pOpts?): Paragraph {
    if (!bool(pOpts)) {
        pOpts = {}
    }
    return new Paragraph(pOpts)
}

/**Create a new Anchor element, or wrap an existing one by passing htmlElement. Optionally set its id, text, href or cls.*/
function anchor({cls, setid, href, target}: {
    cls?: string,
    setid?: string,
    href?: string
    target?: string
}): Anchor;
function anchor({byid, children}: {
    byid: string, children?: ChildrenObj
}): Anchor;
function anchor<Q extends QuerySelector>({query, children}: {
    query: Q extends QuerySelector<NotTag<"a">> ? never : Q,
    children?: ChildrenObj
}): Anchor;
function anchor<E extends HTMLImageElement>({htmlElement, children}: {
    htmlElement: E;
    children?: ChildrenObj
}): Anchor;
function anchor(): Anchor
function anchor(anchorOpts?): Anchor {
    if (!bool(anchorOpts)) {
        anchorOpts = {}
    }
    return new Anchor(anchorOpts)
}


function wrapWithBHE(htmlElement: HTMLAnchorElement): Anchor;
function wrapWithBHE(htmlElement: HTMLInputElement): Input;
function wrapWithBHE(htmlElement: HTMLImageElement): Img;
function wrapWithBHE(htmlElement: HTMLParagraphElement): Paragraph;
function wrapWithBHE(htmlElement: HTMLSpanElement): Span;
function wrapWithBHE(htmlElement: HTMLButtonElement): Button;
function wrapWithBHE(htmlElement: HTMLDivElement): Div;
function wrapWithBHE(htmlElement: HTMLElement): BetterHTMLElement;
function wrapWithBHE(element) {
    const tag = element.tagName.toLowerCase() as Element2Tag<typeof element>;
    // const tag = element.tagName.toLowerCase() as Tag;
    if (tag === 'div') {
        return div({htmlElement: element});
    } else if (tag === 'a') {
        return anchor({htmlElement: element});
    } else if (tag === 'p') {
        return paragraph({htmlElement: element});
    } else if (tag === 'img') {
        return img({htmlElement: element});
    } else if (tag === 'input') {
        return input({htmlElement: element});
    } else if (tag === 'button') {
        return button({htmlElement: element});
    } else if (tag === 'span') {
        return span({htmlElement: element});
    } else {
        return elem({htmlElement: element});
    }
}

