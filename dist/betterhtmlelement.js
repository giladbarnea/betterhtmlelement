"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///////////////////////////////////
// *** Utilities
///////////////////////////////////
// function enumerate(obj: undefined): [void];
// function enumerate<T>(obj: T): never;
// function enumerate<T>(obj: T): [keyof T, T[keyof T]][];
// function enumerate<T>(obj: T): T extends string[]
//     ? [number, string][]
//     : [keyof T, T[keyof T]][] {
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
    // // ()=>{}    ?
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
exports.enumerate = enumerate;
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.wait = wait;
function bool(val) {
    // 0                    false
    // 1                    true
    // '0'                  true
    // '1'                  true
    // ' '                  true
    // ''                   false
    // 'foo'                true
    // ()=>{}               true
    // Boolean              true
    // Boolean()            false
    // Boolean(false)       false
    // Boolean(true)        true
    // Function             true
    // Function()           true
    // Number               true
    // Number(0)            false
    // Number(1)            true
    // Number()             false
    // [ 0 ]                true
    // [ 1 ]                true
    // [ [] ]               true
    // [ false ]            true
    // [ true ]             true
    // []                   false       unlike native
    // document.body        true
    // false                false
    // function(){}         true
    // new Boolean          false       unlike native
    // new Boolean()        false       unlike native
    // new Boolean(false)   false       unlike native
    // new Boolean(true)    true
    // new Function         true
    // new Function()       true
    // new Number           false       unlike native
    // new Number(0)        false       unlike native
    // new Number(1)        true
    // new Number()         false       unlike native
    // new Timeline(...)    true
    // new class{}          false       unlike native
    // null                 false
    // true                 true
    // undefined            false
    // { hi : 'bye' }       true
    // {}                   false       unlike native
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
    // let keysLength = Object.keys(val).length;
    let toStringed = {}.toString.call(val);
    if (toStringed === '[object Object]' || toStringed === '[object Array]') {
        return Object.keys(val).length !== 0;
    }
    // Boolean, Number, HTMLElement...
    return !!val.valueOf();
}
exports.bool = bool;
function isArray(obj) {
    // 0                   false
    // 1                   false
    // ''                  false
    // ' '                 false
    // 'foo'               false
    // '0'                 false
    // '1'                 false
    // ()=>{}              false
    // Boolean             false
    // Boolean()           false
    // Function            false
    // Function()          false
    // Number              false
    // Number()            false
    // / [ 1 ]             true
    // / []                true
    // false               false
    // function(){}        false
    // new Boolean()       false
    // new Boolean(false)  false
    // new Boolean(true)   false
    // new Function()      false
    // new Number(0)       false
    // new Number(1)       false
    // new Number()        false
    // null                false
    // true                false
    // undefined           false
    // { hi : 'bye' }      false
    // {}                  false
    if (!obj) {
        return false;
    }
    return typeof obj !== 'string' && (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function');
}
exports.isArray = isArray;
function isEmptyArr(collection) {
    // 0                   false
    // 1                   false
    // ''                  false
    // ' '                 false
    // '0'                 false
    // '1'                 false
    // ()=>{}              false
    // Boolean             false
    // Boolean()           false
    // Function            false
    // Function()          false
    // Number              false
    // Number()            false
    // [ 1 ]               false
    // / []                true
    // false               false
    // function(){}        false
    // new Boolean()       false
    // new Boolean(false)  false
    // new Boolean(true)   false
    // new Function()      false
    // new Number(0)       false
    // new Number(1)       false
    // new Number()        false
    // null                false
    // true                false
    // undefined           false
    // { hi : 'bye' }      false
    // {}                  false
    return isArray(collection) && getLength(collection) === 0;
}
exports.isEmptyArr = isEmptyArr;
function isEmptyObj(obj) {
    // 0                   false
    // 1                   false
    // ''                  false
    // ' '                 false
    // '0'                 false
    // '1'                 false
    // ()=>{}              false
    // Boolean             false
    // Boolean()           false
    // Function            false
    // Function()          false
    // Number              false
    // Number()            false
    // [ 1 ]               false
    // []                  false
    // false               false
    // function(){}        false
    // / new Boolean()     true
    // / new Boolean(false)true
    // / new Boolean(true) true
    // new Function()      false
    // / new Number(0)     true
    // / new Number(1)     true
    // / new Number()      true
    // null                false
    // true                false
    // undefined           false
    // { hi : 'bye' }      false
    // / {}                true
    return isObject(obj) && !isArray(obj) && Object.keys(obj).length === 0;
}
exports.isEmptyObj = isEmptyObj;
function isFunction(fn) {
    // 0                   false
    // 1                   false
    // ''                  false
    // ' '                 false
    // '0'                 false
    // '1'                 false
    // / ()=>{}              true
    // / Boolean             true
    // Boolean()           false
    // / Function            true
    // / Function()          true
    // / Number              true
    // Number()            false
    // [ 1 ]               false
    // []                  false
    // false               false
    // / function(){}        true
    // new Boolean()       false
    // new Boolean(false)  false
    // new Boolean(true)   false
    // / new Function()      true
    // new Number(0)       false
    // new Number(1)       false
    // new Number()        false
    // null                false
    // true                false
    // undefined           false
    // { hi : 'bye' }      false
    // {}                  false
    let toStringed = {}.toString.call(fn);
    return !!fn && toStringed === '[object Function]';
}
exports.isFunction = isFunction;
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
exports.anyDefined = anyDefined;
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
exports.anyTruthy = anyTruthy;
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
exports.allUndefined = allUndefined;
/**Check every `checkInterval` ms if `cond()` is truthy. If, within `timeout`, cond() is truthy, return `true`. Return `false` if time is out.
 * @example
 * // Give the user a 200ms chance to get her pointer over "mydiv". Continue immediately once she does, or after 200ms if she doesn't.
 * mydiv.pointerenter( () => mydiv.pointerHovering = true; )
 * const pointerOnMydiv = await waitUntil(() => mydiv.pointerHovering, 200, 10);*/
async function waitUntil(cond, checkInterval = 20, timeout = Infinity) {
    if (checkInterval <= 0) {
        throw new Error(`checkInterval <= 0. checkInterval: ${checkInterval}`);
    }
    if (checkInterval > timeout) {
        throw new Error(`checkInterval > timeout (${checkInterval} > ${timeout}). checkInterval has to be lower than timeout.`);
    }
    const loops = timeout / checkInterval;
    if (loops <= 1) {
        console.warn(`loops <= 1, you probably didn't want this to happen`);
    }
    let count = 0;
    while (count < loops) {
        if (cond()) {
            return true;
        }
        await wait(checkInterval);
        count++;
    }
    return false;
}
exports.waitUntil = waitUntil;
function isBHE(bhe, bheSubType) {
    return (bhe instanceof bheSubType);
}
exports.isBHE = isBHE;
function isType(arg) {
    return true;
}
exports.isType = isType;
function isTMap(obj) {
    // 0                   false
    // 1                   false
    // ''                  false
    // ' '                 false
    // '0'                 false
    // '1'                 false
    // ()=>{}              false
    // Boolean             false
    // Boolean()           false
    // Function            false
    // Function()          false
    // Number              false
    // Number()            false
    // [ 1 ]             false
    // []                false
    // false               false
    // function(){}        false
    // new Boolean()     false
    // new Boolean(false)false
    // new Boolean(true) false
    // new Function()      false
    // new Number(0)     false
    // new Number(1)     false
    // new Number()      false
    // null                false
    // true                false
    // undefined           false
    // / { hi : 'bye' }    true
    // / {}                true
    return {}.toString.call(obj) == '[object Object]';
}
exports.isTMap = isTMap;
// *  underscore.js
/**true for any non-primitive, including array, function*/
function isObject(obj) {
    // 0                   false
    // 1                   false
    // ''                  false
    // ' '                 false
    // '0'                 false
    // '1'                 false
    // ()=>{}              false
    // Boolean             false
    // Boolean()           false
    // Function            false
    // Function()          false
    // Number              false
    // Number()            false
    // / [ 1 ]             true
    // / []                true
    // false               false
    // function(){}        false
    // / new Boolean()     true
    // / new Boolean(false)true
    // / new Boolean(true) true
    // new Function()      false
    // / new Number(0)     true
    // / new Number(1)     true
    // / new Number()      true
    // null                false
    // true                false
    // undefined           false
    // / { hi : 'bye' }    true
    // / {}                true
    return typeof obj === 'object' && !!obj;
}
exports.isObject = isObject;
function shallowProperty(key) {
    return function (obj) {
        return obj == null ? void 0 : obj[key];
    };
}
exports.shallowProperty = shallowProperty;
function getLength(collection) {
    return shallowProperty('length')(collection);
}
exports.getLength = getLength;
const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
function isArrayLike(collection) {
    const length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}
exports.isArrayLike = isArrayLike;
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
exports.extend = extend;
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
function equalsAny(obj, ...others) {
    if (!others) {
        throw new Error('Not even one other was passed');
    }
    let strict = !(isArrayLike(obj) && isObject(obj[obj.length - 1]) && obj[obj.length - 1].strict == false);
    const _isEq = (_obj, _other) => strict ? _obj === _other : _obj == _other;
    for (let other of others) {
        if (_isEq(obj, other)) {
            return true;
        }
    }
    return false;
}
exports.equalsAny = equalsAny;
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
///////////////////////////////////
// *** Exceptions
///////////////////////////////////
function getArgsFullRepr(argsWithValues) {
    return Object.entries(argsWithValues)
        // @ts-ignore
        .flatMap(([argname, argval]) => `${argname} (${typeof argval}): ${isObject(argval) ? `{${getArgsFullRepr(argval)}}` : argval}`)
        .join('", "');
}
exports.getArgsFullRepr = getArgsFullRepr;
function getArgsWithValues(passedArgs) {
    const argsWithValues = {};
    for (let [argname, argval] of Object.entries(passedArgs)) {
        if (argval !== undefined) {
            argsWithValues[argname] = argval;
        }
    }
    return argsWithValues;
}
exports.getArgsWithValues = getArgsWithValues;
function summary(argset) {
    const argsWithValues = getArgsWithValues(argset);
    const argsFullRepr = getArgsFullRepr(argsWithValues);
    let argNames = Object.keys(argset);
    return `${argNames.length} args (${argNames}); ${Object.keys(argsWithValues).length} had value: "${argsFullRepr}".\n`;
}
exports.summary = summary;
/**Prints what was expected and what was actually passed.*/
class MutuallyExclusiveArgs extends Error {
    /**Either a argName:argValue map or an array of such maps, to indicate mutually exclusive sets of args.*/
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
exports.MutuallyExclusiveArgs = MutuallyExclusiveArgs;
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
exports.NotEnoughArgs = NotEnoughArgs;
class BHETypeError extends TypeError {
    constructor(options) {
        let { faultyValue, expected, where, message } = options;
        const repr = getArgsFullRepr(faultyValue);
        let msg = '';
        if (where) {
            msg += `${where} | `;
        }
        msg += `Got ${repr}. `;
        if (expected) {
            if (isArray(expected)) {
                expected = expected.join(" | ");
            }
            msg += ` Expected: ${expected}. `;
        }
        if (message) {
            msg += `Details:\n${message}`;
        }
        super(msg);
    }
}
exports.BHETypeError = BHETypeError;
class ValueError extends BHETypeError {
}
exports.ValueError = ValueError;
///////////////////////////////////
// *** BetterHTMLElement
///////////////////////////////////
const SVG_NS_URI = 'http://www.w3.org/2000/svg';
class BetterHTMLElement {
    constructor(elemOptions) {
        this._isSvg = false;
        this._listeners = {};
        this._cachedChildren = {};
        let { tag, cls, setid, html, // create
        htmlElement, byid, query, children // wrap existing
         } = elemOptions;
        // *** Argument Errors
        // ** wrapping args: assert max one (or none if creating new)
        if ([tag, byid, query, htmlElement].filter(x => x !== undefined).length > 1) {
            throw new MutuallyExclusiveArgs({
                byid, query, htmlElement, tag
            }, 'Either wrap an existing element by passing one of `byid` / `query` / `htmlElement`, or create a new one by passing `tag`.');
        }
        // ** creating new elem args: assert creators and wrappers not mixed
        // * if creating new with either `tag` / `setid` , no meaning to either children, byid, htmlElement, or query
        if (anyDefined([tag, cls, setid]) && anyDefined([children, byid, htmlElement, query])) {
            throw new MutuallyExclusiveArgs([
                { tag, cls, setid },
                { children, byid, htmlElement, query }
            ], `Can't have args from both sets`);
        }
        if (allUndefined([tag, byid, htmlElement, query])) {
            throw new NotEnoughArgs(1, { tag, byid, htmlElement, query }, 'either');
        }
        // ** tag (CREATE element)
        if (tag !== undefined) {
            if (['svg', 'path'].includes(tag.toLowerCase())) {
                this._isSvg = true;
                this._htmlElement = document.createElementNS(SVG_NS_URI, tag);
            }
            else {
                this._htmlElement = document.createElement(tag);
            }
        }
        else { // ** wrap EXISTING element
            // * byid
            if (byid !== undefined) {
                if (byid.startsWith('#')) {
                    console.warn(`param 'byid' starts with '#', stripping it: ${byid}`);
                    byid = byid.substr(1);
                }
                this._htmlElement = document.getElementById(byid);
            }
            else {
                // * query
                if (query !== undefined) {
                    this._htmlElement = document.querySelector(query);
                }
                else {
                    // * htmlElement
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
        if (html !== undefined) {
            this.html(html);
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
    static wrapWithBHE(element) {
        const tag = element.tagName.toLowerCase();
        // const tag = element.tagName.toLowerCase() as Tag;
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
        let tag = (_a = this._htmlElement) === null || _a === void 0 ? void 0 : _a.tagName;
        let id = this.id();
        let classList = (_b = this._htmlElement) === null || _b === void 0 ? void 0 : _b.classList;
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
            // No way to get newHtmlElement event listeners besides hacking Element.prototype
            this.on(this._listeners);
            this._htmlElement.replaceWith(newHtmlElement);
            this._htmlElement = newHtmlElement;
        }
        return this;
    }
    html(html) {
        if (html === undefined) {
            return this._htmlElement.innerHTML;
        }
        else {
            this._htmlElement.innerHTML = html;
            return this;
        }
    }
    text(txt) {
        if (txt === undefined) {
            return this._htmlElement.innerText;
        }
        else {
            this._htmlElement.innerText = txt;
            return this;
        }
    }
    id(id) {
        var _a;
        if (id === undefined) {
            return (_a = this._htmlElement) === null || _a === void 0 ? void 0 : _a.id;
        }
        else {
            this._htmlElement.id = id;
            return this;
        }
    }
    css(css) {
        if (typeof css === 'string') {
            return this._htmlElement.style[css];
        }
        else {
            for (let [styleAttr, styleVal] of enumerate(css)) {
                this._htmlElement.style[styleAttr] = styleVal;
            }
            return this;
        }
    }
    /**Remove the value of the passed style properties*/
    uncss(...removeProps) {
        let css = {};
        for (let prop of removeProps) {
            css[prop] = '';
        }
        return this.css(css);
    }
    class(cls) {
        if (cls === undefined) {
            return Array.from(this._htmlElement.classList);
        }
        else if (isFunction(cls)) {
            return Array.from(this._htmlElement.classList).find(cls);
        }
        else {
            if (this._isSvg) {
                // @ts-ignore
                // noinspection JSConstantReassignment
                this._htmlElement.classList = [cls];
            }
            else {
                this._htmlElement.className = cls;
            }
            return this;
        }
    }
    addClass(cls, ...clses) {
        this._htmlElement.classList.add(cls);
        for (let c of clses) {
            this._htmlElement.classList.add(c);
        }
        return this;
    }
    removeClass(cls, ...clses) {
        if (isFunction(cls)) {
            this._htmlElement.classList.remove(this.class(cls));
            for (let c of clses) {
                this._htmlElement.classList.remove(this.class(c));
            }
        }
        else {
            this._htmlElement.classList.remove(cls);
            for (let c of clses) {
                this._htmlElement.classList.remove(c);
            }
        }
        return this;
    }
    replaceClass(oldToken, newToken) {
        if (isFunction(oldToken)) {
            this._htmlElement.classList.replace(this.class(oldToken), newToken);
        }
        else {
            this._htmlElement.classList.replace(oldToken, newToken);
        }
        return this;
    }
    toggleClass(cls, force) {
        if (isFunction(cls)) {
            this._htmlElement.classList.toggle(this.class(cls), force);
        }
        else {
            this._htmlElement.classList.toggle(cls, force);
        }
        return this;
    }
    hasClass(cls) {
        if (isFunction(cls)) {
            return this.class(cls) !== undefined;
        }
        else {
            return this._htmlElement.classList.contains(cls);
        }
    }
    // *** Nodes
    /**Insert at least one `node` just after `this`. Any `node` can be either `BetterHTMLElement`s or vanilla `Node`.*/
    after(...nodes) {
        for (let node of nodes) {
            if (node instanceof BetterHTMLElement) {
                this._htmlElement.after(node.e);
            }
            else {
                this._htmlElement.after(node);
            }
        }
        return this;
    }
    /**Insert `this` just after a `BetterHTMLElement` or a vanilla `Node`.*/
    insertAfter(node) {
        if (node instanceof BetterHTMLElement) {
            node._htmlElement.after(this._htmlElement);
        }
        else {
            node.after(this._htmlElement);
        }
        return this;
    }
    /**Insert at least one `node` after the last child of `this`.
     * Any `node` can be either a `BetterHTMLElement`, a vanilla `Node`,
     * a `{someKey: BetterHTMLElement}` pairs object, or a `[someKey, BetterHTMLElement]` tuple.*/
    append(...nodes) {
        for (let node of nodes) {
            if (node instanceof BetterHTMLElement) {
                this._htmlElement.append(node.e);
            }
            else {
                if (node instanceof Node) {
                    this._htmlElement.append(node);
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
    /**Append `this` to a `BetterHTMLElement` or a vanilla `Node`*/
    appendTo(node) {
        if (node instanceof BetterHTMLElement) {
            node._htmlElement.append(this._htmlElement);
        }
        else {
            node.append(this._htmlElement);
        }
        return this;
    }
    /**Insert at least one `node` just before `this`. Any `node` can be either `BetterHTMLElement`s or vanilla `Node`.*/
    before(...nodes) {
        for (let node of nodes) {
            if (node instanceof BetterHTMLElement) {
                this._htmlElement.before(node.e);
            }
            else {
                this._htmlElement.before(node);
            }
        }
        return this;
    }
    /**Insert `this` just before a `BetterHTMLElement` or a vanilla `Node`s.*/
    insertBefore(node) {
        if (node instanceof BetterHTMLElement) {
            node._htmlElement.before(this._htmlElement);
        }
        else {
            node.before(this._htmlElement);
        }
        return this;
    }
    replaceChild(newChild, oldChild) {
        this._htmlElement.replaceChild(newChild, oldChild);
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
        const htmlElement = this._htmlElement.querySelector(selector);
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
            childrenCollection = this._htmlElement.children;
        }
        else {
            childrenCollection = this._htmlElement.querySelectorAll(selector);
        }
        childrenVanilla = Array.from(childrenCollection);
        return childrenVanilla.map(this._cls().wrapWithBHE);
    }
    clone(deep) {
        console.warn(`${this}.clone() doesnt return a matching BHE subtype, but a regular BHE`);
        // TODO: return new this()?
        return new BetterHTMLElement({ htmlElement: this._htmlElement.cloneNode(deep) });
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
    cacheChildren(childrenObj) {
        for (let [key, value] of enumerate(childrenObj)) {
            let type = typeof value;
            if (isObject(value)) {
                if (value instanceof BetterHTMLElement) {
                    // { "myimg": img(...) }
                    this._cache(key, value);
                }
                else {
                    // { "mydiv": { "myimg": img(...), "myinput": input(...) } }
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
                        // bhe constructor
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
                    // { "options": "<option>" }
                    let tagName = match[1];
                    // @ts-ignore
                    const htmlElements = [...this._htmlElement.getElementsByTagName(tagName)];
                    let bhes = [];
                    for (let htmlElement of htmlElements) {
                        bhes.push(this._cls().wrapWithBHE(htmlElement));
                    }
                    this._cache(key, bhes);
                }
                else {
                    // { "myinput": "input[type=checkbox]" }
                    this._cache(key, this.child(value));
                }
            }
            else {
                console.warn(`cacheChildren, bad value type: "${type}". key: "${key}", value: "${value}". childrenObj:`, childrenObj);
            }
        }
        return this;
    }
    /**Remove all children from DOM*/
    empty() {
        while (this._htmlElement.firstChild) {
            this._htmlElement.removeChild(this._htmlElement.firstChild);
        }
        return this;
    }
    /**Remove element from DOM*/
    remove() {
        this._htmlElement.remove();
        return this;
    }
    // *** Events
    on(evTypeFnPairs, options) {
        // const foo = evTypeFnPairs["abort"];
        for (let [evType, evFn] of enumerate(evTypeFnPairs)) {
            const _f = function _f(evt) {
                evFn(evt);
            };
            this._htmlElement.addEventListener(evType, _f, options);
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
    touchstart(fn, options) {
        this._htmlElement.addEventListener('touchstart', function _f(ev) {
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
             {
                this.removeEventListener(action, _f);
            }
        };
        this._htmlElement.addEventListener(action, _f, options);
        this._listeners.pointerdown = _f;
        return this;
    }
    click(fn, options) {
        if (fn === undefined) {
            this._htmlElement.click();
            return this;
        }
        else {
            return this.on({ click: fn }, options);
        }
    }
    blur(fn, options) {
        if (fn === undefined) {
            this._htmlElement.blur();
            return this;
        }
        else {
            return this.on({ blur: fn }, options);
        }
    }
    focus(fn, options) {
        if (fn === undefined) {
            this._htmlElement.focus();
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
            this._htmlElement.dispatchEvent(dblclick);
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
            this._htmlElement.dispatchEvent(mouseenter);
            return this;
        }
        else {
            return this.on({ mouseenter: fn }, options);
        }
    }
    /**Add a `keydown` event listener*/
    keydown(fn, options) {
        return this.on({ keydown: fn }, options);
    }
    /**Add a `mouseout` event listener*/
    mouseout(fn, options) {
        //mouseleave and mouseout are similar but differ in that mouseleave does not bubble and mouseout does.
        // This means that mouseleave is fired when the pointer has exited the element and all of its descendants,
        // whereas mouseout is fired when the pointer leaves the element or leaves one of the element's descendants
        // (even if the pointer is still within the element).
        return this.on({ mouseout: fn }, options);
    }
    /**Add a `mouseover` event listener*/
    mouseover(fn, options) {
        // mouseover: also child elements
        // mouseenter: only bound element
        // return this.on({mouseover: fn}, options)
        return this.on({ mouseover: fn });
    }
    /** Remove the event listener of `event`, if exists.*/
    off(event) {
        // TODO: Should remove listener from this._listeners?
        this._htmlElement.removeEventListener(event, this._listeners[event]);
        return this;
    }
    /** Remove all event listeners in `_listeners`*/
    allOff() {
        for (let i = 0; i < Object.keys(this._listeners).length; i++) {
            let event = this._listeners[i];
            this.off(event);
        }
        return this;
    }
    attr(attrValPairs) {
        if (typeof attrValPairs === 'string') {
            return this._htmlElement.getAttribute(attrValPairs);
        }
        else {
            for (let [attr, val] of enumerate(attrValPairs)) {
                this._htmlElement.setAttribute(attr, val);
            }
            return this;
        }
    }
    /** `removeAttribute` */
    removeAttr(qualifiedName, ...qualifiedNames) {
        let _removeAttribute;
        if (this._isSvg) {
            _removeAttribute = (qualifiedName) => this._htmlElement.removeAttributeNS(SVG_NS_URI, qualifiedName);
        }
        else {
            _removeAttribute = (qualifiedName) => this._htmlElement.removeAttribute(qualifiedName);
        }
        _removeAttribute(qualifiedName);
        for (let qn of qualifiedNames) {
            _removeAttribute(qn);
        }
        return this;
    }
    /**`getAttribute(`data-${key}`)`. JSON.parse it by default.*/
    getdata(key, parse = true) {
        // TODO: jquery doesn't affect data-* attrs in DOM. https://api.jquery.com/data/
        const data = this._htmlElement.getAttribute(`data-${key}`);
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
            console.warn(`Overwriting this._cachedChildren[${key}]!`, `old child: ${oldchild}`, `new child: ${child}`, `are they different?: ${oldchild == child}`);
        }
        this[key] = child;
        this._cachedChildren[key] = child;
    }
}
exports.BetterHTMLElement = BetterHTMLElement;
class Div extends BetterHTMLElement {
    constructor(divOpts) {
        const { setid, cls, text, html, byid, query, htmlElement, children } = divOpts;
        if (text !== undefined && html !== undefined) {
            throw new MutuallyExclusiveArgs({ text, html });
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
            super({ tag: "div", setid, cls, html });
            if (text !== undefined) {
                this.text(text);
            }
        }
    }
}
exports.Div = Div;
class Paragraph extends BetterHTMLElement {
    constructor(pOpts) {
        // if (noValue(arguments[0])) {
        //     throw new NotEnoughArgs([1], arguments[0])
        // }
        const { setid, cls, text, html, byid, query, htmlElement, children } = pOpts;
        if (text !== undefined && html !== undefined) {
            throw new MutuallyExclusiveArgs({ text, html });
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
            super({ tag: "p", setid, cls, html });
            if (text !== undefined) {
                this.text(text);
            }
        }
    }
}
exports.Paragraph = Paragraph;
class Span extends BetterHTMLElement {
    constructor(spanOpts) {
        const { setid, cls, text, html, byid, query, htmlElement, children } = spanOpts;
        if (text !== undefined && html !== undefined) {
            throw new MutuallyExclusiveArgs({ text, html });
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
            super({ tag: "span", setid, cls, html });
            if (text !== undefined) {
                this.text(text);
            }
        }
    }
}
exports.Span = Span;
class Img extends BetterHTMLElement {
    constructor(imgOpts) {
        const { cls, setid, src, byid, query, htmlElement, children } = imgOpts;
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
            if (src !== undefined) {
                this.src(src);
            }
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
    constructor({ setid, cls, text, html, href, target, byid, query, htmlElement, children }) {
        if (text !== undefined && html !== undefined) {
            throw new MutuallyExclusiveArgs({ text, html });
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
            super({ tag: "a", setid, cls, html });
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
class Form extends BetterHTMLElement {
    get disabled() {
        return this._htmlElement.disabled;
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
    disable() {
        this._htmlElement.disabled = true;
        return this;
    }
    enable() {
        this._htmlElement.disabled = false;
        return this;
    }
    /**Enables if `on` is truthy, otherwise disables.
     Errors if `on` is non-primitive (object, array).*/
    toggleEnabled(on) {
        if (isObject(on)) {
            this._softErr(new BHETypeError({ faultyValue: { on }, expected: "primitive", where: "toggleEnabled()" }));
            return this;
        }
        if (bool(on)) {
            return this.enable();
        }
        else {
            return this.disable();
        }
    }
    value(val) {
        var _a;
        if (val === undefined) {
            return _a = this._htmlElement.value, (_a !== null && _a !== void 0 ? _a : undefined);
        }
        else {
            if (isObject(val)) {
                this._softErr(new BHETypeError({ faultyValue: { val }, expected: "primitive", where: "value()" }));
                return this;
            }
            this._htmlElement.value = val;
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
    _beforeEvent(thisArg) {
        let self = this === undefined ? thisArg : this;
        return self.disable();
    }
    /**Calls `self.flashGood()`.*/
    _onEventSuccess(ret, thisArg) {
        let self = this === undefined ? thisArg : this;
        if (self.flashGood) {
            self.flashGood();
        }
        return self;
    }
    /**Logs error to console and calls `self.flashBad()`.*/
    async _softErr(e, thisArg) {
        console.error(`${e.name}:\n${e.message}`);
        let self = this === undefined ? thisArg : this;
        if (self.flashBad) {
            await self.flashBad();
        }
        return self;
    }
    /**Logs warning to console and calls `self.flashBad()`.*/
    async _softWarn(e, thisArg) {
        console.warn(`${e.name}:\n${e.message}`);
        let self = this === undefined ? thisArg : this;
        if (self.flashBad) {
            await self.flashBad();
        }
        return self;
    }
    /**Calls `self.enable()`.*/
    _afterEvent(thisArg) {
        let self = this === undefined ? thisArg : this;
        return self.enable();
    }
    /**Used by e.g. `click(fn)` to wrap passed `fn` safely and trigger `_[before|after|on]Event[Success|Error]`.*/
    async _wrapFnInEventHooks(asyncFn, event) {
        try {
            this._beforeEvent();
            const ret = await asyncFn(event);
            await this._onEventSuccess(ret);
        }
        catch (e) {
            await this._softErr(e);
        }
        finally {
            this._afterEvent();
        }
    }
}
exports.Form = Form;
class Button extends Form {
    constructor(buttonOpts) {
        const { setid, cls, text, html, byid, query, htmlElement, children, click } = buttonOpts;
        if (text !== undefined && html !== undefined) {
            throw new MutuallyExclusiveArgs({ text, html });
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
            super({ tag: "button", setid, cls, html });
            if (text !== undefined) {
                this.text(text);
            }
            if (click !== undefined) {
                this.click(click);
            }
        }
    }
    click(_fn) {
        if (_fn !== undefined) {
            const fn = async (event) => {
                await this._wrapFnInEventHooks(_fn, event);
            };
            return super.click(fn);
        }
        return super.click();
    }
}
exports.Button = Button;
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
            if (type !== undefined) {
                // @ts-ignore
                this._htmlElement.type = type;
            }
        }
    }
}
exports.Input = Input;
class TextInput extends Input {
    constructor(opts) {
        opts.type = 'text';
        super(opts);
        const { placeholder } = opts;
        if (placeholder !== undefined) {
            this.placeholder(placeholder);
        }
    }
    placeholder(val) {
        if (val === undefined) {
            return this._htmlElement.placeholder;
        }
        else {
            this._htmlElement.placeholder = val;
            return this;
        }
    }
    keydown(_fn) {
        const fn = async (event) => {
            if (event.key !== 'Enter') {
                return;
            }
            let val = this.value();
            if (!bool(val)) {
                this._softWarn(new ValueError({ faultyValue: { val }, expected: "truthy", where: "keydown()" }));
                return;
            }
            await this._wrapFnInEventHooks(_fn, event);
        };
        return super.keydown(fn);
    }
}
exports.TextInput = TextInput;
class Changable extends Input {
    change(_fn) {
        const fn = async (event) => {
            await this._wrapFnInEventHooks(_fn, event);
        };
        return super.change(fn);
    }
}
exports.Changable = Changable;
/**Patches Form's `value()` to set/get `_htmlElement.checked`, and `clear()` to uncheck. */
class CheckboxInput extends Changable {
    constructor(opts) {
        opts.type = 'checkbox';
        super(opts);
    }
    get checked() {
        return this._htmlElement.checked;
    }
    check() {
        this._htmlElement.checked = true;
        return this;
    }
    uncheck() {
        this._htmlElement.checked = false;
        return this;
    }
    /**checks on if `on` is truthy, otherwise unchecks.
     Errors if `on` is non-primitive (object, array).*/
    toggleChecked(on) {
        if (isObject(on)) {
            this._softErr(new BHETypeError({ faultyValue: { on }, expected: "primitive", where: "toggleChecked()" }));
            return this;
        }
        if (bool(on)) {
            return this.check();
        }
        else {
            return this.uncheck();
        }
    }
    value(val) {
        var _a;
        if (val === undefined) {
            return _a = this._htmlElement.checked, (_a !== null && _a !== void 0 ? _a : undefined);
        }
        else {
            if (isObject(val)) {
                this._softErr(new BHETypeError({ faultyValue: { val }, expected: "primitive", where: "value()" }));
            }
            this._htmlElement.checked = val;
            return this;
        }
    }
    clear() {
        return this.uncheck();
    }
    async _softErr(e, thisArg) {
        this.toggleChecked(!this.checked);
        return super._softErr(e);
    }
}
exports.CheckboxInput = CheckboxInput;
class Select extends Changable {
    // Select uniques:
    // add() item() length namedItem() options remove() selectedIndex selectedOptions ITERATOR
    constructor(selectOpts) {
        super(selectOpts);
    }
    get selectedIndex() {
        return this._htmlElement.selectedIndex;
    }
    set selectedIndex(val) {
        this._htmlElement.selectedIndex = val;
    }
    get selected() {
        return this.item(this.selectedIndex);
    }
    /**@param val - Either a specific HTMLOptionElement, number (index)*/
    set selected(val) {
        if (val instanceof HTMLOptionElement) {
            let index = this.options.findIndex(o => o === val);
            if (index === -1) {
                this._softWarn(new ValueError({ faultyValue: { val }, where: "set selected(val)", message: `no option equals passed val` }));
            }
            this.selectedIndex = index;
        }
        else if (typeof val === 'number') {
            this.selectedIndex = val;
        }
        else {
            this.selectedIndex = this.options.findIndex(o => o.value === val);
        }
    }
    get options() {
        return [...this._htmlElement.options];
    }
    item(index) {
        return this._htmlElement.item(index);
    }
    value(val) {
        var _a;
        if (val === undefined) {
            return _a = this.selected.value, (_a !== null && _a !== void 0 ? _a : undefined);
        }
        else {
            this.selected = val;
            return this;
        }
    }
    /**Sets `selected` to 0th element. Equivalent to `value(0)`.*/
    clear() {
        this.selectedIndex = 0;
        return this;
    }
}
exports.Select = Select;
function elem(elemOptions) {
    return new BetterHTMLElement(elemOptions);
}
exports.elem = elem;
function span(spanOpts) {
    if (!bool(spanOpts)) {
        spanOpts = {};
    }
    return new Span(spanOpts);
}
exports.span = span;
function div(divOpts) {
    if (!bool(divOpts)) {
        divOpts = {};
    }
    return new Div(divOpts);
}
exports.div = div;
function button(buttonOpts) {
    if (!bool(buttonOpts)) {
        buttonOpts = {};
    }
    return new Button(buttonOpts);
}
exports.button = button;
function input(inputOpts) {
    if (!bool(inputOpts)) {
        inputOpts = {};
    }
    return new Input(inputOpts);
}
exports.input = input;
function select(selectOpts) {
    if (!bool(selectOpts)) {
        selectOpts = {};
    }
    return new Select(selectOpts);
}
exports.select = select;
function img(imgOpts) {
    if (!bool(imgOpts)) {
        imgOpts = {};
    }
    return new Img(imgOpts);
}
exports.img = img;
function paragraph(pOpts) {
    if (!bool(pOpts)) {
        pOpts = {};
    }
    return new Paragraph(pOpts);
}
exports.paragraph = paragraph;
function anchor(anchorOpts) {
    if (!bool(anchorOpts)) {
        anchorOpts = {};
    }
    return new Anchor(anchorOpts);
}
exports.anchor = anchor;
//# sourceMappingURL=betterhtmlelement.js.map