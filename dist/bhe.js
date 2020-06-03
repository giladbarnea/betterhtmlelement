function getArgsFullRepr(argsWithValues) {
    return Object.entries(argsWithValues)
        .flatMap(([argname, argval]) => `${argname}: ${isObject(argval) ? `{${getArgsFullRepr(argval)}}` : argval}`)
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
function summary(argset) {
    const argsWithValues = getArgsWithValues(argset);
    const argsFullRepr = getArgsFullRepr(argsWithValues);
    let argNames = Object.keys(argset);
    return `${argNames.length} args (${argNames}); ${Object.keys(argsWithValues).length} had value: "${argsFullRepr}".\n`;
}
class MutuallyExclusiveArgs extends Error {
    constructor(passedArgs, details) {
        let message = `Didn't receive exactly one arg`;
        if (isArray(passedArgs)) {
            message += ` from the following mutually exclusive sets of args.\n`;
            for (let [i, argset] of enumerate(passedArgs)) {
                message += `Out of set #${i + 1}, which consists of ${summary(argset)}`;
            }
        }
        else {
            message += ` from the following mutually exclusive set of args.\nOut of ${summary(passedArgs)}`;
        }
        if (details) {
            message += `Details: ${details}`;
        }
        super(message);
    }
}
class NotEnoughArgs extends Error {
    constructor(expected, passedArgs, relation) {
        let message;
        if (isArray(expected)) {
            let [min, max] = expected;
            if (max === undefined) {
                message = `Didn't receive enough args: expected at least ${min}`;
            }
            else {
                message = `Didn't receive enough args: expected between ${min} and ${max}`;
            }
        }
        else {
            message = `Didn't receive enough args: expected exactly ${expected}`;
        }
        if (isArray(passedArgs)) {
            message += ` from ${relation} set of arguments.\n`;
            for (let [i, argset] of enumerate(passedArgs)) {
                message += `Out of set #${i + 1}, which consists of ${summary(argset)}`;
            }
        }
        else {
            message += ` from the following set of args.\nOut of ${summary(passedArgs)}`;
        }
        super(message);
    }
}
const SVG_NS_URI = 'http://www.w3.org/2000/svg';
class BetterHTMLElement {
    constructor(elemOptions) {
        this._isSvg = false;
        this._listeners = {};
        this._cachedChildren = {};
        let { tag, cls, setid, htmlElement, byid, query, children } = elemOptions;
        if ([byid, htmlElement, query, tag].filter(x => x !== undefined).length > 1) {
            throw new MutuallyExclusiveArgs({
                byid, query, htmlElement, tag
            }, 'Either wrap an existing element by passing one of `byid` / `query` / `htmlElement`, or create a new one by passing `tag`.');
        }
        if (anyDefined([tag, cls, setid]) && anyDefined([children, byid, htmlElement, query])) {
            throw new MutuallyExclusiveArgs([
                { tag, cls, setid },
                { children, byid, htmlElement, query }
            ], `Can't have args from both sets`);
        }
        if (allUndefined([tag, byid, htmlElement, query])) {
            throw new NotEnoughArgs(1, { tag, byid, htmlElement, query }, 'either');
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
        else {
            if (byid !== undefined) {
                if (byid.startsWith('#')) {
                    console.warn(`param 'byid' starts with '#', stripping it: ${byid}`);
                    byid = byid.substr(1);
                }
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
        }
        if (!bool(this._htmlElement)) {
            throw new Error(`${this} constructor ended up with no 'this._htmlElement'. Passed options: ${summary(elemOptions)}`);
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
    static wrapWithBHE(element) {
        const tag = element.tagName.toLowerCase();
        if (tag === 'div') {
            return div({ htmlElement: element });
        }
        else if (tag === 'a') {
            return anchor({ htmlElement: element });
        }
        else if (tag === 'p') {
            return paragraph({ htmlElement: element });
        }
        else if (tag === 'img') {
            return img({ htmlElement: element });
        }
        else if (tag === 'input') {
            if (element.type === "text") {
                return new TextInput({ htmlElement: element });
            }
            else if (element.type === "checkbox") {
                return new CheckboxInput({ htmlElement: element });
            }
            else {
                return input({ htmlElement: element });
            }
        }
        else if (tag === 'button') {
            return button({ htmlElement: element });
        }
        else if (tag === 'span') {
            return span({ htmlElement: element });
        }
        else if (tag === 'select') {
            return select({ htmlElement: element });
        }
        else {
            return elem({ htmlElement: element });
        }
    }
    toString() {
        var _a, _b;
        const proto = Object.getPrototypeOf(this);
        const protoStr = proto.constructor.toString();
        let str = protoStr.substring(6, protoStr.indexOf('{') - 1);
        let tag = (_a = this.e) === null || _a === void 0 ? void 0 : _a.tagName;
        let id = this.id();
        let classList = (_b = this.e) === null || _b === void 0 ? void 0 : _b.classList;
        if (anyTruthy([id, classList, tag])) {
            str += ` (`;
            if (tag) {
                str += `<${tag.toLowerCase()}>`;
            }
            if (id) {
                str += `#${id}`;
            }
            if (classList) {
                str += `.${classList}`;
            }
            str += `)`;
        }
        return str;
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
        var _a;
        if (id === undefined) {
            return (_a = this.e) === null || _a === void 0 ? void 0 : _a.id;
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
    _cls() {
        return BetterHTMLElement;
    }
    child(selector, bheCls) {
        const htmlElement = this.e.querySelector(selector);
        if (htmlElement === null) {
            console.warn(`${this}.child(${selector}): no child. returning undefined`);
            return undefined;
        }
        let bhe;
        if (bheCls === undefined) {
            bhe = this._cls().wrapWithBHE(htmlElement);
        }
        else {
            bhe = new bheCls({ htmlElement });
        }
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
        return childrenVanilla.map(this._cls().wrapWithBHE);
    }
    clone(deep) {
        console.warn(`${this}.clone() doesnt return a matching BHE subtype, but a regular BHE`);
        return new BetterHTMLElement({ htmlElement: this.e.cloneNode(deep) });
    }
    cacheChildren(childrenObj) {
        for (let [key, value] of enumerate(childrenObj)) {
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
                    if (isFunction(obj)) {
                        let bhe = this.child(selector, obj);
                        this._cache(key, bhe);
                    }
                    else {
                        this._cache(key, this.child(selector));
                        this[key].cacheChildren(obj);
                    }
                }
            }
            else if (type === "string") {
                let match = /<(\w+)>$/.exec(value);
                if (match) {
                    let tagName = match[1];
                    const htmlElements = [...this.e.getElementsByTagName(tagName)];
                    let bhes = [];
                    for (let htmlElement of htmlElements) {
                        bhes.push(this._cls().wrapWithBHE(htmlElement));
                    }
                    this._cache(key, bhes);
                }
                else {
                    this._cache(key, this.child(value));
                }
            }
            else {
                console.warn(`cacheChildren, bad value type: "${type}". key: "${key}", value: "${value}". childrenObj:`, childrenObj);
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
        return this.on({ mouseover: fn });
    }
    off(event) {
        this.e.removeEventListener(event, this._listeners[event]);
        return this;
    }
    allOff() {
        for (let i = 0; i < Object.keys(this._listeners).length; i++) {
            let event = this._listeners[i];
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
    _cache(key, child) {
        const oldchild = this._cachedChildren[key];
        if (oldchild !== undefined) {
            console.warn(`Overwriting this._cachedChildren[${key}]!`, 'old value:', oldchild, 'new value:', child, `they're different: ${oldchild == child}`);
        }
        this[key] = child;
        this._cachedChildren[key] = child;
    }
}
class Div extends BetterHTMLElement {
    constructor(divOpts) {
        const { setid, cls, text, byid, query, htmlElement, children } = divOpts;
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
            super({ tag: "div", setid, cls });
        }
        if (text !== undefined) {
            this.text(text);
        }
    }
}
class Paragraph extends BetterHTMLElement {
    constructor(pOpts) {
        const { setid, cls, text, byid, query, htmlElement, children } = pOpts;
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
class Span extends BetterHTMLElement {
    constructor(spanOpts) {
        const { setid, cls, text, byid, query, htmlElement, children } = spanOpts;
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
class Img extends BetterHTMLElement {
    constructor({ setid, cls, src, byid, query, htmlElement, children }) {
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
class Anchor extends BetterHTMLElement {
    constructor({ setid, cls, text, href, target, byid, query, htmlElement, children }) {
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
class Form extends BetterHTMLElement {
    get disabled() {
        return this.e.disabled;
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
    value(val) {
        if (val === undefined) {
            return bool(this.e.value) ? this.e.value : undefined;
        }
        else {
            this.e.value = val;
            return this;
        }
    }
    async flashBad() {
        this.addClass('bad');
        await wait(2000);
        this.removeClass('bad');
    }
    async flashGood() {
        this.addClass('good');
        await wait(2000);
        this.removeClass('good');
    }
    clear() {
        return this.value(null);
    }
    _preEvent() {
        this.disable();
    }
    async _onEventSuccess(ret) {
        if (ret instanceof Error && this.flashBad) {
            await this.flashBad();
        }
        else if (this.flashGood) {
            this.flashGood();
        }
    }
    async _onEventError(e) {
        console.error(e);
        if (this.flashBad) {
            await this.flashBad();
        }
    }
    _postEvent() {
        this.enable();
    }
}
class Button extends Form {
    constructor(buttonOpts) {
        const { setid, cls, text, byid, query, htmlElement, children } = buttonOpts;
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
    click(_fn) {
        const fn = async (event) => {
            try {
                this._preEvent();
                const ret = await _fn(event);
                await this._onEventSuccess(ret);
            }
            catch (e) {
                await this._onEventError(e);
            }
            finally {
                this._postEvent();
            }
        };
        return super.click(fn);
    }
}
class Input extends Form {
    constructor(inputOpts) {
        const { setid, cls, type, byid, query, htmlElement, children } = inputOpts;
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
    }
}
class TextInput extends Input {
    constructor(opts) {
        opts.type = 'text';
        super(opts);
        const { placeholder, type } = opts;
        if (placeholder !== undefined) {
            if (type) {
                if (type === "number" && typeof placeholder !== "number") {
                    console.warn(`placeholder type is ${typeof placeholder} but input type is ${type}. ignoring`);
                }
                else if (type === "text" && typeof placeholder !== "string") {
                    console.warn(`placeholder type is ${typeof placeholder} but input type is ${type}. ignoring`);
                }
                else {
                    this.placeholder(placeholder);
                }
            }
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
    keydown(_fn) {
        const fn = async (event) => {
            if (event.key !== 'Enter') {
                return;
            }
            if (!bool(this.value())) {
                if (this.flashBad) {
                    await this.flashBad();
                }
                return;
            }
            try {
                this._preEvent();
                const ret = await _fn(event);
                await this._onEventSuccess(ret);
            }
            catch (e) {
                await this._onEventError(e);
            }
            finally {
                this._postEvent();
            }
        };
        return super.keydown(fn);
    }
}
class Changable extends Input {
    change(_fn) {
        const fn = async (event) => {
            try {
                this._preEvent();
                const ret = await _fn(event);
                await this._onEventSuccess(ret);
            }
            catch (e) {
                await this._onEventError(e);
            }
            finally {
                this._postEvent();
            }
        };
        return super.change(fn);
    }
}
class CheckboxInput extends Changable {
    constructor(opts) {
        opts.type = 'checkbox';
        super(opts);
    }
    get checked() {
        return this.e.checked;
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
        if (bool(on)) {
            return this.check();
        }
        else {
            return this.uncheck();
        }
    }
    value(val) {
        if (val === undefined) {
            return this.checked;
        }
        else {
            return this.toggleChecked(val);
        }
    }
    clear() {
        return this.uncheck();
    }
    async _onEventError(e) {
        this.toggleChecked(!this.checked);
        await super._onEventError(e);
    }
}
class Select extends Changable {
    constructor(selectOpts) {
        super(selectOpts);
    }
    get selectedIndex() {
        return this.e.selectedIndex;
    }
    set selectedIndex(val) {
        this.e.selectedIndex = val;
    }
    get selected() {
        return this.item(this.selectedIndex);
    }
    set selected(val) {
        if (val instanceof HTMLOptionElement) {
            this.selectedIndex = this.options.findIndex(o => o === val);
        }
        else if (typeof val === 'number') {
            this.selectedIndex = val;
        }
        else {
            this.selectedIndex = this.options.findIndex(o => o.value === val);
        }
    }
    get options() {
        return [...this.e.options];
    }
    item(index) {
        return this.e.item(index);
    }
    value(val) {
        if (val === undefined) {
            return this.selected;
        }
        else {
            this.selected = val;
            return this;
        }
    }
    clear() {
        this.selectedIndex = 0;
        return this;
    }
}
function elem(elemOptions) {
    return new BetterHTMLElement(elemOptions);
}
function span(spanOpts) {
    if (!bool(spanOpts)) {
        spanOpts = {};
    }
    return new Span(spanOpts);
}
function div(divOpts) {
    if (!bool(divOpts)) {
        divOpts = {};
    }
    return new Div(divOpts);
}
function button(buttonOpts) {
    if (!bool(buttonOpts)) {
        buttonOpts = {};
    }
    return new Button(buttonOpts);
}
function input(inputOpts) {
    if (!bool(inputOpts)) {
        inputOpts = {};
    }
    return new Input(inputOpts);
}
function select(selectOpts) {
    if (!bool(selectOpts)) {
        selectOpts = {};
    }
    return new Select(selectOpts);
}
function img(imgOpts) {
    if (!bool(imgOpts)) {
        imgOpts = {};
    }
    return new Img(imgOpts);
}
function paragraph(pOpts) {
    if (!bool(pOpts)) {
        pOpts = {};
    }
    return new Paragraph(pOpts);
}
function anchor(anchorOpts) {
    if (!bool(anchorOpts)) {
        anchorOpts = {};
    }
    return new Anchor(anchorOpts);
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
function bool(val) {
    if (!val) {
        return false;
    }
    const typeofval = typeof val;
    if (typeofval !== 'object') {
        if (typeofval === 'function') {
            return true;
        }
        else {
            return !!val;
        }
    }
    let toStringed = {}.toString.call(val);
    if (toStringed === '[object Object]' || toStringed === '[object Array]') {
        return Object.keys(val).length !== 0;
    }
    return !!val.valueOf();
}
function isArray(obj) {
    if (!obj) {
        return false;
    }
    return typeof obj !== 'string' && (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function');
}
function isEmptyArr(collection) {
    return isArray(collection) && getLength(collection) === 0;
}
function isEmptyObj(obj) {
    return isObject(obj) && !isArray(obj) && Object.keys(obj).length === 0;
}
function isFunction(fn) {
    let toStringed = {}.toString.call(fn);
    return !!fn && toStringed === '[object Function]';
}
function anyDefined(obj) {
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
    return array.filter(x => x !== undefined).length > 0;
}
function anyTruthy(obj) {
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
    return array.filter(x => bool(x)).length > 0;
}
function allUndefined(obj) {
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
    return array.filter(x => x !== undefined).length === 0;
}
function isBHE(bhe, bheSubType) {
    return (bhe instanceof bheSubType);
}
function isType(arg) {
    return true;
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
