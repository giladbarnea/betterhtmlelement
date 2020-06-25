// function enumerate(obj: undefined): [void];

// function enumerate<T>(obj: T): never;
// function enumerate<T>(obj: T): [keyof T, T[keyof T]][];


// function enumerate<T>(obj: T): T extends string[]
//     ? [number, string][]
//     : [keyof T, T[keyof T]][] {
import { Enumerated, TMap } from "./typings";
import { BetterHTMLElement } from "./index.js";


export function enumerate<T>(obj: T): Enumerated<T> {
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

export function wait(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function bool(val: any): boolean {
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
        } else {
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

export function isArray<T>(obj): obj is Array<T> { // same as Array.isArray
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

export function isEmptyArr(collection): boolean {
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
    return isArray(collection) && getLength(collection) === 0
}

export function isEmptyObj(obj): boolean {
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
    return isObject(obj) && !isArray(obj) && Object.keys(obj).length === 0
}


export function isFunction<F>(fn: F): fn is F
export function isFunction(fn: (...args: any[]) => any): fn is (...args: any[]) => any
export function isFunction(fn) {
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
    return !!fn && toStringed === '[object Function]'
}

export function anyDefined(obj): boolean {
    let array;
    if (isObject(obj)) {
        array = Object.values(obj);
    } else if (isArray(obj)) {
        array = obj;
    } else {
        throw new TypeError(`expected array or obj, got: ${typeof obj}`);
    }
    return array.filter(x => x !== undefined).length > 0;
}

export function anyTruthy(obj): boolean {
    let array;
    if (isObject(obj)) {
        array = Object.values(obj);
    } else if (isArray(obj)) {
        array = obj;
    } else {
        throw new TypeError(`expected array or obj, got: ${typeof obj}`);
    }
    return array.filter(x => bool(x)).length > 0;
}

export function allUndefined(obj): boolean {
    let array;
    if (isObject(obj)) {
        array = Object.values(obj)
    } else if (isArray(obj)) {
        array = obj;
    } else {
        throw new TypeError(`expected array or obj, got: ${typeof obj}`)
    }
    return array.filter(x => x !== undefined).length === 0
}

/**Check every `checkInterval` ms if `cond()` is truthy. If, within `timeout`, cond() is truthy, return `true`. Return `false` if time is out.
 * @example
 * // Give the user a 200ms chance to get her pointer over "mydiv". Continue immediately once she does, or after 200ms if she doesn't.
 * mydiv.pointerenter( () => mydiv.pointerHovering = true; )
 * const pointerOnMydiv = await waitUntil(() => mydiv.pointerHovering, 200, 10);*/
export async function waitUntil(cond: () => boolean, checkInterval: number = 20, timeout: number = Infinity): Promise<boolean> {
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

export function isBHE<T extends BetterHTMLElement>(bhe: T, bheSubType): bhe is T {
    return (bhe instanceof bheSubType)
}

export function isType<T>(arg: T): arg is T {
    return true
}

export function isTMap<T>(obj: TMap<T>): obj is TMap<T> {
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
    return {}.toString.call(obj) == '[object Object]'
}


// *  underscore.js
/**true for any non-primitive, including array, function*/
export function isObject(obj): boolean {
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

export function shallowProperty<T>(key: string): (obj: T) => T extends null ? undefined : T[keyof T] {
    return function (obj) {
        return obj == null ? void 0 : obj[key];
    };
}


export function getLength(collection): number {
    return shallowProperty('length')(collection)
}


const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

export function isArrayLike(collection): boolean {
    const length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}


// *  misc
// child extends sup
export function extend(sup, child) {
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

export function anyValue(obj) {
    let array;
    if (isObject(obj)) {
        array = Object.values(obj);
    } else if (isArray(obj)) {
        array = obj;
    } else {
        throw new TypeError(`expected array or obj, got: ${typeof obj}`);
    }
    return array.filter(x => Boolean(x)).length > 0;
}

export function equalsAny(obj: any, ...others: any[]): boolean {
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

export function noValue(obj): boolean {
    let array;
    if (isObject(obj)) {
        array = Object.values(obj)
    } else if (isArray(obj)) {
        array = obj;
    } else {
        throw new TypeError(`expected array or obj, got: ${typeof obj}`)
    }
    return array.filter(x => Boolean(x)).length === 0
}






