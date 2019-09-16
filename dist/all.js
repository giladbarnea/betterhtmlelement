var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class BadArgumentsAmountError extends Error {
    constructor(expectedArgsNum, passedArgs, details) {
        const requiresExactNumOfArgs = !Array.isArray(expectedArgsNum);
        const validArgs = {};
        for (let [argname, argval] of Object.entries(passedArgs)) {
            if (argval)
                validArgs[argname] = argval;
        }
        const argNamesValues = Object.entries(validArgs).flatMap(([argname, argval]) => `${argname}: ${argval}`).join(', ');
        let message;
        if (requiresExactNumOfArgs) {
            message = `Didn't receive exactly ${expectedArgsNum} arg. `;
        }
        else {
            message = `Didn't receive between ${expectedArgsNum[0]} to ${expectedArgsNum[1]} args. `;
        }
        message += `Instead, out of ${Object.keys(passedArgs).length} received (${Object.keys(passedArgs)}), ${Object.keys(validArgs).length} had value: ${argNamesValues}. ${details ? 'Details: ' + details : ''}`;
        super(message);
    }
}
const SVG_NS_URI = 'http://www.w3.org/2000/svg';
// TODO: make BetterHTMLElement<T>, for use in eg child function
class BetterHTMLElement {
    constructor(elemOptions) {
        this._isSvg = false;
        this._listeners = {};
        const { tag, id, htmlElement, text, query, children, cls } = elemOptions;
        if ([tag, id, htmlElement, query].filter(x => x).length > 1) {
            throw new BadArgumentsAmountError(1, {
                tag,
                id,
                htmlElement,
                query
            });
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
            }
            else {
                this._htmlElement = document.createElement(tag);
            }
        }
        else if (id)
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
    /**For each `[styleAttr, styleVal]` pair, set the `style[styleAttr]` to `styleVal`.*/
    css(css) {
        for (let [styleAttr, styleVal] of enumerate(css))
            this.e.style[styleAttr] = styleVal;
        return this;
    }
    /**Remove the value of the passed style properties*/
    uncss(...removeProps) {
        let css = {};
        for (let prop of removeProps)
            css[prop] = '';
        return this.css(css);
    }
    is(element) {
        // https://api.jquery.com/is/
        throw new Error("NOT IMPLEMENTED");
    }
    class(cls) {
        if (cls === undefined) {
            return Array.from(this.e.classList);
        }
        else {
            if (this._isSvg)
                this.e.classList = [cls];
            else
                this.e.className = cls;
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
        this.e.classList.remove(cls);
        for (let c of clses)
            this.e.classList.remove(c);
        return this;
    }
    replaceClass(oldToken, newToken) {
        this.e.classList.replace(oldToken, newToken);
        return this;
    }
    toggleClass(cls, force) {
        this.e.classList.toggle(cls, force);
        return this;
    }
    hasClass(cls) {
        return this.e.classList.contains(cls);
    }
    // ***  Nodes
    /**Insert one or several `BetterHTMLElement`s or vanilla `Node`s just after `this`.*/
    after(...nodes) {
        if (nodes[0] instanceof BetterHTMLElement)
            for (let node of nodes)
                this.e.after(node.e);
        else
            for (let node of nodes)
                this.e.after(node); // TODO: test what happens when passed strings
        return this;
    }
    /**Insert `this` just after a `BetterHTMLElement` or vanilla `Node`s.*/
    insertAfter(node) {
        if (node instanceof BetterHTMLElement)
            node.e.after(this.e);
        else
            node.after(this.e);
        return this;
    }
    /**Insert one or several `BetterHTMLElement`s or vanilla `Node`s after the last child of `this`*/
    append(...nodes) {
        if (nodes[0] instanceof BetterHTMLElement)
            for (let node of nodes)
                this.e.append(node.e);
        else
            for (let node of nodes)
                this.e.append(node); // TODO: test what happens when passed strings
        return this;
    }
    /**Append `this` to a `BetterHTMLElement` or a vanilla `Node`*/
    appendTo(node) {
        if (node instanceof BetterHTMLElement)
            node.e.append(this.e);
        else
            node.append(this.e);
        return this;
    }
    /**Inserts one or several `BetterHTMLElement`s or vanilla `Node`s just before `this`*/
    before(...nodes) {
        if (nodes[0] instanceof BetterHTMLElement)
            for (let node of nodes)
                this.e.before(node.e);
        else
            for (let node of nodes)
                this.e.before(node); // TODO: test what happens when passed strings
        return this;
    }
    /**Insert `this` just before a `BetterHTMLElement` or vanilla `Node`s.*/
    insertBefore(node) {
        if (node instanceof BetterHTMLElement)
            node.e.before(this.e);
        else
            node.before(this.e);
        return this;
    }
    /**For each `[key, child]` pair, `append(child)` and store it in `this[key]`. */
    cacheAppend(keyChildObj) {
        for (let [key, child] of enumerate(keyChildObj)) {
            this.append(child);
            this[key] = child;
        }
        return this;
    }
    child(selector) {
        return new BetterHTMLElement({ htmlElement: this.e.querySelector(selector) });
    }
    replaceChild(newChild, oldChild) {
        this.e.replaceChild(newChild, oldChild);
        return this;
    }
    /**Return a `BetterHTMLElement` list of all children */
    children() {
        const childrenVanilla = Array.from(this.e.children);
        const toElem = (c) => new BetterHTMLElement({ htmlElement: c });
        return childrenVanilla.map(toElem);
    }
    clone(deep) {
        // @ts-ignore
        return new BetterHTMLElement({ htmlElement: this.e.cloneNode(deep) });
    }
    cacheChildren(keySelectorObj) {
        for (let [key, selector] of enumerate(keySelectorObj)) {
            if (typeof selector === 'object') {
                // only first because multiple selectors for single key aren't supported (ie can't do {right: {.right: {...}, .right2: {...}})
                let [subselector, subkeyselectorsObj] = Object.entries(selector)[0];
                this[key] = this.child(subselector);
                this[key].cacheChildren(subkeyselectorsObj);
            }
            else {
                this[key] = this.child(selector);
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
    // TODO: recursively yield children (unlike .children(), this doesn't return only the first level)
    find() {
        // https://api.jquery.com/find/
        throw new Error("NOT IMPLEMENTED");
    }
    first() {
        // https://api.jquery.com/first/
        // this.e.firstChild
        throw new Error("NOT IMPLEMENTED");
    }
    last() {
        // https://api.jquery.com/last/
        // this.e.lastChild
        throw new Error("NOT IMPLEMENTED");
    }
    next() {
        throw new Error("NOT IMPLEMENTED");
    }
    not() {
        throw new Error("NOT IMPLEMENTED");
    }
    parent() {
        throw new Error("NOT IMPLEMENTED");
    }
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
        return this;
    }
    /** Add a `pointerdown` event listener if browser supports `pointerdown`, else send `mousedown` (safari). */
    pointerdown(fn, options) {
        let action;
        try {
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
            // this.e.addEventListener('click', fn, options);
            // return this;
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
    keyup() {
        // https://api.jquery.com/keyup/
        throw new Error("NOT IMPLEMENTED");
    }
    keypress() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED");
    }
    hover() {
        // https://api.jquery.com/hover/
        // binds to both mouseenter and mouseleave
        // https://stackoverflow.com/questions/17589420/when-to-choose-mouseover-and-hover-function
        throw new Error("NOT IMPLEMENTED");
    }
    mousedown() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED");
    }
    mouseleave() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED");
    }
    mousemove() {
        // https://api.jquery.com/keypress/
        throw new Error("NOT IMPLEMENTED");
    }
    mouseout(fn, options) {
        if (fn === undefined)
            throw new Error("NOT IMPLEMENTED");
        else
            return this.on({ mouseout: fn }, options);
    }
    mouseover(fn, options) {
        if (fn === undefined)
            throw new Error("NOT IMPLEMENTED");
        else
            return this.on({ mouseover: fn }, options);
    }
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
        if (parse)
            return JSON.parse(data);
        else
            return data;
    }
    // **  Fade
    fade(dur, to) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield wait(dur);
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
                    if (isFadeOut)
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
            yield wait(dur);
            return this;
        });
    }
    fadeOut(dur) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fade(dur, 0);
        });
    }
    fadeIn(dur) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fade(dur, 1);
        });
    }
}
customElements.define('better-html-element', BetterHTMLElement);
class Div extends BetterHTMLElement {
    /**Create a Div element. Optionally set its id, text or cls.*/
    constructor({ id, text, cls } = {}) {
        super({ tag: "div", text, cls });
        if (id)
            this.id(id);
    }
}
class Span extends BetterHTMLElement {
    /**Create a Span element. Optionally set its id, text or cls.*/
    constructor({ id, text, cls } = {}) {
        super({ tag: 'span', text, cls });
        if (id)
            this.id(id);
    }
}
class Img extends BetterHTMLElement {
    /**Create an Img element. Optionally set its id, src or cls.*/
    constructor({ id, src, cls }) {
        super({ tag: 'img', cls });
        if (id)
            this.id(id);
        if (src)
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
elem({
    id: '#news', children: {
        mainImageContainer: '#main_image_container',
        news: {
            '#news': {
                title: '.title',
                date: '.date',
                content: '.content'
            }
        },
        radios: '#radios',
    }
});
elem({ id: '#news' }).cacheChildren({
    mainImageContainer: '#main_image_container',
    news: {
        '#news': {
            title: '.title',
            date: '.date',
            content: '.content'
        }
    },
    radios: '#radios',
});
function* enumerate(obj) {
    if (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function') {
        let i = 0;
        for (let x of obj) {
            yield [i, x];
        }
    }
    else {
        for (let prop in obj) {
            yield [prop, obj[prop]];
        }
    }
}
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=all.js.map