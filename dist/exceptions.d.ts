export declare class MutuallyExclusiveArgs extends Error {
    constructor(passedArgs: object, details?: string);
}
export declare class NotEnoughArgs extends Error {
    constructor(expected: number | number[], passedArgs: object, details?: string);
}
