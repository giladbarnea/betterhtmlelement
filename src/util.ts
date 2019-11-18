// function enumerate(obj: undefined): [void];

// function enumerate<T>(obj: T): never;
// function enumerate<T>(obj: T): [keyof T, T[keyof T]][];


// function enumerate<T>(obj: T): T extends string[]
//     ? [number, string][]
//     : [keyof T, T[keyof T]][] {


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
    // // ()=>{}    ?
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

/**Check every `checkInterval` ms if `cond()` is truthy. If, within `timeout`, cond() is truthy, return `true`. Return `false` if time is out.
 * @example
 * // Give the user a 200ms chance to get her pointer over "mydiv". Continue immediately once she does, or after 200ms if she doesn't.
 * mydiv.pointerenter( () => mydiv.pointerHovering = true; )
 * const pointerOnMydiv = await waitUntil(() => mydiv.pointerHovering, 200, 10);*/
async function waitUntil(cond: () => boolean, timeout: number = Infinity, checkInterval: number = 20): Promise<boolean> {
    if (checkInterval <= 0)
        throw new Error(`checkInterval <= 0. checkInterval: ${checkInterval}`);
    if (checkInterval > timeout)
        throw new Error(`checkInterval > timeout (${checkInterval} > ${timeout}). Has to be lower than timeout.`);
    
    const loops = timeout / checkInterval;
    if (loops == 1)
        console.warn(`loops == 1, you probably didn't want this to happen`);
    let count = 0;
    while (count < loops) {
        if (cond())
            return true;
        await wait(checkInterval);
        count++;
    }
    return false;
}

function isArray<T>(obj): obj is Array<T> {
    return typeof obj !== "string" && (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function');
}

function isEmptyArr(collection): boolean {
    return isArray(collection) && getLength(collection) === 0
}

function isEmptyObj(obj): boolean {
    // {}               true
    // new Boolean()    true
    // new Number()     true
    // {hi:"bye"}       false
    // []               false
    // undefined        false
    // null             false
    // ()=>{}           false
    // function(){}     false
    // Boolean()        false
    // Number()         false
    return isObject(obj) && !isArray(obj) && Object.keys(obj).length === 0
}


function isFunction(fn: AnyFunction): fn is AnyFunction {
    // ()=>{}           true
    // function(){}     true
    // Function         true
    // Function()       true
    // new Function()   true
    // Boolean          true
    // Number           true
    // {}               false
    // {hi:"bye"}       false
    // []               false
    // Boolean()        false
    // new Boolean()    false
    // Number()         false
    // new Number()     false
    // undefined        false
    // null             false
    let toStringed = {}.toString.call(fn);
    return !!fn && toStringed === '[object Function]'
}


// *  underscore.js
function isObject(obj): boolean {
    // {}               true
    // {hi:"bye"}       true
    // []               true
    // new Boolean()    true
    // new Number()     true
    // undefined        false
    // null             false
    // ()=>{}           false
    // function(){}     false
    // Boolean()        false
    // Number()         false
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
