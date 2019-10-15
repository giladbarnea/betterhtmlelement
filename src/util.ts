function isArray<T>(obj: T[]): obj is Array<T> {
    return obj && (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function');
}


function enumerate(obj: undefined): [void];
function enumerate(obj: null): never;
function enumerate<T>(obj: T[]): [number, T][];
function enumerate<T>(obj: T): [keyof T, T[keyof T]][];
function enumerate(obj) {
    if (obj === undefined)
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

function isEq(obj: any, ...others: any[]) {
    if (isArray(obj) && obj[obj.length - 1]) {
    
    }
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
