// import {isArray} from "./util";

function getArgNamesValues(argsWithValues: object): string {
    return Object.entries(argsWithValues)
        // @ts-ignore
        .flatMap(([argname, argval]) => `${argname}: ${argval}`)
        .join('", "');
}

function getArgsWithValues(passedArgs: object) {
    const argsWithValues: object = {};
    for (let [argname, argval] of Object.entries(passedArgs)) {
        if (argval !== undefined) {
            argsWithValues[argname] = argval;
        }
    }
    return argsWithValues;
}

/**Prints what was expected and what was actually passed.*/
class MutuallyExclusiveArgs extends Error {
    constructor(passedArgs: object, details?: string) {
        const argsWithValues = getArgsWithValues(passedArgs);
        const argNamesValues: string = getArgNamesValues(argsWithValues);
        let message = `Didn't receive exactly one arg. `;
        message += `Instead, out of ${Object.keys(passedArgs).length} received (${Object.keys(passedArgs)}), ${Object.keys(argsWithValues).length} had value: "${argNamesValues}". ${details ? 'Details: ' + details : ''}`;
        super(message);
    }


}

class NotEnoughArgs extends Error {
    constructor(expected: number | number[], passedArgs: object, details?: string) {
        const argsWithValues = getArgsWithValues(passedArgs);
        const argNamesValues: string = getArgNamesValues(argsWithValues);
        let message;
        if (isArray(expected)) {
            let [min, max] = expected;
            if (max === undefined) {
                message = `Didn't receive enough args: expected at least ${min}. `
            } else {
                message = `Didn't receive enough args: expected between ${min} and ${max}. `
            }
        } else {
            message = `Didn't receive enough args: expected exactly ${expected}. `;
        }

        message += `Out of ${Object.keys(passedArgs).length} received (${Object.keys(passedArgs)}), ${Object.keys(argsWithValues).length} had value: "${argNamesValues}". ${details ? 'Details: ' + details : ''}`;
        super(message);
    }
}