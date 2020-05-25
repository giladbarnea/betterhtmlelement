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


function bool(val: any): boolean {

    if (val === null) {
        return false
    }
    const typeofval = typeof val;
    if (typeofval !== 'object') {
        if (typeofval === 'function') {
            return true
        } else {
            return !!val;
        }
    }
    return Object.keys(val).length !== 0;

}

function wait(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function anyValue(obj): boolean {
    let array;
    if (isObject(obj)) {
        array = Object.values(obj)
    } else if (isArray(obj)) {
        array = obj;
    } else {
        throw new TypeError(`expected array or obj, got: ${typeof obj}`)
    }
    return array.filter(x => Boolean(x)).length > 0
}

function noValue(obj): boolean {
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

function isArray<T>(obj): obj is Array<T> {
    return typeof obj !== "string" && (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function');
}

function isEmptyArr(collection): boolean {
    return isArray(collection) && getLength(collection) === 0
}

function isEmptyObj(obj): boolean {
    return isObject(obj) && Object.keys(obj).length === 0
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

function isFunction<T>(fn: T): fn is T {
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


