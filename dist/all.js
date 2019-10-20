/**Thrown when either too much or not enough arguments were passed. Prints what was expected and what was actually passed.*/
class BadArgumentsAmountError extends Error {
    constructor(expectedArgsNum, passedArgs, details) {
        const requiresExactNumOfArgs = !Array.isArray(expectedArgsNum);
        const argsWithValues = BadArgumentsAmountError.getArgsWithValues(passedArgs);
        const argNamesValues = BadArgumentsAmountError.getArgNamesValues(argsWithValues);
        let message;
        if (requiresExactNumOfArgs) {
            message = `Didn't receive exactly ${expectedArgsNum} arg. `;
        }
        else {
            message = `Didn't receive between ${expectedArgsNum[0]} to ${expectedArgsNum[1]} args. `;
        }
        message += `Instead, out of ${Object.keys(passedArgs).length} received (${Object.keys(passedArgs)}), ${Object.keys(argsWithValues).length} had value: "${argNamesValues}". ${details ? 'Details: ' + details : ''}`;
        super(message);
    }
    static getArgNamesValues(argsWithValues) {
        return Object.entries(argsWithValues)
            // @ts-ignore
            .flatMap(([argname, argval]) => `${argname}: ${argval}`)
            .join('", "');
    }
    static getArgsWithValues(passedArgs) {
        const argsWithValues = {};
        for (let [argname, argval] of Object.entries(passedArgs)) {
            if (argval !== undefined)
                argsWithValues[argname] = argval;
        }
        return argsWithValues;
    }
}
const SVG_NS_URI = 'http://www.w3.org/2000/svg';
// TODO: make BetterHTMLElement<T>, for use in eg child[ren] function
// maybe use https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypet
// extends HTMLElement: https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/upgrade#Examples
class BetterHTMLElement {
    constructor(elemOptions) {
        this._isSvg = false;
        this._listeners = {};
        this._cachedChildren = {};
        const { tag, id, htmlElement, text, query, children, cls } = elemOptions;
        if ([tag, id, htmlElement, query].filter(x => x !== undefined).length > 1) {
            throw new BadArgumentsAmountError(1, {
                tag,
                id,
                htmlElement,
                query
            });
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
                // this._htmlElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
            }
            else {
                this._htmlElement = document.createElement(tag);
            }
        }
        else if (id !== undefined)
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
            });
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
    wrapSomethingElse(newHtmlElement) {
        this._cachedChildren = {};
        if (newHtmlElement instanceof BetterHTMLElement) {
            this._htmlElement.replaceWith(newHtmlElement.e);
            this._htmlElement = newHtmlElement.e;
            for (let [_key, _cachedChild] of enumerate(newHtmlElement._cachedChildren)) {
                this._cache(_key, _cachedChild);
            }
            if (Object.keys(this._cachedChildren).length
                !== Object.keys(newHtmlElement._cachedChildren).length
                ||
                    Object.values(this._cachedChildren).filter(v => v !== undefined).length
                        !== Object.values(newHtmlElement._cachedChildren).filter(v => v !== undefined).length) {
                console.warn(`wrapSomethingElse this._cachedChildren length !== newHtmlElement._cachedChildren.length`, {
                    this: this,
                    newHtmlElement
                });
            }
            this.on(Object.assign({}, this._listeners, newHtmlElement._listeners));
        }
        else {
            // No way to get newHtmlElement event listeners besides hacking Element.prototype
            this.on(this._listeners);
            this._htmlElement.replaceWith(newHtmlElement);
            this._htmlElement = newHtmlElement;
        }
        return this;
    }
    html(html) {
        if (html === undefined) {
            return this.e.innerHTML;
        }
        else {
            this.e.innerHTML = html;
            return this;
        }
    }
    text(txt) {
        if (txt === undefined) {
            return this.e.innerText;
        }
        else {
            this.e.innerText = txt;
            return this;
        }
    }
    id(id) {
        if (id === undefined) {
            return this.e.id;
        }
        else {
            this.e.id = id;
            return this;
        }
    }
    css(css) {
        if (typeof css === 'string') {
            return this.e.style[css];
        }
        else {
            for (let [styleAttr, styleVal] of enumerate(css))
                this.e.style[styleAttr] = styleVal;
            return this;
        }
    }
    /**Remove the value of the passed style properties*/
    uncss(...removeProps) {
        let css = {};
        for (let prop of removeProps)
            css[prop] = '';
        return this.css(css);
    }
    /**@deprecated*/
    is(element) {
        // https://api.jquery.com/is/
        throw new Error("NOT IMPLEMENTED");
    }
    class(cls) {
        if (cls === undefined) {
            return Array.from(this.e.classList);
        }
        else if (isFunction(cls)) {
            return Array.from(this.e.classList).find(cls);
        }
        else {
            if (this._isSvg) {
                // @ts-ignore
                this.e.classList = [cls];
            }
            else {
                this.e.className = cls;
            }
            return this;
        }
    }
    addClass(cls, ...clses) {
        this.e.classList.add(cls);
        for (let c of clses)
            this.e.classList.add(c);
        return this;
    }
    removeClass(cls, ...clses) {
        if (isFunction(cls)) {
            this.e.classList.remove(this.class(cls));
            for (let c of clses)
                this.e.classList.remove(this.class(c));
        }
        else {
            this.e.classList.remove(cls);
            for (let c of clses)
                this.e.classList.remove(c);
        }
        return this;
    }
    replaceClass(oldToken, newToken) {
        if (isFunction(oldToken)) {
            this.e.classList.replace(this.class(oldToken), newToken);
        }
        else {
            this.e.classList.replace(oldToken, newToken);
        }
        return this;
    }
    toggleClass(cls, force) {
        if (isFunction(cls))
            this.e.classList.toggle(this.class(cls), force);
        else
            this.e.classList.toggle(cls, force);
        return this;
    }
    hasClass(cls) {
        if (isFunction(cls)) {
            return this.class(cls) !== undefined;
        }
        else {
            return this.e.classList.contains(cls);
        }
    }
    // ***  Nodes
    /**Insert at least one `node` just after `this`. Any `node` can be either `BetterHTMLElement`s or vanilla `Node`.*/
    after(...nodes) {
        for (let node of nodes) {
            if (node instanceof BetterHTMLElement)
                this.e.after(node.e);
            else
                this.e.after(node);
        }
        return this;
        /*if (nodes[0] instanceof BetterHTMLElement)
            for (let bhe of <BetterHTMLElement[]>nodes)
                this.e.after(bhe.e);
        else
            for (let node of <(string | Node)[]>nodes)
                this.e.after(node); // TODO: test what happens when passed strings
        return this;
        */
    }
    /**Insert `this` just after a `BetterHTMLElement` or a vanilla `Node`.*/
    insertAfter(node) {
        if (node instanceof BetterHTMLElement)
            node.e.after(this.e);
        else
            node.after(this.e);
        return this;
    }
    /**Insert at least one `node` after the last child of `this`.
     * Any `node` can be either a `BetterHTMLElement`, a vanilla `Node`,
     * a `{someKey: BetterHTMLElement}` pairs object, or a `[someKey, BetterHTMLElement]` tuple.*/
    append(...nodes) {
        for (let node of nodes) {
            if (node instanceof BetterHTMLElement)
                this.e.append(node.e);
            else if (node instanceof Node)
                this.e.append(node);
            else if (Array.isArray(node))
                this.cacheAppend([node]);
            else
                this.cacheAppend(node);
        }
        return this;
        /*if (nodes[0] instanceof BetterHTMLElement)
            for (let bhe of <BetterHTMLElement[]>nodes)
                this.e.append(bhe.e);
        else
            for (let node of <(string | Node)[]>nodes)
                this.e.append(node); // TODO: test what happens when passed strings
        return this;*/
    }
    /**Append `this` to a `BetterHTMLElement` or a vanilla `Node`*/
    appendTo(node) {
        if (node instanceof BetterHTMLElement)
            node.e.append(this.e);
        else
            node.append(this.e);
        return this;
    }
    /**Insert at least one `node` just before `this`. Any `node` can be either `BetterHTMLElement`s or vanilla `Node`.*/
    before(...nodes) {
        for (let node of nodes) {
            if (node instanceof BetterHTMLElement)
                this.e.before(node.e);
            else
                this.e.before(node);
        }
        return this;
        /*if (nodes[0] instanceof BetterHTMLElement)
            for (let bhe of <BetterHTMLElement[]>nodes)
                this.e.before(bhe.e);
        else
            for (let node of <(string | Node)[]>nodes)
                this.e.before(node); // TODO: test what happens when passed strings
        return this;*/
    }
    /**Insert `this` just before a `BetterHTMLElement` or a vanilla `Node`s.*/
    insertBefore(node) {
        if (node instanceof BetterHTMLElement)
            node.e.before(this.e);
        else
            node.before(this.e);
        return this;
    }
    replaceChild(newChild, oldChild) {
        this.e.replaceChild(newChild, oldChild);
        return this;
    }
    _cache(key, child) {
        this[key] = child;
        this._cachedChildren[key] = child;
    }
    cacheAppend(keyChildPairs) {
        const _cacheAppend = (_key, _child) => {
            this.append(_child);
            this._cache(_key, _child);
        };
        if (Array.isArray(keyChildPairs)) {
            for (let [key, child] of keyChildPairs)
                _cacheAppend(key, child);
        }
        else {
            for (let [key, child] of enumerate(keyChildPairs))
                _cacheAppend(key, child);
        }
        return this;
    }
    child(selector) {
        return new BetterHTMLElement({ htmlElement: this.e.querySelector(selector) });
    }
    children(selector) {
        let childrenVanilla;
        let childrenCollection;
        if (selector === undefined) {
            childrenCollection = this.e.children;
        }
        else {
            childrenCollection = this.e.querySelectorAll(selector);
        }
        childrenVanilla = Array.from(childrenCollection);
        const toElem = (c) => new BetterHTMLElement({ htmlElement: c });
        return childrenVanilla.map(toElem);
    }
    clone(deep) {
        // @ts-ignore
        return new BetterHTMLElement({ htmlElement: this.e.cloneNode(deep) });
    }
    /**key: string. value: either "selector string" OR {"selector string": <recurse down>}*/
    cacheChildren(keySelectorObj) {
        for (let [key, selectorOrObj] of enumerate(keySelectorObj)) {
            if (typeof selectorOrObj === 'object') {
                let entries = Object.entries(selectorOrObj);
                if (entries[1] !== undefined) {
                    console.warn(`cacheChildren() received recursive obj with more than 1 selector for a key. Using only 0th selector`, {
                        key,
                        "multiple selectors": entries.map(e => e[0]),
                        selectorOrObj,
                        this: this
                    });
                }
                // only first because 1:1 for key:selector.
                // (ie can't do {right: {.right: {...}, .right2: {...}})
                let [selector, obj] = entries[0];
                this._cache(key, this.child(selector));
                // this[key] = this.child(selector);
                this[key].cacheChildren(obj);
            }
            else {
                // this[key] = this.child(<QuerySelector>selectorOrObj);
                this._cache(key, this.child(selectorOrObj));
            }
        }
        return this;
    }
    /**Remove all children from DOM*/
    empty() {
        // TODO: is this faster than innerHTML = ""?
        while (this.e.firstChild)
            this.e.removeChild(this.e.firstChild);
        return this;
    }
    /**Remove element from DOM*/
    remove() {
        this.e.remove();
        return this;
    }
    // TODO: recursively yield children
    //  (unlike .children(), this doesn't return only the first level)
    /**@deprecated*/
    find() {
        // https://api.jquery.com/find/
        throw new Error("NOT IMPLEMENTED");
    }
    /**@deprecated*/
    first() {
        // https://api.jquery.com/first/
        // this.e.firstChild
        throw new Error("NOT IMPLEMENTED");
    }
    /**@deprecated*/
    last() {
        // https://api.jquery.com/last/
        // this.e.lastChild
        throw new Error("NOT IMPLEMENTED");
    }
    /**@deprecated*/
    next() {
        throw new Error("NOT IMPLEMENTED");
    }
    /**@deprecated*/
    not() {
        throw new Error("NOT IMPLEMENTED");
    }
    /**@deprecated*/
    parent() {
        throw new Error("NOT IMPLEMENTED");
    }
    /**@deprecated*/
    parents() {
        throw new Error("NOT IMPLEMENTED");
    }
    // ***  Events
    on(evTypeFnPairs, options) {
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
        throw new Error("NOT IMPLEMENTED");
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
    touchstart(fn, options) {
        this.e.addEventListener('touchstart', function _f(ev) {
            ev.preventDefault(); // otherwise "touchmove" is triggered
            fn(ev);
            if (options && options.once) // TODO: maybe native options.once is enough
                this.removeEventListener('touchstart', _f);
        }, options);
        // TODO: this._listeners, or use this.on(
        return this;
    }
    /** Add a `pointerdown` event listener if browser supports `pointerdown`, else send `mousedown` (safari). */
    pointerdown(fn, options) {
        let action;
        try {
            // TODO: check if PointerEvent exists instead of try/catch
            // @ts-ignore
            action = window.PointerEvent ? 'pointerdown' : 'mousedown'; // safari doesn't support pointerdown
        }
        catch (e) {
            action = 'mousedown';
        }
        const _f = function _f(ev) {
            ev.preventDefault();
            fn(ev);
            if (options && options.once) // TODO: maybe native options.once is enough
                this.removeEventListener(action, _f);
        };
        this.e.addEventListener(action, _f, options);
        this._listeners.pointerdown = _f;
        return this;
    }
    click(fn, options) {
        if (fn === undefined) {
            this.e.click();
            return this;
        }
        else {
            return this.on({ click: fn }, options);
        }
    }
    blur(fn, options) {
        if (fn === undefined) {
            this.e.blur();
            return this;
        }
        else {
            return this.on({ blur: fn }, options);
        }
    }
    focus(fn, options) {
        if (fn === undefined) {
            this.e.focus();
            return this;
        }
        else {
            return this.on({ focus: fn }, options);
        }
    }
    /**Add a `change` event listener*/
    change(fn, options) {
        return this.on({ change: fn }, options);
    }
    /**Add a `contextmenu` event listener*/
    contextmenu(fn, options) {
        return this.on({ contextmenu: fn }, options);
    }
    dblclick(fn, options) {
        if (fn === undefined) {
            const dblclick = new MouseEvent('dblclick', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            this.e.dispatchEvent(dblclick);
            return this;
        }
        else {
            return this.on({ dblclick: fn }, options);
        }
    }
    mouseenter(fn, options) {
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
        }
        else {
            return this.on({ mouseenter: fn }, options);
        }
    }
    keydown(fn, options) {
        if (fn === undefined)
            throw new Error("NOT IMPLEMENTED");
        else
            return this.on({ keydown: fn }, options);
    }
    /**@deprecated*/
    keyup() {
        // https://api.jquery.com/keyup/
        throw new Error("NOT IMPLEMENTED");
    }
    /**@deprecated*/
    keypress() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED");
    }
    /**@deprecated*/
    hover() {
        // https://api.jquery.com/hover/
        // binds to both mouseenter and mouseleave
        // https://stackoverflow.com/questions/17589420/when-to-choose-mouseover-and-hover-function
        throw new Error("NOT IMPLEMENTED");
    }
    /**@deprecated*/
    mousedown() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED");
    }
    /**@deprecated*/
    mouseleave() {
        // https://api.jquery.com/keypress/
        //mouseleave and mouseout are similar but differ in that mouseleave does not bubble and mouseout does.
        // This means that mouseleave is fired when the pointer has exited the element and all of its descendants,
        // whereas mouseout is fired when the pointer leaves the element or leaves one of the element's descendants
        // (even if the pointer is still within the element).
        throw new Error("NOT IMPLEMENTED");
    }
    /**@deprecated*/
    mousemove() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED");
    }
    mouseout(fn, options) {
        //mouseleave and mouseout are similar but differ in that mouseleave does not bubble and mouseout does.
        // This means that mouseleave is fired when the pointer has exited the element and all of its descendants,
        // whereas mouseout is fired when the pointer leaves the element or leaves one of the element's descendants
        // (even if the pointer is still within the element).
        if (fn === undefined)
            throw new Error("NOT IMPLEMENTED");
        else
            return this.on({ mouseout: fn }, options);
    }
    mouseover(fn, options) {
        // mouseover: also child elements
        // mouseenter: only bound element
        if (fn === undefined)
            throw new Error("NOT IMPLEMENTED");
        else
            return this.on({ mouseover: fn }, options);
    }
    /**@deprecated*/
    mouseup() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED");
    }
    transform(options) {
        let transform = '';
        for (let [k, v] of enumerate(options)) {
            transform += `${k}(${v}) `;
        }
        return new Promise(resolve => {
            this.on({
                transitionend: resolve
            }, { once: true });
            this.css({ transform });
        });
    }
    /** Remove the event listener of `event`, if exists.*/
    off(event) {
        this.e.removeEventListener(event, this._listeners[event]);
        return this;
    }
    allOff() {
        for (let event in this._listeners) {
            this.off(event);
        }
        return this;
    }
    attr(attrValPairs) {
        if (typeof attrValPairs === 'string') {
            return this.e.getAttribute(attrValPairs);
        }
        else {
            for (let [attr, val] of enumerate(attrValPairs))
                this.e.setAttribute(attr, val);
            return this;
        }
    }
    /** `removeAttribute` */
    removeAttr(qualifiedName, ...qualifiedNames) {
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
    data(key, parse = true) {
        // TODO: jquery doesn't affect data-* attrs in DOM. https://api.jquery.com/data/
        const data = this.e.getAttribute(`data-${key}`);
        if (parse === true)
            return JSON.parse(data);
        else
            return data;
    }
    // **  Fade
    async fade(dur, to) {
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
            this.css({ opacity: to });
            await wait(dur);
            return this;
        }
        // transition: opacity was NOT defined in css.
        if (dur == 0) {
            return this.css({ opacity: to });
        }
        const isFadeOut = to === 0;
        let opacity = parseFloat(this.e.style.opacity);
        if (opacity === undefined || isNaN(opacity)) {
            console.warn(`fade(${dur}, ${to}) htmlElement has NO opacity at all. recursing`, {
                opacity,
                this: this
            });
            return this.css({ opacity: Math.abs(1 - to) }).fade(dur, to);
        }
        else {
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
                if (isFadeOut === true)
                    opacity -= opStep;
                else
                    opacity += opStep;
                this.css({ opacity });
            }
            else {
                opacity = to;
                this.css({ opacity });
                clearInterval(interval);
            }
        }, everyms);
        await wait(dur);
        return this;
    }
    async fadeOut(dur) {
        return await this.fade(dur, 0);
    }
    async fadeIn(dur) {
        return await this.fade(dur, 1);
    }
}
class Div extends BetterHTMLElement {
    /**Create a Div element. Optionally set its id, text or cls.*/
    constructor({ id, text, cls } = {}) {
        super({ tag: 'div', text, cls });
        if (id !== undefined)
            this.id(id);
    }
}
class Paragraph extends BetterHTMLElement {
    /**Create a Paragraph element. Optionally set its id, text or cls.*/
    constructor({ id, text, cls } = {}) {
        super({ tag: 'p', text, cls });
        if (id !== undefined)
            this.id(id);
    }
}
class Span extends BetterHTMLElement {
    /**Create a Span element. Optionally set its id, text or cls.*/
    constructor({ id, text, cls } = {}) {
        super({ tag: 'span', text, cls });
        if (id !== undefined)
            this.id(id);
    }
}
class Img extends BetterHTMLElement {
    /**Create an Img element. Optionally set its id, src or cls.*/
    constructor({ id, src, cls }) {
        super({ tag: 'img', cls });
        if (id !== undefined)
            this.id(id);
        if (src !== undefined)
            this._htmlElement.src = src;
    }
    src(src) {
        if (src === undefined) {
            return this._htmlElement.src;
        }
        else {
            this._htmlElement.src = src;
            return this;
        }
    }
}
class Anchor extends BetterHTMLElement {
    /**Create an Anchor element. Optionally set its id, text, href or cls.*/
    constructor({ id, text, cls, href } = {}) {
        super({ tag: 'a', text, cls });
        if (id !== undefined)
            this.id(id);
        if (href !== undefined)
            this.href(href);
    }
    href(val) {
        if (val === undefined)
            return this.attr('href');
        else
            return this.attr({ href: val });
    }
    target(val) {
        if (val === undefined)
            return this.attr('target');
        else
            return this.attr({ target: val });
    }
}
/*class Svg extends BetterHTMLElement{
    protected readonly _htmlElement: SVGElement;
    constructor({id, cls,htmlElement}: SvgConstructor) {
        super({tag: 'svg', cls});
        if (id)
            this.id(id);
        if (src)
            this._htmlElement.src = src;
        
    }
}
*/
customElements.define('better-html-element', BetterHTMLElement);
customElements.define('better-div', Div, { extends: 'div' });
customElements.define('better-p', Paragraph, { extends: 'p' });
customElements.define('better-span', Span, { extends: 'span' });
customElements.define('better-img', Img, { extends: 'img' });
customElements.define('better-a', Anchor, { extends: 'a' });
function elem(elemOptions) {
    return new BetterHTMLElement(elemOptions);
}
/**Create an Span element. Optionally set its id, text or cls.*/
function span({ id, text, cls } = {}) {
    return new Span({ id, text, cls });
}
/**Create an Div element. Optionally set its id, text or cls.*/
function div({ id, text, cls } = {}) {
    return new Div({ id, text, cls });
}
/**Create an Img element. Optionally set its id, src or cls.*/
function img({ id, src, cls } = {}) {
    return new Img({ id, src, cls });
}
/**Create a Paragraph element. Optionally set its id, text or cls.*/
function paragraph({ id, text, cls } = {}) {
    return new Paragraph({ id, text, cls });
}
/**Create an Anchor element. Optionally set its id, text, href or cls.*/
function anchor({ id, text, cls, href } = {}) {
    return new Anchor({ id, text, cls, href });
}
// function enumerate(obj: undefined): [void];
function enumerate(obj) {
    // undefined    []
    // {}           []
    // []           []
    // ""           []
    // number       TypeError
    // null         TypeError
    // boolean      TypeError
    // Function     TypeError
    // "foo"        [ [0, "f"], [1, "o"], [2, "o"] ]
    // [ "foo" ]    [ [0, "foo"] ]
    // [ 10 ]       [ [0, 10] ]
    // { a: "foo" } [ ["a", "foo"] ]
    let typeofObj = typeof obj;
    if (obj === undefined
        || isEmptyObj(obj)
        || isEmptyArr(obj)
        // @ts-ignore
        || obj === "") {
        return [];
    }
    if (obj === null
        || typeofObj === "boolean"
        || typeofObj === "number"
        || typeofObj === "function") {
        throw new TypeError(`${typeofObj} object is not iterable`);
    }
    let array = [];
    if (isArray(obj)) {
        let i = 0;
        for (let x of obj) {
            array.push([i, x]);
            i++;
        }
    }
    else {
        for (let prop in obj) {
            array.push([prop, obj[prop]]);
        }
    }
    return array;
}
/*let obj0: { a: boolean, b: number } = {a: true, b: 1};
let arr0: number[] = [1, 2, 3, 4];
let arr1: string[] = ["1", "2", "3", "4"];
let num0: number = 5;
let undefined0: undefined;
let null0: null = null;
let boolean0: boolean = true;

let MyFoo = enumerate(undefined0);
if (MyFoo === true) {
    console.log('hi');
}
*/
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/*function equalsAny(obj: any, ...others: any[]): boolean {
    if (!others)
        throw new Error('Not even one other was passed');
    let strict = !(isArrayLike(obj) && isObject(obj[obj.length - 1]) && obj[obj.length - 1].strict == false);
    const _isEq = (_obj, _other) => strict ? _obj === _other : _obj == _other;
    for (let other of others) {
        if (_isEq(obj, other))
            return true;
    }
    return false;
    
}
*/
// true for string
function isArray(obj) {
    return obj && (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function');
}
function isEmptyArr(collection) {
    return isArray(collection) && getLength(collection) === 0;
}
function isEmptyObj(obj) {
    return isObject(obj) && Object.keys(obj).length === 0;
}
function isFunction(fn) {
    return fn && {}.toString.call(fn) === '[object Function]';
}
// *  underscore.js
function isObject(obj) {
    return typeof obj === 'object' && !!obj;
}
function shallowProperty(key) {
    return function (obj) {
        return obj == null ? void 0 : obj[key];
    };
}
function getLength(collection) {
    return shallowProperty('length')(collection);
}
/*const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

function isArrayLike(collection): boolean {
    const length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}
*/
// *  misc
// child extends sup
function extend(sup, child) {
    child.prototype = sup.prototype;
    const handler = {
        construct
    };
    // "new BoyCls"
    function construct(_, argArray) {
        const obj = new child;
        sup.apply(obj, argArray); // calls PersonCtor. Sets name
        child.apply(obj, argArray); // calls BoyCtor. Sets age
        return obj;
    }
    // @ts-ignore
    const proxy = new Proxy(child, handler);
    return proxy;
}
//# sourceMappingURL=all.js.map