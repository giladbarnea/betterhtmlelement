export function enumerate(obj) {
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
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function bool(val) {
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
export function isArray(obj) {
    if (!obj) {
        return false;
    }
    return typeof obj !== 'string' && (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function');
}
export function isEmptyArr(collection) {
    return isArray(collection) && getLength(collection) === 0;
}
export function isEmptyObj(obj) {
    return isObject(obj) && !isArray(obj) && Object.keys(obj).length === 0;
}
export function isFunction(fn) {
    let toStringed = {}.toString.call(fn);
    return !!fn && toStringed === '[object Function]';
}
export function anyDefined(obj) {
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
export function anyTruthy(obj) {
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
export function allUndefined(obj) {
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
export async function waitUntil(cond, checkInterval = 20, timeout = Infinity) {
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
export function isBHE(bhe, bheSubType) {
    return (bhe instanceof bheSubType);
}
export function isType(arg) {
    return true;
}
export function isTMap(obj) {
    return {}.toString.call(obj) == '[object Object]';
}
export function isObject(obj) {
    return typeof obj === 'object' && !!obj;
}
export function shallowProperty(key) {
    return function (obj) {
        return obj == null ? void 0 : obj[key];
    };
}
export function getLength(collection) {
    return shallowProperty('length')(collection);
}
const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
export function isArrayLike(collection) {
    const length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}
export function extend(sup, child) {
    child.prototype = sup.prototype;
    const handler = {
        construct
    };
    function construct(_, argArray) {
        const obj = new child;
        sup.apply(obj, argArray);
        child.apply(obj, argArray);
        return obj;
    }
    const proxy = new Proxy(child, handler);
    return proxy;
}
export function anyValue(obj) {
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
export function equalsAny(obj, ...others) {
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
export function noValue(obj) {
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
//# sourceMappingURL=util.js.map