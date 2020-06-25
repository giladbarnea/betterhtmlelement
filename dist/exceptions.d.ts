import { TMap } from "./typings.js";
export declare function getArgsFullRepr(argsWithValues: TMap<any>): string;
export declare function getArgsWithValues(passedArgs: TMap<any>): TMap<any>;
export declare function summary(argset: TMap<any>): string;
export declare class MutuallyExclusiveArgs extends Error {
    constructor(passedArgs: TMap<any>, details?: string);
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
