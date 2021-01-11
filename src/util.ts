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
        throw new TypeError(`enumerate(obj) | obj (${typeofObj}) is not iterable (${obj})`);
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

function wait(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function bool(val: any): boolean {
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

function copy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
}

/**
 `true` if objects have the same CONTENT. This means that order doesn't matter, but loose data structure does matter
 (i.e. if `a` an array, so should be `b`)
 @example
 > equal( [1,2], [2,1] )
 true

 */
function equal(a, b): boolean {
    if (a === b) {
        return true;
    }
    if (isArray(a)) {
        if (!isArray(b)) {
            return false;
        }
        if (a.length != b.length) {
            return false;
        }
        const a_sorted = copy(a).sort();
        const b_sorted = copy(b).sort();
        // a.sort();
        // b.sort();
        for (let i = 0; i < a_sorted.length; i++) {
            if (!equal(a_sorted[i], b_sorted[i])) {
                return false;
            }
        }
        return true;
    }
    if (isObject(a)) { // I think it's ok to check if object and not to check if TMap
        if (!isObject(b)) {
            return false;
        }
        const a_keys = Object.keys(a);
        const b_keys = Object.keys(b);
        if (a_keys.length != b_keys.length) {
            return false;
        }
        const a_keys_sorted = copy(a_keys).sort();
        const b_keys_sorted = copy(b_keys).sort();

        for (let i = 0; i < a_keys_sorted.length; i++) {
            if (!equal(a_keys_sorted[i], b_keys_sorted[i])) {
                return false;
            }
            if (!equal(a[a_keys_sorted[i]], b[b_keys_sorted[i]])) {
                return false;
            }
        }
        return true;
    }
    return a === b;
}

function isArray<T>(obj): obj is Array<T> {
    // same as Array.isArray
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

function isEmptyArr(collection): boolean {
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

function isEmptyObj(obj): boolean {
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


function isFunction<F>(fn: F): fn is F {
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

function anyDefined(obj: Array<any> | TMap<any>): boolean {
    let array;
    if (isTMap(obj)) {
        array = Object.values(obj);
    } else if (isArray(obj)) {
        array = obj;
    } else {
        throw new TypeError(`anyDefined(obj): expected array or dict-like, got ${typeof obj}: ${obj}`);
    }
    return array.filter(x => x !== undefined).length > 0;
}

function anyTruthy(obj: Array<any> | TMap<any>): boolean {
    let array;
    if (isTMap(obj)) {
        array = Object.values(obj);
    } else if (isArray(obj)) {
        array = obj;
    } else {
        throw new TypeError(`anyTruthy(obj): expected array or dict-like, got ${typeof obj}: ${obj}`);
    }
    return array.filter(x => bool(x)).length > 0;
}

function allUndefined(obj: Array<any> | TMap<any>): boolean {
    let array;
    if (isTMap(obj)) {
        array = Object.values(obj)
    } else if (isArray(obj)) {
        array = obj;
    } else {
        throw new TypeError(`allUndefined(obj): expected array or dict-like, got ${typeof obj}: ${obj}`);
    }
    return array.filter(x => x !== undefined).length === 0
}


function prettyNode(node: NodeOrBHE): string {
    if (!node) { // undefined, ...
        return `${node}`
    }
    if (node instanceof BetterHTMLElement) {
        return node.toString();
    }
    let ret = '';
    let str = `${node}`;
    let type = str.match(/\[object (\w+)\]/)[1] ?? typeof node;
    let cls;
    let id;
    let tag;

    // maybe node is Element, try getting more information
    if (node instanceof Element) {
        cls = node.className;
        id = node.id;
        tag = node.tagName;
    }
    if (tag) {
        ret += `${tag} (${type})`;
    } else {
        ret += type;
    }
    if (id) {
        ret += ` #${id}`
    }
    if (cls) {
        ret += `.${cls}`
    }
    return ret;
}

/**Check every `checkInterval` ms if `cond()` is truthy. If, within `timeout`, cond() is truthy, return `true`. Return `false` if time is out.
 * @example
 * // Give the user a 200ms chance to get her pointer over "mydiv". Continue immediately once she does, or after 200ms if she doesn't.
 * mydiv.pointerenter( () => mydiv.pointerHovering = true; )
 * const pointerOnMydiv = await waitUntil(() => mydiv.pointerHovering, 200, 10);*/
async function waitUntil(cond: () => boolean, checkInterval: number = 20, timeout: number = Infinity): Promise<boolean> {
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

/*function isHTMLInputElement(el: HTMLInputElement): el is HTMLInputElement {
    return (el instanceof HTMLInputElement)
}

function isHTMLButtonElement(el: HTMLButtonElement): el is HTMLButtonElement {
    return (el instanceof HTMLButtonElement)
}*/

function isBHE<T extends BetterHTMLElement>(bhe: T, bheSubType): bhe is T {
    return (bhe instanceof bheSubType)
}

function isType<T>(arg: T): arg is T {
    return true
}

function isTMap<T>(obj: TMap<T>): obj is TMap<T> {
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
function isObject(obj): boolean {
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

function shallowProperty<T>(key: string): (obj: T) => T extends null ? undefined : T[keyof T] {
    return function (obj) {
        return obj == null ? void 0 : obj[key];
    };
}


function getLength(collection): number {
    return shallowProperty('length')(collection)
}


