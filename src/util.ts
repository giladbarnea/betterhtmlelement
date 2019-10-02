/*function enumerate<T>(obj: T[]): IterableIterator<[number, T]>;
function enumerate<T>(obj: IterableIterator<T>): IterableIterator<[number, T]>;
function enumerate<T>(obj: T): IterableIterator<[keyof T, T[keyof T]]>;
*/
function enumerate(obj) {
    let array = [];
    if (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function') {
        let i: number = 0;
        for (let x of obj) {
            array.push([i, x]);
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
