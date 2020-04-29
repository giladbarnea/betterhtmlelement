class MutuallyExclusiveArgs extends Error {
    constructor(passedArgs, details) {
        const argsWithValues = MutuallyExclusiveArgs.getArgsWithValues(passedArgs);
        const argNamesValues = MutuallyExclusiveArgs.getArgNamesValues(argsWithValues);
        let message = `Didn't receive exactly one arg.`;
        message += `Instead, out of ${Object.keys(passedArgs).length} received (${Object.keys(passedArgs)}), ${Object.keys(argsWithValues).length} had value: "${argNamesValues}". ${details ? 'Details: ' + details : ''}`;
        super(message);
    }
    static getArgNamesValues(argsWithValues) {
        return Object.entries(argsWithValues)
            .flatMap(([argname, argval]) => `${argname}: ${argval}`)
            .join('", "');
    }
    static getArgsWithValues(passedArgs) {
        const argsWithValues = {};
        for (let [argname, argval] of Object.entries(passedArgs)) {
            if (argval !== undefined) {
                argsWithValues[argname] = argval;
            }
        }
        return argsWithValues;
    }
}
const SVG_NS_URI = 'http://www.w3.org/2000/svg';
class BetterHTMLElement {
    constructor(elemOptions) {
        this._isSvg = false;
        this._listeners = {};
        this._cachedChildren = {};
        const { create, id, htmlElement, text, query, children, cls } = elemOptions;
        if ([create, id, htmlElement, query].filter(x => x !== undefined).length > 1) {
            throw new MutuallyExclusiveArgs({
                create,
                id,
                htmlElement,
                query
            });
        }
        if (create !== undefined && children !== undefined) {
            throw new MutuallyExclusiveArgs({
                create,
                children
            }, '"children" and "create" options are mutually exclusive, because create implies creating a new element and children implies getting an existing one.');
        }
        this._htmlElement = BetterHTMLElement._buildHtmlElement(create, id, query, htmlElement);
        if (text !== undefined) {
            this.text(text);
        }
        if (cls !== undefined) {
            this.class(cls);
        }
        if (children !== undefined) {
            this.cacheChildren(children);
        }
    }
    static _buildHtmlElement(create, id, query, htmlElement) {
        if (create !== undefined) {
            if (['svg', 'path'].includes(create.toLowerCase())) {
                throw new Error("Not impl");
                this._isSvg = true;
                this._htmlElement = document.createElementNS(SVG_NS_URI, create);
            }
            else {
                return document.createElement(create);
            }
        }
        if (id !== undefined) {
            return document.getElementById(id);
        }
        if (query !== undefined) {
            return document.querySelector(query);
        }
        if (htmlElement !== undefined) {
            return htmlElement;
        }
        throw new MutuallyExclusiveArgs({
            create,
            id,
            htmlElement,
            query
        });
    }
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
            this.on(Object.assign(Object.assign({}, this._listeners), newHtmlElement._listeners));
        }
        else {
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
            for (let [styleAttr, styleVal] of enumerate(css)) {
                this.e.style[styleAttr] = styleVal;
            }
            return this;
        }
    }
    uncss(...removeProps) {
        let css = {};
        for (let prop of removeProps) {
            css[prop] = '';
        }
        return this.css(css);
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
        for (let c of clses) {
            this.e.classList.add(c);
        }
        return this;
    }
    removeClass(cls, ...clses) {
        if (isFunction(cls)) {
            this.e.classList.remove(this.class(cls));
            for (let c of clses) {
                this.e.classList.remove(this.class(c));
            }
        }
        else {
            this.e.classList.remove(cls);
            for (let c of clses) {
                this.e.classList.remove(c);
            }
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
        if (isFunction(cls)) {
            this.e.classList.toggle(this.class(cls), force);
        }
        else {
            this.e.classList.toggle(cls, force);
        }
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
    after(...nodes) {
        for (let node of nodes) {
            if (node instanceof BetterHTMLElement) {
                this.e.after(node.e);
            }
            else {
                this.e.after(node);
            }
        }
        return this;
    }
    insertAfter(node) {
        if (node instanceof BetterHTMLElement) {
            node.e.after(this.e);
        }
        else {
            node.after(this.e);
        }
        return this;
    }
    append(...nodes) {
        for (let node of nodes) {
            if (node instanceof BetterHTMLElement) {
                this.e.append(node.e);
            }
            else {
                if (node instanceof Node) {
                    this.e.append(node);
                }
                else {
                    if (Array.isArray(node)) {
                        this.cacheAppend([node]);
                    }
                    else {
                        this.cacheAppend(node);
                    }
                }
            }
        }
        return this;
    }
    appendTo(node) {
        if (node instanceof BetterHTMLElement) {
            node.e.append(this.e);
        }
        else {
            node.append(this.e);
        }
        return this;
    }
    before(...nodes) {
        for (let node of nodes) {
            if (node instanceof BetterHTMLElement) {
                this.e.before(node.e);
            }
            else {
                this.e.before(node);
            }
        }
        return this;
    }
    insertBefore(node) {
        if (node instanceof BetterHTMLElement) {
            node.e.before(this.e);
        }
        else {
            node.before(this.e);
        }
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
            for (let [key, child] of keyChildPairs) {
                _cacheAppend(key, child);
            }
        }
        else {
            for (let [key, child] of enumerate(keyChildPairs)) {
                _cacheAppend(key, child);
            }
        }
        return this;
    }
    child(selector) {
        const htmlElement = this.e.querySelector(selector);
        const tag = htmlElement.tagName.toLowerCase();
        const bhe = bheFactory(tag, htmlElement);
        return bhe;
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
        return new BetterHTMLElement({ htmlElement: this.e.cloneNode(deep) });
    }
    cacheChildren(map) {
        for (let [key, value] of enumerate(map)) {
            let type = typeof value;
            if (isObject(value)) {
                if (value instanceof BetterHTMLElement) {
                    this._cache(key, value);
                }
                else {
                    let entries = Object.entries(value);
                    if (entries[1] !== undefined) {
                        console.warn(`cacheChildren() received recursive obj with more than 1 selector for a key. Using only 0th selector`, {
                            key,
                            "multiple selectors": entries.map(e => e[0]),
                            value,
                            this: this
                        });
                    }
                    let [selector, obj] = entries[0];
                    this._cache(key, this.child(selector));
                    this[key].cacheChildren(obj);
                }
            }
            else if (type === "string") {
                this._cache(key, this.child(value));
            }
            else {
                console.warn(`cacheChildren, bad value type: "${type}". key: "${key}", value: "${value}". map:`, map);
            }
        }
        return this;
    }
    empty() {
        while (this.e.firstChild) {
            this.e.removeChild(this.e.firstChild);
        }
        return this;
    }
    remove() {
        this.e.remove();
        return this;
    }
    on(evTypeFnPairs, options) {
        for (let [evType, evFn] of enumerate(evTypeFnPairs)) {
            const _f = function _f(evt) {
                evFn(evt);
            };
            this.e.addEventListener(evType, _f, options);
            this._listeners[evType] = _f;
        }
        return this;
    }
    touchstart(fn, options) {
        this.e.addEventListener('touchstart', function _f(ev) {
            ev.preventDefault();
            fn(ev);
            if (options && options.once) {
                this.removeEventListener('touchstart', _f);
            }
        }, options);
        return this;
    }
    pointerdown(fn, options) {
        let action;
        try {
            action = window.PointerEvent ? 'pointerdown' : 'mousedown';
        }
        catch (e) {
            action = 'mousedown';
        }
        const _f = function _f(ev) {
            ev.preventDefault();
            fn(ev);
            if (options && options.once) {
                this.removeEventListener(action, _f);
            }
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
    change(fn, options) {
        return this.on({ change: fn }, options);
    }
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
        return this.on({ keydown: fn }, options);
    }
    mouseout(fn, options) {
        return this.on({ mouseout: fn }, options);
    }
    mouseover(fn, options) {
        return this.on({ mouseover: fn }, options);
    }
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
            for (let [attr, val] of enumerate(attrValPairs)) {
                this.e.setAttribute(attr, val);
            }
            return this;
        }
    }
    removeAttr(qualifiedName, ...qualifiedNames) {
        let _removeAttribute;
        if (this._isSvg) {
            _removeAttribute = (qualifiedName) => this.e.removeAttributeNS(SVG_NS_URI, qualifiedName);
        }
        else {
            _removeAttribute = (qualifiedName) => this.e.removeAttribute(qualifiedName);
        }
        _removeAttribute(qualifiedName);
        for (let qn of qualifiedNames) {
            _removeAttribute(qn);
        }
        return this;
    }
    data(key, parse = true) {
        const data = this.e.getAttribute(`data-${key}`);
        if (parse === true) {
            return JSON.parse(data);
        }
        else {
            return data;
        }
    }
}
class Div extends BetterHTMLElement {
    constructor({ id, text, cls, htmlElement } = {}) {
        if (htmlElement !== undefined) {
            super({ text, cls, htmlElement });
        }
        else {
            super({ create: 'div', text, cls });
        }
        if (id !== undefined) {
            this.id(id);
        }
    }
}
class Button extends BetterHTMLElement {
    constructor({ id, text, cls, htmlElement } = {}) {
        if (htmlElement !== undefined) {
            super({ text, cls, htmlElement });
        }
        else {
            super({ create: 'button', text, cls });
        }
        if (id !== undefined) {
            this.id(id);
        }
    }
}
class Paragraph extends BetterHTMLElement {
    constructor({ id, text, cls, htmlElement } = {}) {
        if (htmlElement !== undefined) {
            super({ text, cls, htmlElement });
        }
        else {
            super({ create: 'p', text, cls });
        }
        if (id !== undefined) {
            this.id(id);
        }
    }
}
class Input extends BetterHTMLElement {
    constructor({ id, cls, type, htmlElement } = {}) {
        if (htmlElement !== undefined) {
            super({ cls, htmlElement });
        }
        else {
            super({ create: 'input', cls });
        }
        if (id !== undefined) {
            this.id(id);
        }
        if (type !== undefined) {
            this._htmlElement.type = type;
        }
    }
    check() {
        return this.attr({ checked: true });
    }
    uncheck() {
        return this.removeAttr('checked');
    }
    checked() {
        const rv = this.e.checked;
        console.log('this.e.checked: ', rv);
        return rv;
    }
}
class Span extends BetterHTMLElement {
    constructor({ id, text, cls, htmlElement } = {}) {
        if (htmlElement !== undefined) {
            super({ text, cls, htmlElement });
        }
        else {
            super({ create: 'span', text, cls });
        }
        if (id !== undefined) {
            this.id(id);
        }
    }
}
class Img extends BetterHTMLElement {
    constructor({ id, src, cls, htmlElement }) {
        if (htmlElement !== undefined) {
            super({ cls, htmlElement });
        }
        else {
            super({ create: 'img', cls });
        }
        if (id !== undefined) {
            this.id(id);
        }
        if (src !== undefined) {
            this._htmlElement.src = src;
        }
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
    constructor({ id, text, cls, href, htmlElement } = {}) {
        if (htmlElement !== undefined) {
            super({ text, cls, htmlElement });
        }
        else {
            super({ create: 'a', text, cls });
        }
        if (id !== undefined) {
            this.id(id);
        }
        if (href !== undefined) {
            this.href(href);
        }
    }
    href(val) {
        if (val === undefined) {
            return this.attr('href');
        }
        else {
            return this.attr({ href: val });
        }
    }
    target(val) {
        if (val === undefined) {
            return this.attr('target');
        }
        else {
            return this.attr({ target: val });
        }
    }
}
function elem(elemOptions) {
    return new BetterHTMLElement(elemOptions);
}
function span({ id, text, cls, htmlElement } = {}) {
    return new Span({ id, text, cls, htmlElement });
}
function div({ id, text, cls, htmlElement } = {}) {
    return new Div({ id, text, cls, htmlElement });
}
function button({ id, text, cls, htmlElement } = {}) {
    return new Button({ id, text, cls, htmlElement });
}
function input({ id, cls, type, htmlElement } = {}) {
    return new Input({ id, cls, type, htmlElement });
}
function img({ id, src, cls, htmlElement } = {}) {
    return new Img({ id, src, cls, htmlElement });
}
function paragraph({ id, text, cls, htmlElement } = {}) {
    return new Paragraph({ id, text, cls, htmlElement });
}
function anchor({ id, text, cls, href, htmlElement } = {}) {
    return new Anchor({ id, text, cls, href, htmlElement });
}
function bheFactory(create, htmlElement) {
    switch (create) {
        case 'div':
            return div({ htmlElement });
        case 'anchor':
            return anchor({ htmlElement });
        case 'paragraph':
            return paragraph({ htmlElement });
        case 'img':
            return img({ htmlElement });
        case 'input':
            return input({ htmlElement });
        case 'button':
            return button({ htmlElement });
        case 'span':
            return span({ htmlElement });
        default:
            return elem({ htmlElement });
    }
}
function enumerate(obj) {
    let typeofObj = typeof obj;
    if (obj === undefined
        || isEmptyObj(obj)
        || isEmptyArr(obj)
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
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function isArray(obj) {
    return typeof obj !== "string" && (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function');
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
//# sourceMappingURL=all.js.map