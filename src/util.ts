function isArray<T>(obj: T[]): obj is Array<T> {
    return obj && (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function');
}

// function enumerate(obj: undefined): [void];

// function enumerate<T>(obj: T): never;
// function enumerate<T>(obj: T): [keyof T, T[keyof T]][];
// function enumerate<T>(obj: [T]): [number, T][];
function enumerate<T>(obj: T): T extends (infer R)[] ? [number, R][] : [keyof T, T[keyof T]][] {
    if (obj === undefined || isObject(obj))
        return [];
    if (obj === null)
        throw new TypeError('null is not iterable');
    let array = [];
    if (isArray(obj)) {
        let i: number = 0;
        for (let x of obj) {
            array.push([i, x]);
            i++;
        }
    } else {
        for (let prop in obj) {
            array.push([prop, obj[prop]]);
        }
    }
    return array;
}

function wait(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function equalsAny(obj: any, ...others: any[]): boolean {
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

// child extends sup
function extend(sup, child) {
    child.prototype = sup.prototype;
    const handler = {
        construct
    };
    
    // "new BoyCls"
    function construct(_, argArray) {
        const obj = new child;
        sup.apply(obj, argArray);    // calls PersonCtor. Sets name
        child.apply(obj, argArray); // calls BoyCtor. Sets age
        return obj;
    }
    
    
    // @ts-ignore
    const proxy = new Proxy(child, handler);
    return proxy;
}

// underscore.js
function isObject(obj) {
    return typeof obj === 'object' && !!obj;
}

function shallowProperty(key) {
    return function (obj) {
        return obj == null ? void 0 : obj[key];
    };
}

const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
const getLength = shallowProperty('length');

function isArrayLike(collection) {
    const length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}


