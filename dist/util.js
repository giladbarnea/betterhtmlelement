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
function bool(val) {
    if (val === null) {
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
    return Object.keys(val).length !== 0;
}
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
function isArray(obj) {
    return typeof obj !== "string" && (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function');
}
function isEmptyArr(collection) {
    return isArray(collection) && getLength(collection) === 0;
}
function isEmptyObj(obj) {
    return isObject(obj) && Object.keys(obj).length === 0;
}
function isBHE(bhe, bheSubType) {
    return (bhe instanceof bheSubType);
}
function isType(arg) {
    return true;
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
//# sourceMappingURL=util.js.map