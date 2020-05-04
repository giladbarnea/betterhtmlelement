declare function getArgNamesValues(argsWithValues: object): string;
declare function getArgsWithValues(passedArgs: object): object;
declare class MutuallyExclusiveArgs extends Error {
    constructor(passedArgs: object, details?: string);
}
declare class NotEnoughArgs extends Error {
    constructor(expected: number | number[], passedArgs: object, details?: string);
}
