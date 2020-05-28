export declare function getArgNamesValues(argsWithValues: object): string;
export declare function getArgsWithValues(passedArgs: object): object;
export declare class MutuallyExclusiveArgs extends Error {
    constructor(passedArgs: object, details?: string);
}
export declare class NotEnoughArgs extends Error {
    constructor(expected: number | number[], passedArgs: object, details?: string);
}
