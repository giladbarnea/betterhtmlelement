import { TMap } from "./typings.js";
export declare function getArgsFullRepr(argsWithValues: TMap<any>): string;
export declare function getArgsWithValues(passedArgs: TMap<any>): TMap<any>;
export declare function summary(argset: TMap<any>): string;
/**Prints what was expected and what was actually passed.*/
export declare class MutuallyExclusiveArgs extends Error {
    /**@param passedArgs - key:value pairs of argName:argValue, where each arg is mutually exclusive with all others*/
    constructor(passedArgs: TMap<any>, details?: string);
    /**@param passedArgs - Array of mutually exclusive sets of args, where an arg from one set means there can't be any args from the other sets.
     * Each set is key:value pairs of argName:argValue.*/
    constructor(passedArgs: TMap<any>[], details?: string);
}
export declare class NotEnoughArgs extends Error {
    constructor(expected: number | number[], passedArgs: TMap<any> | TMap<any>[], relation?: 'each' | 'either');
}
export declare class BHETypeError extends TypeError {
    constructor(options: {
        faultyValue: TMap<any>;
        expected?: any | any[];
        where?: string;
        message?: string;
    });
}
export declare class ValueError extends BHETypeError {
}
