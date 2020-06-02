import {anyValue, noValue, isFunction, enumerate, wait, isObject, bool} from "./util";
import {ChildrenObj, Element2Tag, EventName, EventName2Function, MapOfEventName2Function, NotTag, QuerySelector, Returns, Tag, TagOrString, TMap} from "./typings";
import {MutuallyExclusiveArgs, NotEnoughArgs} from "./exceptions";
import {CssOptions} from "./typings";

const SVG_NS_URI = 'http://www.w3.org/2000/svg';

export class BetterHTMLElement<Generic extends HTMLElement = HTMLElement> {
    protected _htmlElement: Generic;
    private readonly _isSvg: boolean = false;
    private readonly _listeners: MapOfEventName2Function = {};
    private _cachedChildren: TMap<BetterHTMLElement | BetterHTMLElement[]> = {};

    /**Create an element of `tag`. Optionally, set its `text`, `cls` or `id`. */
    constructor({tag, cls, setid}: { tag: Element2Tag<Generic>, cls?: string, setid?: string });
    /**Wrap an existing element by `byid`. Optionally cache existing `children`*/
    constructor({byid, children}: { byid: string, children?: ChildrenObj });
    /**Wrap an existing element by `query`. Optionally cache existing `children`*/
    constructor({query, children}: { query: QuerySelector, children?: ChildrenObj });
    /**Wrap an existing HTMLElement. Optionally cache existing `children`*/
    constructor({htmlElement, children}: { htmlElement: Generic; children?: ChildrenObj });
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
                this._htmlElement = document.createElement(tag) as Generic;
            }
            // ** wrap EXISTING element
            // * byid
        } else if (byid !== undefined) {
            this._htmlElement = document.getElementById(byid) as Generic;
        } else {
            // * query
            if (query !== undefined) {
                this._htmlElement = document.querySelector(query) as Generic;
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

    static wrapWithBHE(htmlElement: HTMLAnchorElement): Anchor;

    static wrapWithBHE<TInputType extends InputType = InputType, Generic extends FormishHTMLElement = FormishHTMLElement>(htmlElement: Generic): Input<TInputType, Generic>;

    static wrapWithBHE(htmlElement: HTMLImageElement): Img;

    static wrapWithBHE(htmlElement: HTMLParagraphElement): Paragraph;

    static wrapWithBHE(htmlElement: HTMLSpanElement): Span;

    static wrapWithBHE(htmlElement: HTMLButtonElement): Button;

    static wrapWithBHE(htmlElement: HTMLDivElement): Div;

    static wrapWithBHE(htmlElement: HTMLSelectElement): Div;

    static wrapWithBHE(htmlElement: HTMLElement): BetterHTMLElement;

    static wrapWithBHE(element) {
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
            if (element.type === "text") {
                return new TextInput({htmlElement: element});
            } else if (element.type === "checkbox") {
                return new CheckboxInput({htmlElement: element});
            } else {
                return input({htmlElement: element});
            }
        } else if (tag === 'button') {
            return button({htmlElement: element});
        } else if (tag === 'span') {
            return span({htmlElement: element});
        } else if (tag === 'select') {
            return select({htmlElement: element});
        } else {
            return elem({htmlElement: element});
        }
    }

    toString() {
        return `${this.e.tagName} #${this.id()} .${this.e.classList}`
    }

    /**Sets `this._htmlElement` to `newHtmlElement._htmlElement`.
     * Resets `this._cachedChildren` and caches `newHtmlElement._cachedChildren`.
     * Adds event listeners from `newHtmlElement._listeners`, while keeping `this._listeners`.*/
    wrapSomethingElse<T extends HTMLElement>(newHtmlElement: BetterHTMLElement<T>): this
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
                // @ts-ignore
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

    // *** Basic
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


    // *** Classes
    /**`.className = cls`*/
    class(cls: string): this;
    /**Return the first class that matches `cls` predicate.*/
    class(cls: Returns<boolean>): string;
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

    removeClass(cls: Returns<boolean>, ...clses: Returns<boolean>[]): this;
    removeClass(cls: string, clses?: string[]): this;
    removeClass(cls, ...clses) {
        if (isFunction<Returns<boolean>>(cls)) {
            this.e.classList.remove(this.class(cls));
            for (let c of <Returns<boolean>[]>clses) {
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

    replaceClass(oldToken: Returns<boolean>, newToken: string): this;
    replaceClass(oldToken: string, newToken: string): this
    replaceClass(oldToken, newToken) {
        if (isFunction<Returns<boolean>>(oldToken)) {
            this.e.classList.replace(this.class(oldToken), newToken);
        } else {
            this.e.classList.replace(oldToken, newToken);
        }
        return this;
    }

    toggleClass(cls: Returns<boolean>, force?: boolean): this
    toggleClass(cls: string, force?: boolean): this
    toggleClass(cls, force) {
        if (isFunction<Returns<boolean>>(cls)) {
            this.e.classList.toggle(this.class(cls), force);
        } else {
            this.e.classList.toggle(cls, force);
        }
        return this;
    }

    /**Returns `this.e.classList.contains(cls)` */
    hasClass(cls: string): boolean
    /**Returns whether `this` has a class that matches passed function */
    hasClass(cls: Returns<boolean>): boolean
    hasClass(cls) {
        if (isFunction(cls)) {
            return this.class(cls) !== undefined;
        } else {
            return this.e.classList.contains(cls);
        }
    }

    // *** Nodes
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

    _cls() {
        return BetterHTMLElement
    }

    child(selector: "img"): Img;

    child(selector: "a"): Anchor;

    child<TInputType extends InputType = InputType>(selector: "input"): Input<TInputType, HTMLInputElement>;
    child(selector: "select"): Input<undefined, HTMLSelectElement>;

    child(selector: "p"): Paragraph;

    child(selector: "span"): Span;

    child(selector: "button"): Button;

    child(selector: "div"): Div;

    child<T extends Tag>(selector: T): BetterHTMLElement<HTMLElementTagNameMap[T]>;

    child(selector: string): BetterHTMLElement;

    child<T extends typeof BetterHTMLElement>(selector: string, bheCls: T): T;

    child(selector, bheCls?) {
        const htmlElement = this.e.querySelector(selector) as HTMLElement;
        if (htmlElement === null) {
            console.warn(`${this}.child(${selector}): no child. returning undefined`);
            return undefined;
        }
        let bhe;
        if (bheCls === undefined) {
            bhe = this._cls().wrapWithBHE(htmlElement);
        } else {
            bhe = new bheCls({htmlElement});
        }
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

        return childrenVanilla.map(this._cls().wrapWithBHE);
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
                    if (isFunction(obj)) {
                        // bhe constructor
                        let bhe = this.child(selector, obj);
                        this._cache(key, bhe);
                    } else {
                        this._cache(key, this.child(selector));
                        this[key].cacheChildren(obj);
                    }
                }
            } else if (type === "string") {
                let match = /<(\w+)>$/.exec(value as string);

                if (match) {
                    // { "options": "<option>" }
                    let tagName = match[1] as Tag;
                    // @ts-ignore
                    const htmlElements = [...this.e.getElementsByTagName(tagName)] as HTMLElementTagNameMap[typeof tagName][];
                    let bhes = [];
                    for (let htmlElement of htmlElements) {
                        bhes.push(this._cls().wrapWithBHE(htmlElement));
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
    on(evTypeFnPairs: TMap<EventName2Function>, options?: AddEventListenerOptions): this {
        // const foo = evTypeFnPairs["abort"];
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
    mouseover(fn: (event: MouseEvent) => void, options?: AddEventListenerOptions): this {
        // mouseover: also child elements
        // mouseenter: only bound element
        // return this.on({mouseover: fn}, options)
        return this.on({mouseover: fn})
    }

    /** Remove the event listener of `event`, if exists.*/
    off(event: EventName): this {
        // TODO: Should remove listener from this._listeners?
        this.e.removeEventListener(event, this._listeners[event]);
        return this;
    }

    /** Remove all event listeners in `_listeners`*/
    allOff(): this {

        for (let i = 0; i < Object.keys(this._listeners).length; i++) {
            let event = this._listeners[i];
            this.off(event);
        }

        return this;
    }

    /** For each `[attr, val]` pair, apply `setAttribute`*/
    attr(attrValPairs: TMap<string | boolean>): this

    // *** Attributes

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

    private _cache(key, child: BetterHTMLElement | BetterHTMLElement[]): void {
        const oldchild = this._cachedChildren[key];
        if (oldchild !== undefined) {
            console.warn(`Overwriting this._cachedChildren[${key}]!`, 'old value:',
                oldchild, 'new value:', child, `they're different: ${oldchild == child}`
            );
        }
        this[key] = child;
        this._cachedChildren[key] = child;
    }


}

export class Div extends BetterHTMLElement<HTMLDivElement> {

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

export class Paragraph extends BetterHTMLElement<HTMLParagraphElement> {

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

export class Span extends BetterHTMLElement<HTMLSpanElement> {

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

export class Img extends BetterHTMLElement<HTMLImageElement> {

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

export class Anchor extends BetterHTMLElement<HTMLAnchorElement> {


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

interface Flashable {
    flashBad(): Promise<void>;

    flashGood(): Promise<void>;
}

export type FormishHTMLElement = HTMLButtonElement | HTMLInputElement | HTMLSelectElement;
export type InputType = "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local"

export abstract class Form<Generic extends FormishHTMLElement>
    extends BetterHTMLElement<Generic> implements Flashable {


    get disabled(): boolean {
        return this.e.disabled;
    }

    /**
     Button < Input
     Select - Input: add(), item(), length, namedItem(), options, remove(), selectedIndex, selectedOptions, ITERATOR
     Select - Button: add() autocomplete item() length multiple namedItem() options remove() required selectedIndex selectedOptions size ITERATOR
     Button - Select: formAction formEnctype formMethod formNoValidate formTarget

     Input uniques:
     accept checked defaultChecked defaultValue dirName files indeterminate list max maxLength min minLength pattern placeholder readOnly select() selectionDirection selectionEnd selectionStart setRangeText() setSelectionRange() src step stepDown() stepUp() useMap valueAsDate valueAsNumber

     Select uniques:
     add() item() length namedItem() options remove() selectedIndex selectedOptions ITERATOR

     Shared among Button, Select and Input: (or Button and Select, same)
     checkValidity() disabled form labels name reportValidity() setCustomValidity() type validationMessage validity value willValidate

     Shared ammong Selecct and Input:
     autocomplete checkValidity() disabled form labels multiple name reportValidity() required setCustomValidity() type validationMessage validity value willValidate

     */
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

    /**Returns `value`*/
    value(): string;
    /**`value(null)` or `value('')` → reset. */
    value(val: any): this;
    value(val?) {
        if (val === undefined) {
            return bool(this.e.value) ? this.e.value : undefined;
        } else {
            this.e.value = val;
            return this;
        }
    }

    async flashBad(): Promise<void> {
        this.addClass('bad');
        await wait(2000);
        this.removeClass('bad');

    }

    async flashGood(): Promise<void> {
        this.addClass('good');
        await wait(2000);
        this.removeClass('good');
    }

    // abstract _eventCondition(e): boolean
    clear() {
        return this.value(null)
    }

    _preEvent() {
        this.disable()
    }

    async _onEventSuccess(ret) {
        if (ret instanceof Error && this.flashBad) {
            await this.flashBad();
        } else if (this.flashGood) {
            this.flashGood()
        }
    }

    async _onEventError(e) {
        console.error(e);
        if (this.flashBad) {
            await this.flashBad()
        }
    }

    _postEvent() {
        this.enable();
    }
}


export class Button extends Form<HTMLButtonElement> {
    constructor(buttonOpts) {
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

    click(_fn?: (_event: MouseEvent) => Promise<any>): this {

        const fn = async (event) => {

            try {
                this._preEvent();
                const ret = await _fn(event);
                await this._onEventSuccess(ret);

            } catch (e) {
                await this._onEventError(e);

            } finally {
                this._postEvent();
            }

        };

        return super.click(fn);
    }


}

export class Input<TInputType extends InputType, Generic extends FormishHTMLElement = HTMLInputElement> extends Form<Generic> {
    // constructor({cls, setid, type, placeholder}: {
    //     cls?: string, setid?: string,
    //     type?: "checkbox" | "number" | "radio" | "text" | "time" | "datetime-local",
    //     placeholder?: string
    // });
    // constructor({byid, children}: { byid: string, children?: ChildrenObj });
    // constructor({query, children}: { query: string, children?: ChildrenObj });
    // constructor({htmlElement, children}: { htmlElement: HTMLInputElement; children?: ChildrenObj });
    type: TInputType;

    constructor(inputOpts) {
        const {setid, cls, type, byid, query, htmlElement, children} = inputOpts;
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

    }


}

export class TextInput extends Input<"text"> {
    constructor(opts) {
        opts.type = 'text';
        super(opts);
        const {placeholder, type} = opts;
        if (placeholder !== undefined) {
            if (type) {
                if (type === "number" && typeof placeholder !== "number") {
                    console.warn(`placeholder type is ${typeof placeholder} but input type is ${type}. ignoring`)
                } else if (type === "text" && typeof placeholder !== "string") {
                    console.warn(`placeholder type is ${typeof placeholder} but input type is ${type}. ignoring`)
                } else {
                    this.placeholder(placeholder);
                }
            }
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

    keydown(_fn: (_event: KeyboardEvent) => Promise<any>): this {
        const fn = async (event) => {
            if (event.key !== 'Enter') {
                return;
            }
            if (!bool(this.value())) {
                if (this.flashBad) {
                    await this.flashBad()
                }
                return;
            }
            try {
                this._preEvent();

                const ret = await _fn(event);
                await this._onEventSuccess(ret);

            } catch (e) {
                await this._onEventError(e);

            } finally {
                this._postEvent();
            }


        };
        return super.keydown(fn);
    }
}

export class Changable<TInputType extends InputType, Generic extends FormishHTMLElement> extends Input<TInputType, Generic> {
    change(_fn: (_event: Event) => Promise<any>): this {

        const fn = async (event) => {

            try {
                this._preEvent();
                const ret = await _fn(event);
                await this._onEventSuccess(ret);

            } catch (e) {
                await this._onEventError(e);

            } finally {
                this._postEvent();
            }


        };
        return super.change(fn);
    }
}

export class CheckboxInput extends Changable<"checkbox", HTMLInputElement> {
    constructor(opts) {
        opts.type = 'checkbox';
        super(opts);
    }

    get checked(): boolean {
        return this.e.checked;
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


    clear() {
        return this.uncheck();
    }

    async _onEventError(e): Promise<void> {
        this.toggleChecked(!this.checked);
        await super._onEventError(e);
    }
}


export class Select extends Changable<undefined, HTMLSelectElement> {

    // Select uniques:
    // add() item() length namedItem() options remove() selectedIndex selectedOptions ITERATOR
    constructor(selectOpts) {
        super(selectOpts);
    }

    get selectedIndex(): number {
        return this.e.selectedIndex
    }

    set selectedIndex(val) {
        this.e.selectedIndex = val
    }

    get selected(): HTMLOptionElement {
        return this.item(this.selectedIndex)
    }

    set selected(val) {
        if (val instanceof HTMLOptionElement) {
            this.selectedIndex = this.options.findIndex(o => o === val);
        } else if (typeof val === 'number') {
            this.selectedIndex = val
        } else {
            this.selectedIndex = this.options.findIndex(o => o.value === val);
        }

    }

    get options(): HTMLOptionElement[] {
        return [...this.e.options as unknown as Iterable<HTMLOptionElement>]
    }

    item(index): HTMLOptionElement {
        return this.e.item(index) as HTMLOptionElement
    }


    clear() {
        this.selectedIndex = -1;
        return this;
    }

    /*[Symbol.iterator]() {
        let options = this.options;
        let currentIndex = 0;
        return {
            next() {
                currentIndex += 1;
                return {
                    value: undefined,
                    done: true
                };

            }
        }
    }*/
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
export function elem<T extends Tag>({tag, cls, setid}: { tag: T, cls?: string, setid?: string }):
    T extends Tag ? BetterHTMLElement<HTMLElementTagNameMap[T]> : never;
/**Get an existing element by `id`. Optionally, set its `text`, `cls` or cache `children`*/
export function elem({byid, children}: { byid: string, children?: ChildrenObj }):
    BetterHTMLElement;
/**Get an existing element by `query`. Optionally, set its `text`, `cls` or cache `children`*/
export function elem<Q extends QuerySelector>({query, children}: { query: Q, children?: ChildrenObj }):
    Q extends Tag ? BetterHTMLElement<HTMLElementTagNameMap[Q]> : BetterHTMLElement;
/**Wrap an existing HTMLElement. Optionally, set its `text`, `cls` or cache `children`*/
export function elem<E extends HTMLElement>({htmlElement, children}: { htmlElement: E; children?: ChildrenObj }):
    BetterHTMLElement<E>;

export function elem(elemOptions) {
    return new BetterHTMLElement(elemOptions);
}


export function span({cls, setid, text}: { cls?: string, setid?: string, text?: string }): Span;
export function span({byid, children}: { byid: string, children?: ChildrenObj }): Span;
export function span<Q extends QuerySelector>({query, children}: {
    query: Q extends QuerySelector<NotTag<"span">> ? never : Q,
    children?: ChildrenObj
}): Span;
export function span<E extends HTMLSpanElement>({htmlElement, children}: {
    htmlElement: E;
    children?: ChildrenObj
}): Span;
export function span(): Span
export function span(spanOpts?): Span {
    if (!bool(spanOpts)) {
        spanOpts = {}
    }
    return new Span(spanOpts)
}

/**Create a Div element, or wrap an existing one by passing htmlElement. Optionally set its id, text or cls.*/
export function div({cls, setid, text}: {
    cls?: string, setid?: string, text?: string
}): Div;
export function div({byid, children}: {
    byid: string, children?: ChildrenObj
}): Div;
export function div<Q extends QuerySelector>({query, children}: {
    query: Q extends QuerySelector<NotTag<"div">> ? never : Q,
    children?: ChildrenObj
}): Div;
export function div<E extends HTMLDivElement>({htmlElement, children}: {
    htmlElement: E;
    children?: ChildrenObj
}): Div;
export function div(): Div
export function div(divOpts?): Div {
    if (!bool(divOpts)) {
        divOpts = {}
    }
    return new Div(divOpts)
}


export function button({cls, setid, text}: {
    cls?: string, setid?: string, text?: string
}): Button;
export function button({byid, children}: {
    byid: string, children?: ChildrenObj
}): Button;
export function button<Q extends QuerySelector>({query, children}: {
    query: Q extends QuerySelector<NotTag<"button">> ? never : Q,
    children?: ChildrenObj
}): Button;
export function button<E extends HTMLButtonElement>({htmlElement, children}: {
    htmlElement: E;
    children?: ChildrenObj
}): Button;
export function button(): Button
export function button(buttonOpts?): Button {
    if (!bool(buttonOpts)) {
        buttonOpts = {}
    }
    return new Button(buttonOpts)
}


export function input<TInputType extends InputType, Generic extends FormishHTMLElement = HTMLInputElement>({cls, setid, type, placeholder}: {
    cls?: string, setid?: string,
    type?: TInputType,
    placeholder?: string
}): Input<TInputType, Generic>;
export function input<TInputType extends InputType = InputType, Generic extends FormishHTMLElement = HTMLInputElement>({byid, children}: { byid: string, children?: ChildrenObj }): Input<TInputType, Generic>;
export function input<Q extends QuerySelector, TInputType extends InputType = InputType, Generic extends FormishHTMLElement = HTMLInputElement>({query, children}: {
    query: Q extends QuerySelector<NotTag<"input">> ? never : Q,
    children?: ChildrenObj
}): Input<TInputType, Generic>;
export function input<TInputType extends InputType = InputType, Generic extends FormishHTMLElement = HTMLInputElement>({htmlElement, children}: {
    htmlElement: Generic;
    children?: ChildrenObj
}): Input<TInputType, Generic>;
export function input<TInputType extends InputType = InputType, Generic extends FormishHTMLElement = HTMLInputElement>(): Input<TInputType, Generic>
export function input(inputOpts?) {
    if (!bool(inputOpts)) {
        inputOpts = {}
    }
    return new Input(inputOpts)
}

export function select(selectOpts): Select {
    if (!bool(selectOpts)) {
        selectOpts = {}
    }
    return new Select(selectOpts)
}

/**Create an Img element, or wrap an existing one by passing htmlElement. Optionally set its id, src or cls.*/
export function img({cls, setid, src}: {
    cls?: string, setid?: string,
    src?: string
}): Img;
export function img({byid, children}: {
    byid: string, children?: ChildrenObj
}): Img;
export function img<Q extends QuerySelector>({query, children}: {
    query: Q extends QuerySelector<NotTag<"img">> ? never : Q,
    children?: ChildrenObj
}): Img;
export function img<E extends HTMLImageElement>({htmlElement, children}: {
    htmlElement: E;
    children?: ChildrenObj
}): Img;
export function img(): Img
export function img(imgOpts?): Img {
    if (!bool(imgOpts)) {
        imgOpts = {}
    }
    return new Img(imgOpts)
}


export function paragraph({cls, setid, text}: { cls?: string, setid?: string, text?: string }): Paragraph;
export function paragraph({byid, children}: { byid: string, children?: ChildrenObj }): Paragraph;
export function paragraph<Q extends QuerySelector>({query, children}: {
    query: Q extends QuerySelector<NotTag<"p">> ? never : Q,
    children?: ChildrenObj
}): Paragraph;
export function paragraph<E extends HTMLParagraphElement>({htmlElement, children}: {
    htmlElement: E;
    children?: ChildrenObj
}): Paragraph;
export function paragraph(): Paragraph
export function paragraph(pOpts?): Paragraph {
    if (!bool(pOpts)) {
        pOpts = {}
    }
    return new Paragraph(pOpts)
}

/**Create a new Anchor element, or wrap an existing one by passing htmlElement. Optionally set its id, text, href or cls.*/
export function anchor({cls, setid, href, target}: {
    cls?: string,
    setid?: string,
    href?: string
    target?: string
}): Anchor;
export function anchor({byid, children}: {
    byid: string, children?: ChildrenObj
}): Anchor;
export function anchor<Q extends QuerySelector>({query, children}: {
    query: Q extends QuerySelector<NotTag<"a">> ? never : Q,
    children?: ChildrenObj
}): Anchor;
export function anchor<E extends HTMLAnchorElement>({htmlElement, children}: {
    htmlElement: E;
    children?: ChildrenObj
}): Anchor;
export function anchor(): Anchor
export function anchor(anchorOpts?): Anchor {
    if (!bool(anchorOpts)) {
        anchorOpts = {}
    }
    return new Anchor(anchorOpts)
}



