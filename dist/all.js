var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class BetterHTMLElement {
    constructor(elemOptions) {
        const { tag, id, htmlElement, text, query, children, cls } = elemOptions;
        if ([tag, id, htmlElement, query].filter(x => x).length > 1)
            throw new Error(`Received more than one, pass exactly one of: [tag, id, htmlElement, query], ${{
                tag,
                id,
                htmlElement,
                query
            }}`);
        if (tag)
            this._htmlElement = document.createElement(tag);
        else if (id)
            this._htmlElement = document.getElementById(id);
        else if (query)
            this._htmlElement = document.querySelector(query);
        else if (htmlElement)
            this._htmlElement = htmlElement;
        else
            throw new Error(`Didn't receive one, pass exactly one of: [tag, id, htmlElement, query], ${{
                tag,
                id,
                htmlElement,
                query
            }}`);
        if (text !== undefined)
            this.text(text);
        if (cls !== undefined)
            this.class(cls);
        if (children !== undefined) {
            if (tag)
                throw new Error(`Received children and tag, impossible since tag implies creating a new element and children implies getting an existing one. ${{
                    tag,
                    id,
                    htmlElement,
                    text,
                    query,
                    children
                }}`);
            this.cacheChildren(children);
        }
    }
    get e() {
        return this._htmlElement;
    }
    html(html) {
        this.e.innerHTML = html;
        return this;
    }
    text(txt) {
        this.e.innerText = txt;
        return this;
    }
    id(id) {
        this.e.id = id;
        return this;
    }
    css(css) {
        for (let [styleAttr, styleVal] of enumerate(css))
            this.e.style[styleAttr] = styleVal;
        return this;
    }
    uncss(...removeProps) {
        let css = {};
        for (let prop of removeProps)
            css[prop] = '';
        return this.css(css);
    }
    class(cls) {
        if (cls !== undefined) {
            this.e.className = cls;
            return this;
        }
        else {
            return Array.from(this.e.classList);
        }
    }
    addClass(cls, ...clses) {
        this.e.classList.add(cls);
        for (let c of clses)
            this.e.classList.add(c);
        return this;
    }
    removeClass(cls) {
        this.e.classList.remove(cls);
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
    append(...nodes) {
        if (nodes[0] instanceof BetterHTMLElement)
            for (let node of nodes)
                this.e.append(node.e);
        else
            for (let node of nodes)
                this.e.append(node);
        return this;
    }
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
    children() {
        const childrenVanilla = Array.from(this.e.children);
        const toElem = (c) => new BetterHTMLElement({ htmlElement: c });
        return childrenVanilla.map(toElem);
    }
    cacheChildren(keySelectorObj) {
        for (let [key, selector] of enumerate(keySelectorObj))
            this[key] = this.child(selector);
    }
    empty() {
        while (this.e.firstChild)
            this.e.removeChild(this.e.firstChild);
        return this;
    }
    remove() {
        this.e.remove();
        return this;
    }
    on(evTypeFnPairs, options) {
        const that = this;
        for (let [evType, evFn] of enumerate(evTypeFnPairs)) {
            this.e.addEventListener(evType, function _f(evt) {
                evFn(evt);
            }, options);
        }
        return this;
    }
    touchstart(fn, options) {
        this.e.addEventListener('touchstart', function _f(ev) {
            ev.preventDefault();
            fn(ev);
            if (options && options.once)
                this.removeEventListener('touchstart', _f);
        });
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
        this.e.addEventListener(action, function _f(ev) {
            ev.preventDefault();
            fn(ev);
            if (options && options.once)
                this.removeEventListener(action, _f);
        });
        return this;
    }
    click(fn, options) {
        this.e.addEventListener('click', fn, options);
        return this;
    }
    attr(attrValPairs) {
        for (let [attr, val] of enumerate(attrValPairs))
            this.e.setAttribute(attr, val);
        return this;
    }
    removeAttribute(qualifiedName) {
        this.e.removeAttribute(qualifiedName);
        return this;
    }
    data(key, parse = true) {
        const data = this.e.getAttribute(`data-${key}`);
        if (parse)
            return JSON.parse(data);
        else
            return data;
    }
    fade(dur, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const styles = window.getComputedStyle(this.e);
            const transProp = styles.transitionProperty.split(', ');
            const indexOfOpacity = transProp.indexOf('opacity');
            if (indexOfOpacity !== -1) {
                const transDur = styles.transitionDuration.split(', ');
                const opacityTransDur = transDur[indexOfOpacity];
                const trans = styles.transition.split(', ');
                console.warn(`fade(${dur}, ${to}), opacityTransDur !== undefined. nullifying transition. SHOULD NOT WORK`);
                console.log(`trans:\t${trans}\ntransProp:\t${transProp}\nindexOfOpacity:\t${indexOfOpacity}\nopacityTransDur:\t${opacityTransDur}`);
                trans.splice(indexOfOpacity, 1, `opacity 0s`);
                console.log(`after, trans: ${trans}`);
                this.e.style.transition = trans.join(', ');
                this.css({ opacity: to });
                yield wait(dur);
                return this;
            }
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
    constructor({ id, text, cls } = {}) {
        super({ tag: "div", text, cls });
        if (id)
            this.id(id);
    }
}
class Span extends BetterHTMLElement {
    constructor({ id, text, cls } = {}) {
        super({ tag: 'span', text, cls });
        if (id)
            this.id(id);
    }
}
class Img extends BetterHTMLElement {
    constructor({ id, src, cls }) {
        super({ tag: 'img', cls });
        if (id)
            this.id(id);
        if (src)
            this._htmlElement.src = src;
    }
}
function elem(elemOptions) {
    return new BetterHTMLElement(elemOptions);
}
function span({ id, text, cls }) {
    return new Span({ id, text, cls });
}
function div({ id, text, cls }) {
    return new Div({ id, text, cls });
}
function img({ id, src, cls }) {
    return new Img({ id, src, cls });
}
function* enumerate(obj) {
    if (Array.isArray(obj)) {
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