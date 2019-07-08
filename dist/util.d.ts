declare function enumerate<T>(obj: T[]): IterableIterator<[number, T]>;
declare function enumerate<T>(obj: T): IterableIterator<[keyof T, T[keyof T]]>;
declare function wait(ms: number): Promise<any>;
