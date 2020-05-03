function getArgNamesValues(argsWithValues) {
    return Object.entries(argsWithValues)
        .flatMap(([argname, argval]) => `${argname}: ${argval}`)
        .join('", "');
}
function getArgsWithValues(passedArgs) {
    const argsWithValues = {};
    for (let [argname, argval] of Object.entries(passedArgs)) {
        if (argval !== undefined) {
            argsWithValues[argname] = argval;
        }
    }
    return argsWithValues;
}
class MutuallyExclusiveArgs extends Error {
    constructor(passedArgs, details) {
        const argsWithValues = getArgsWithValues(passedArgs);
        const argNamesValues = getArgNamesValues(argsWithValues);
        let message = `Didn't receive exactly one arg. `;
        message += `Instead, out of ${Object.keys(passedArgs).length} received (${Object.keys(passedArgs)}), ${Object.keys(argsWithValues).length} had value: "${argNamesValues}". ${details ? 'Details: ' + details : ''}`;
        super(message);
    }
}
class NotEnoughArgs extends Error {
    constructor(expected, passedArgs, details) {
        const argsWithValues = getArgsWithValues(passedArgs);
        const argNamesValues = getArgNamesValues(argsWithValues);
        let message;
        if (isArray(expected)) {
            let [min, max] = expected;
            if (max === undefined) {
                message = `Didn't receive enough args: expected at least ${min}. `;
            }
            else {
                message = `Didn't receive enough args: expected between ${min} and ${max}. `;
            }
        }
        else {
            message = `Didn't receive enough args: expected exactly ${expected}. `;
        }
        message += `Out of ${Object.keys(passedArgs).length} received (${Object.keys(passedArgs)}), ${Object.keys(argsWithValues).length} had value: "${argNamesValues}". ${details ? 'Details: ' + details : ''}`;
        super(message);
    }
}
define("typings/misc", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const a = undefined;
    const b = undefined;
    const foo = (tag) => document.createElement(tag);
    const baz = (query) => document.querySelector(query);
    const bar = (query) => document.querySelector(query);
});
define("util", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.enumerate = enumerate;
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function anyValue(obj) {
        let array;
        if (isObject(obj)) {
            array = Object.values(obj);
        }
        else if (isArray(obj)) {
            array = obj;
        }
        else {
            throw new TypeError(`expected array or obj, got: ${typeof obj}`);
        }
        return array.filter(x => Boolean(x)).length > 0;
    }
    exports.anyValue = anyValue;
    function noValue(obj) {
        let array;
        if (isObject(obj)) {
            array = Object.values(obj);
        }
        else if (isArray(obj)) {
            array = obj;
        }
        else {
            throw new TypeError(`expected array or obj, got: ${typeof obj}`);
        }
        return array.filter(x => Boolean(x)).length === 0;
    }
    exports.noValue = noValue;
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
    exports.isFunction = isFunction;
    function isObject(obj) {
        return typeof obj === 'object' && !!obj;
    }
    exports.isObject = isObject;
    function shallowProperty(key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        };
    }
    function getLength(collection) {
        return shallowProperty('length')(collection);
    }
});
define("typings/ctors", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("index", ["require", "exports", "util"], function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const SVG_NS_URI = 'http://www.w3.org/2000/svg';
    class BetterHTMLElement {
        constructor(elemOptions) {
            this._isSvg = false;
            this._listeners = {};
            this._cachedChildren = {};
            const { tag, cls, setid, htmlElement, byid, query, children } = elemOptions;
            if ([byid, htmlElement, query].filter(x => Boolean(x)).length > 1) {
                throw new MutuallyExclusiveArgs({
                    byid, query, htmlElement
                }, `Choose only one way to get an existing element; by its id, query, or actual element`);
            }
            if (tag !== undefined && util_1.anyValue([children, byid, htmlElement, query])) {
                throw new MutuallyExclusiveArgs({
                    tag,
                    byid,
                    htmlElement,
                    query
                }, `Either create a new elem via "tag", or get an existing one via either "byid", "htmlElement", or "query" (and maybe cache its "children")`);
            }
            if (util_1.anyValue([tag, cls, setid]) && util_1.anyValue([children, byid, htmlElement, query])) {
                throw new MutuallyExclusiveArgs({
                    group1: { cls, setid },
                    group2: { children, byid, htmlElement, query }
                }, `Can't have args from both groups`);
            }
            if (util_1.noValue([tag, cls, setid]) && util_1.noValue([children, byid, htmlElement, query])) {
                throw new NotEnoughArgs([1], {
                    group1: { cls, setid },
                    group2: { children, byid, htmlElement, query }
                }, `Expecting at least one arg from a given group`);
            }
            if (tag !== undefined) {
                if (['svg', 'path'].includes(tag.toLowerCase())) {
                    this._isSvg = true;
                    this._htmlElement = document.createElementNS(SVG_NS_URI, tag);
                }
                else {
                    this._htmlElement = document.createElement(tag);
                }
            }
            else if (byid !== undefined) {
                this._htmlElement = document.getElementById(byid);
            }
            else {
                if (query !== undefined) {
                    this._htmlElement = document.querySelector(query);
                }
                else {
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
        get e() {
            return this._htmlElement;
        }
        wrapSomethingElse(newHtmlElement) {
            this._cachedChildren = {};
            if (newHtmlElement instanceof BetterHTMLElement) {
                this._htmlElement.replaceWith(newHtmlElement.e);
                this._htmlElement = newHtmlElement.e;
                for (let [_key, _cachedChild] of util_1.enumerate(newHtmlElement._cachedChildren)) {
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
                for (let [styleAttr, styleVal] of util_1.enumerate(css)) {
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
            else if (util_1.isFunction(cls)) {
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
            if (util_1.isFunction(cls)) {
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
            if (util_1.isFunction(oldToken)) {
                this.e.classList.replace(this.class(oldToken), newToken);
            }
            else {
                this.e.classList.replace(oldToken, newToken);
            }
            return this;
        }
        toggleClass(cls, force) {
            if (util_1.isFunction(cls)) {
                this.e.classList.toggle(this.class(cls), force);
            }
            else {
                this.e.classList.toggle(cls, force);
            }
            return this;
        }
        hasClass(cls) {
            if (util_1.isFunction(cls)) {
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
                for (let [key, child] of util_1.enumerate(keyChildPairs)) {
                    _cacheAppend(key, child);
                }
            }
            return this;
        }
        child(selector) {
            const htmlElement = this.e.querySelector(selector);
            const tag = htmlElement.tagName.toLowerCase();
            const bhe = wrapWithBHE(tag, htmlElement);
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
            for (let [key, value] of util_1.enumerate(map)) {
                let type = typeof value;
                if (util_1.isObject(value)) {
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
            for (let [evType, evFn] of util_1.enumerate(evTypeFnPairs)) {
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
                for (let [attr, val] of util_1.enumerate(attrValPairs)) {
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
    exports.BetterHTMLElement = BetterHTMLElement;
    class Div extends BetterHTMLElement {
        constructor({ setid, cls, byid, text, query, htmlElement, children }) {
            if (util_1.noValue(arguments[0])) {
                throw new NotEnoughArgs([1], arguments[0]);
            }
            if (htmlElement !== undefined) {
                super({ htmlElement, children });
            }
            else if (byid !== undefined) {
                super({ byid, children });
            }
            else if (query !== undefined) {
                super({ query, children });
            }
            else {
                super({ tag: "div", cls, setid });
            }
            if (text !== undefined) {
                this.text(text);
            }
        }
    }
    exports.Div = Div;
    class Button extends BetterHTMLElement {
        constructor({ setid, cls, text, byid, query, htmlElement, children }) {
            if (util_1.noValue(arguments[0])) {
                throw new NotEnoughArgs([1], arguments[0]);
            }
            if (htmlElement !== undefined) {
                super({ htmlElement, children });
            }
            else if (byid !== undefined) {
                super({ byid, children });
            }
            else if (query !== undefined) {
                super({ query, children });
            }
            else {
                super({ tag: "button", setid, cls });
            }
            if (text !== undefined) {
                this.text(text);
            }
        }
    }
    exports.Button = Button;
    class Paragraph extends BetterHTMLElement {
        constructor({ setid, cls, text, byid, query, htmlElement, children }) {
            if (util_1.noValue(arguments[0])) {
                throw new NotEnoughArgs([1], arguments[0]);
            }
            if (htmlElement !== undefined) {
                super({ htmlElement, children });
            }
            else if (byid !== undefined) {
                super({ byid, children });
            }
            else if (query !== undefined) {
                super({ query, children });
            }
            else {
                super({ tag: "p", setid, cls });
            }
            if (text !== undefined) {
                this.text(text);
            }
        }
    }
    exports.Paragraph = Paragraph;
    class Input extends BetterHTMLElement {
        constructor({ setid, cls, type, placeholder, byid, query, htmlElement, children }) {
            if (util_1.noValue(arguments[0])) {
                throw new NotEnoughArgs([1], arguments[0]);
            }
            if (htmlElement !== undefined) {
                super({ htmlElement, children });
            }
            else if (byid !== undefined) {
                super({ byid, children });
            }
            else if (query !== undefined) {
                super({ query, children });
            }
            else {
                super({ tag: "input", cls, setid });
            }
            if (type !== undefined) {
                this._htmlElement.type = type;
            }
            if (placeholder !== undefined) {
                if (type) {
                    if (type === "number" && typeof placeholder !== "number") {
                        console.warn(`placeholder type is ${typeof placeholder} but input type is number. ignoring`);
                    }
                    else if (type !== "text") {
                        console.warn(`placeholder type is ${typeof placeholder} but input type not number nor text. ignoring`);
                    }
                    else {
                        this.placeholder(placeholder);
                    }
                }
            }
        }
        check() {
            this.e.checked = true;
            return this;
        }
        uncheck() {
            this.e.checked = false;
            return this;
        }
        toggleChecked(on) {
            if (on) {
                return this.check();
            }
            else {
                return this.uncheck();
            }
        }
        get checked() {
            return this.e.checked;
        }
        disable() {
            this.e.disabled = true;
            return this;
        }
        enable() {
            this.e.disabled = false;
            return this;
        }
        toggleEnabled(on) {
            if (on) {
                return this.enable();
            }
            else {
                return this.disable();
            }
        }
        get disabled() {
            return this.e.disabled;
        }
        value(val) {
            if (val === undefined) {
                return this.e.value;
            }
            else {
                this.e.value = val;
                return this;
            }
        }
        placeholder(val) {
            if (val === undefined) {
                return this.e.placeholder;
            }
            else {
                this.e.placeholder = val;
                return this;
            }
        }
    }
    exports.Input = Input;
    class Span extends BetterHTMLElement {
        constructor({ setid, cls, text, byid, query, htmlElement, children }) {
            if (util_1.noValue(arguments[0])) {
                throw new NotEnoughArgs([1], arguments[0]);
            }
            if (htmlElement !== undefined) {
                super({ htmlElement, children });
            }
            else if (byid !== undefined) {
                super({ byid, children });
            }
            else if (query !== undefined) {
                super({ query, children });
            }
            else {
                super({ tag: "span", setid, cls });
            }
            if (text !== undefined) {
                this.text(text);
            }
        }
    }
    exports.Span = Span;
    class Img extends BetterHTMLElement {
        constructor({ setid, cls, src, byid, query, htmlElement, children }) {
            if (util_1.noValue(arguments[0])) {
                throw new NotEnoughArgs([1], arguments[0]);
            }
            if (htmlElement !== undefined) {
                super({ htmlElement, children });
            }
            else if (byid !== undefined) {
                super({ byid, children });
            }
            else if (query !== undefined) {
                super({ query, children });
            }
            else {
                super({ tag: "img", setid, cls });
            }
            if (src !== undefined) {
                this.src(src);
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
    exports.Img = Img;
    class Anchor extends BetterHTMLElement {
        constructor({ setid, cls, text, href, target, byid, query, htmlElement, children }) {
            if (util_1.noValue(arguments[0])) {
                throw new NotEnoughArgs([1], arguments[0]);
            }
            if (htmlElement !== undefined) {
                super({ htmlElement, children });
            }
            else if (byid !== undefined) {
                super({ byid, children });
            }
            else if (query !== undefined) {
                super({ query, children });
            }
            else {
                super({ tag: "a", setid, cls });
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
    exports.Anchor = Anchor;
    function elem(elemOptions) {
        return new BetterHTMLElement(elemOptions);
    }
    exports.elem = elem;
    function span({ setid, cls, text, byid, query, htmlElement, children } = {}) {
        return new Span({ setid, cls, text, byid, query, htmlElement, children });
    }
    function div({ setid, cls, text, byid, query, htmlElement, children } = {}) {
        return new Div({ setid, cls, text, byid, query, htmlElement, children });
    }
    function button({ setid, cls, text, byid, query, htmlElement, children } = {}) {
        return new Button({ setid, cls, text, byid, query, htmlElement, children });
    }
    function input({ setid, cls, type, placeholder, byid, query, htmlElement, children } = {}) {
        return new Input({ setid, cls, type, placeholder, byid, query, htmlElement, children });
    }
    function img({ setid, cls, src, byid, query, htmlElement, children } = {}) {
        return new Img({ setid, cls, src, byid, query, htmlElement, children });
    }
    function paragraph({ setid, cls, text, byid, query, htmlElement, children } = {}) {
        return new Paragraph({ setid, cls, text, byid, query, htmlElement, children });
    }
    function anchor({ setid, cls, text, href, target, byid, query, htmlElement, children } = {}) {
        return new Anchor({ setid, cls, text, href, target, byid, query, htmlElement, children });
    }
    const query_input = elem({ query: 'input' });
    const tag_input = elem({ tag: 'input' });
    const aa = undefined;
    const bb = undefined;
    const cc = undefined;
    const dd = undefined;
    function wrapWithBHE(tag, htmlElement) {
        switch (tag) {
            case 'div':
                let e = div({ htmlElement: htmlElement });
                return e;
            case 'a':
                return anchor({ htmlElement });
            case 'p':
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
});
//# sourceMappingURL=all.js.map