function enumerate<T>(obj: T[]): IterableIterator<[number, T]>;
function enumerate<T>(obj: T): IterableIterator<[keyof T, T[keyof T]]>;
function* enumerate(obj) {
    if (Array.isArray(obj)) {
        let i: number = 0;
        for (let x of obj) {
            yield [i, x];
        }
    } else {
        for (let prop in obj) {
            yield [prop, obj[prop]];
        }
    }
}

function wait(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

