// function enumerate(obj: undefined): [void];

// function enumerate<T>(obj: T): never;
// function enumerate<T>(obj: T): [keyof T, T[keyof T]][];
type Enumerated<T> =
    T extends (infer R)[]
    ? [number, R][]
    : [keyof T, T[keyof T]][];

// function enumerate<T>(obj: T): T extends string[]
//     ? [number, string][]
//     : [keyof T, T[keyof T]][] {
function enumerateOrig<T>(obj: T): T extends string[]
    ? [number, string][]
    : [keyof T, T[keyof T]][] {
    if (obj === undefined || isEmptyObj(obj) || isEmptyArr(obj))
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

// declare function enumerate<T, AT extends Array<T>>(obj: AT): [number, T][];
declare function enumerate<T>(obj: T):
    T extends (infer U)[] ? [number, U][]
    : T extends TMap<(infer U)> ? [keyof T, U][] : never;
    
// declare function enumerate<T>(obj: {a:number,b:number}): [string, number][];
// function enumerate(obj) {
//     if (isArray(obj)) {
//         return [[0, "hi"], ["1", "bye"]];
//     }
//     throw new Error('');
// }
let obj0: { a: boolean, b: number } = { a: true, b: 1 };
let arr0: number[] = [1, 2, 3, 4];
let num0: number = 5;
let undefined0:undefined;
let MyFoo = enumerate(undefined0);


function wait(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*function equalsAny(obj: any, ...others: any[]): boolean {
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
*/

function isArray<T>(obj): obj is Array<T> {
    return obj && (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function');
}

function isEmptyArr(collection): boolean {
    return isArray(collection) && getLength(collection) === 0
}

function isEmptyObj(obj): boolean {
    return isObject(obj) && Object.keys(obj).length === 0
}

// *  underscore.js
function isObject(obj): boolean {
    return typeof obj === 'object' && !!obj;
}

function shallowProperty<T>(key: string): (obj: T) => T extends null ? undefined : T[keyof T] {
    return function (obj) {
        return obj == null ? void 0 : obj[key];
    };
}

const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

function getLength(collection): number {
    return shallowProperty('length')(collection)
}

// const getLength = shallowProperty('length');

function isArrayLike(collection): boolean {
    const length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}


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
        sup.apply(obj, argArray);    // calls PersonCtor. Sets name
        child.apply(obj, argArray); // calls BoyCtor. Sets age
        return obj;
    }


    // @ts-ignore
    const proxy = new Proxy(child, handler);
    return proxy;
}
