var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class BetterHTMLElement extends HTMLElement {
    constructor(elemOptions) {
        super();
        let proxy;
        const { tag, id, htmlElement, text, query, children, cls } = elemOptions;
        if ([tag, id, htmlElement, query].filter(x => x).length > 1)
            throw new Error(`Received more than one, pass exactly one of: [tag, id, htmlElement, query], ${{
                tag,
                id,
                htmlElement,
                query
            }}`);
        if (tag)
            proxy = document.createElement(tag);
        else if (id)
            proxy = document.getElementById(id);
        else if (query)
            proxy = document.querySelector(query);
        else if (htmlElement)
            proxy = htmlElement;
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
        return proxy;
    }
    // **  Basic
    html(html) {
        this.innerHTML = html;
        return this;
    }
    text(txt) {
        this.innerText = txt;
        return this;
    }
    id(id) {
        super.id = id;
        return this;
    }
    css(css) {
        for (let [styleAttr, styleVal] of enumerate(css))
            this.style[styleAttr] = styleVal;
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
            this.className = cls;
            return this;
        }
        else {
            return Array.from(this.classList);
        }
    }
    addClass(cls, ...clses) {
        this.classList.add(cls);
        for (let c of clses)
            this.classList.add(c);
        return this;
    }
    removeClass(cls) {
        this.classList.remove(cls);
        return this;
    }
    replaceClass(oldToken, newToken) {
        this.classList.replace(oldToken, newToken);
        return this;
    }
    toggleClass(cls, force) {
        this.classList.toggle(cls, force);
        return this;
    }
    // **  Nodes
    append(...nodes) {
        for (let node of nodes)
            super.append(node);
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
        return new BetterHTMLElement({ htmlElement: this.querySelector(selector) });
    }
    replaceChild(newChild, oldChild) {
        super.replaceChild(newChild, oldChild);
        return this;
    }
    children() {
        const childrenVanilla = Array.from(super.children);
        const toElem = (c) => new BetterHTMLElement({ htmlElement: c });
        return childrenVanilla.map(toElem);
    }
    cacheChildren(keySelectorObj) {
        for (let [key, selector] of enumerate(keySelectorObj))
            this[key] = this.child(selector);
    }
    empty() {
        // TODO: is this faster than innerHTML = ""?
        while (this.firstChild)
            this.removeChild(this.firstChild);
        return this;
    }
    remove() {
        super.remove();
        return this;
    }
    // **  Events
    on(evTypeFnPairs, options) {
        const that = this; // "this" changes inside function _f
        for (let [evType, evFn] of enumerate(evTypeFnPairs)) {
            this.addEventListener(evType, function _f(evt) {
                evFn(evt);
                // console.log('addEventListener, evt: ', evt, 'options: ', options, 'this: ', this);
                // if (options && options.once)
                //     this.removeEventListener(evType, _f);
            }, options);
        }
        return this;
    }
    touchstart(fn, options) {
        this.addEventListener('touchstart', function _f(ev) {
            ev.preventDefault();
            fn(ev); // LOL: what
            if (options && options.once) // TODO: maybe native options.once is enough 
                this.removeEventListener('touchstart', _f);
        });
        return this;
    }
    pointerdown(fn, options) {
        this.addEventListener('pointerdown', function _f(ev) {
            ev.preventDefault();
            fn(ev);
            if (options && options.once) // TODO: maybe native options.once is enough
                this.removeEventListener('pointerdown', _f);
        });
        return this;
    }
    click(fn, options) {
        this.addEventListener('click', fn, options);
        return this;
    }
    // **  Attributes
    attr(attrValPairs) {
        for (let [attr, val] of enumerate(attrValPairs))
            this.setAttribute(attr, val);
        return this;
    }
    removeAttribute(qualifiedName) {
        super.removeAttribute(qualifiedName);
        return this;
    }
    data(key, parse = true) {
        const data = this.getAttribute(`data-${key}`);
        if (parse)
            return JSON.parse(data);
        else
            return data;
    }
    // **  Fade
    fade(dur, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const styles = window.getComputedStyle(this);
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
                this.style.transition = trans.join(', ');
                this.css({ opacity: to });
                yield wait(dur);
                return this;
            }
            // transition: opacity was NOT defined in css.
            if (dur == 0) {
                return this.css({ opacity: to });
            }
            const isFadeOut = to === 0;
            let opacity = parseFloat(this.style.opacity);
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
        // if (!src)
        //     throw new Error(`Img constructor didn't receive src`);
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
//# sourceMappingURL=index.js.map