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
        || obj === ""
    ) {
        return [] as KVPairs<T>;
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
    return array as KVPairs<T>;
}


/*let obj0: { a: boolean, b: number } = {a: true, b: 1};
let arr0: number[] = [1, 2, 3, 4];
let arr1: string[] = ["1", "2", "3", "4"];
let num0: number = 5;
let undefined0: undefined;
let null0: null = null;
let boolean0: boolean = true;

let MyFoo = enumerate(arr0);
for (let [k, v] of MyFoo) {

}*/


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
function isFoo<T extends HTMLElementOrWindowOrDocument>(val): val is EventFunctionMap<T> {
    return val instanceof HTMLElement;
}

declare function assertIsFoo<T extends HTMLElementOrWindowOrDocument>(val): asserts val is EventFunctionMap<T>;

function isNode(val): val is Node {
    return val instanceof Node
}

function isBHE(val): val is BetterHTMLElement {
    return val instanceof BetterHTMLElement
}

declare function isMap<T>(obj): obj is TMap<T>;


function isArray<T>(obj): obj is Array<T> {
    return typeof obj !== "string" && (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function');
}

function isEmptyArr(collection): boolean {
    return isArray(collection) && getLength(collection) === 0
}

function isEmptyObj(obj): boolean {
    return isObject(obj) && getLength(obj) === 0
}

function isEmpty(obj): boolean {
    // undefined == null
    if (obj == null) return true;
    return getLength(Object.keys(obj)) === 0
}

function isFunction(fn: AnyFunction): fn is AnyFunction {
    return fn && {}.toString.call(fn) === '[object Function]'
}


// *  underscore.js
function isObject(obj): obj is object {
    return typeof obj === 'object' && !!obj;
}

// function shallowProperty<T>(key: string): (obj: T) => T extends null ? undefined : T[keyof T] {
function shallowProperty<T>(key: string): (obj: T) => T extends null | undefined ? undefined : T[keyof T] {
    return function (obj) {
        return obj?.[key];
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


/*new BetterHTMLElement({tag: 'div'}).on({
    
    copy: () => {
    },
    animationend: () => {
    },
    hashchange: () => {
    },
    
});
new BetterWindow().on({
    beforeprint: () => {
    },
    copy: () => {
    },
    animationend: () => {
    },
    hashchange: () => {
    },
    
    
});*/
new BetterHTMLElement({id: 'lol'}).cacheChildren({hi: {wow: "a"}})


