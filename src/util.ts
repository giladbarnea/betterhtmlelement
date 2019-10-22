function assertIsHTMLElement(val: any): asserts val is HTMLElement {
    if (!(val instanceof HTMLElement)) {
        console.log({val});
        throw new TypeError(`Not instanceof HTMLElement`)
    }
}

function assertIsNode(val: any): asserts val is Node {
    if (!(val instanceof Node)) {
        console.log({val});
        throw new TypeError(`Not instanceof Node`)
    }
}

type Enumerated<T> =
    T extends (infer U)[] ? [number, U][]
        : T extends TMap<(infer U)> ? [keyof T, U][]
        : T extends boolean ? never : any;

function enumerate<T>(obj: T): Enumerated<T> {
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
    let typeofObj = typeof obj;
    if (
        obj === undefined
        || isEmptyObj(obj)
        || isEmptyArr(obj)
        // @ts-ignore
        || obj === ""
    ) {
        return [] as Enumerated<T>;
    }
    
    if (
        obj === null
        || typeofObj === "boolean"
        || typeofObj === "number"
        || typeofObj === "function"
    ) {
        throw new TypeError(`${typeofObj} object is not iterable`);
    }
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
    return array as Enumerated<T>;
}


/*let obj0: { a: boolean, b: number } = {a: true, b: 1};
let arr0: number[] = [1, 2, 3, 4];
let arr1: string[] = ["1", "2", "3", "4"];
let num0: number = 5;
let undefined0: undefined;
let null0: null = null;
let boolean0: boolean = true;

let MyFoo = enumerate(undefined0);
if (MyFoo === true) {
    console.log('hi');
}
*/


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

// true for string
function isArray<T>(obj): obj is Array<T> {
    return obj && (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function');
}

function isEmptyArr(collection): boolean {
    return isArray(collection) && getLength(collection) === 0
}

function isEmptyObj(obj): boolean {
    return isObject(obj) && Object.keys(obj).length === 0
}

type TReturnBoolean = (s: string) => boolean;
type AnyFunction = (...args: any[]) => any;

function isFunction(fn: AnyFunction): fn is AnyFunction {
    return fn && {}.toString.call(fn) === '[object Function]'
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


function getLength(collection): number {
    return shallowProperty('length')(collection)
}


/*const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

function isArrayLike(collection): boolean {
    const length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}
*/


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

new BetterWindow().e;
