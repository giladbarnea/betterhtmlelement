import { TMap } from "./typings.js";
import { enumerate, isArray, isObject } from "./util.js";

export function getArgsFullRepr(argsWithValues: TMap<any>): string {
    return Object.entries(argsWithValues)
        // @ts-ignore
        .flatMap(([argname, argval]) => `${argname} (${typeof argval}): ${isObject(argval) ? `{${getArgsFullRepr(argval)}}` : argval}`)
        .join('", "');
}

export function getArgsWithValues(passedArgs: TMap<any>) {
    const argsWithValues: TMap<any> = {};
    for (let [argname, argval] of Object.entries(passedArgs)) {
        if (argval !== undefined) {
            argsWithValues[argname] = argval;
        }
    }
    return argsWithValues;
}

export function summary(argset: TMap<any>): string {
    const argsWithValues = getArgsWithValues(argset);
    const argsFullRepr: string = getArgsFullRepr(argsWithValues);
    let argNames = Object.keys(argset);
    return `${argNames.length} args (${argNames}); ${Object.keys(argsWithValues).length} had value: "${argsFullRepr}".\n`;
}

/**Prints what was expected and what was actually passed.*/
export class MutuallyExclusiveArgs extends Error {
    /**@param passedArgs - key:value pairs of argName:argValue, where each arg is mutually exclusive with all others*/
    constructor(passedArgs: TMap<any>, details?: string)
    /**@param passedArgs - Array of mutually exclusive sets of args, where an arg from one set means there can't be any args from the other sets.
     * Each set is key:value pairs of argName:argValue.*/
    constructor(passedArgs: TMap<any>[], details?: string)
    /**Either a argName:argValue map or an array of such maps, to indicate mutually exclusive sets of args.*/
    constructor(passedArgs, details?: string) {
        let message = `Didn't receive exactly one arg`;
        if (isArray(passedArgs)) {
            message += ` from the following mutually exclusive sets of args.\n`;
            for (let [i, argset] of enumerate(passedArgs)) {
                message += `Out of set #${i + 1}, which consists of ${summary(argset)}`
            }
        } else {
            message += ` from the following mutually exclusive set of args.\nOut of ${summary(passedArgs)}`
        }

        if (details) {
            message += `Details: ${details}`
        }
        super(message);
    }


}


export class NotEnoughArgs extends Error {
    constructor(expected: number | number[], passedArgs: TMap<any> | TMap<any>[], relation?: 'each' | 'either') {
        let message;
        if (isArray(expected)) {
            let [min, max] = expected;
            if (max === undefined) {
                message = `Didn't receive enough args: expected at least ${min}`
            } else {
                message = `Didn't receive enough args: expected between ${min} and ${max}`
            }
        } else {
            message = `Didn't receive enough args: expected exactly ${expected}`;
        }

        if (isArray(passedArgs)) {
            message += ` from ${relation} set of arguments.\n`;
            for (let [i, argset] of enumerate(passedArgs)) {
                message += `Out of set #${i + 1}, which consists of ${summary(argset)}`
            }

        } else {
            message += ` from the following set of args.\nOut of ${summary(passedArgs)}`;
        }

        super(message);
    }
}

export class BHETypeError extends TypeError {

    constructor(options: { faultyValue: TMap<any>, expected?: any | any[], where?: string, message?: string }) {
        let { faultyValue, expected, where, message } = options;
        const repr = getArgsFullRepr(faultyValue);
        let msg = '';
        if (where) {
            msg += `${where} | `
        }
        msg += `Got ${repr}. `;
        if (expected) {
            if (isArray(expected)) {
                expected = expected.join(" | ")
            }
            msg += ` Expected: ${expected}. `
        }
        if (message) {
            msg += `Details:\n${message}`
        }
        super(msg);
    }
}

export class ValueError extends BHETypeError {

}