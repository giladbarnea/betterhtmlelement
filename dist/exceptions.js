import { isArray } from "./util";
export function getArgNamesValues(argsWithValues) {
    return Object.entries(argsWithValues)
        .flatMap(([argname, argval]) => `${argname}: ${argval}`)
        .join('", "');
}
export function getArgsWithValues(passedArgs) {
    const argsWithValues = {};
    for (let [argname, argval] of Object.entries(passedArgs)) {
        if (argval !== undefined) {
            argsWithValues[argname] = argval;
        }
    }
    return argsWithValues;
}
export class MutuallyExclusiveArgs extends Error {
    constructor(passedArgs, details) {
        const argsWithValues = getArgsWithValues(passedArgs);
        const argNamesValues = getArgNamesValues(argsWithValues);
        let message = `Didn't receive exactly one arg. `;
        message += `Instead, out of ${Object.keys(passedArgs).length} received (${Object.keys(passedArgs)}), ${Object.keys(argsWithValues).length} had value: "${argNamesValues}". ${details ? 'Details: ' + details : ''}`;
        super(message);
    }
}
export class NotEnoughArgs extends Error {
    constructor(expected, passedArgs, details) {
        const argsWithValues = getArgsWithValues(passedArgs);
        const argNamesValues = getArgNamesValues(argsWithValues);
        let message;
        if (isArray(expected)) {
            let [min, max] = expected;
            if (max === undefined) {
                message = `Didn't receive enough args: expected at least ${min}. `;
            }
            else {
                message = `Didn't receive enough args: expected between ${min} and ${max}. `;
            }
        }
        else {
            message = `Didn't receive enough args: expected exactly ${expected}. `;
        }
        message += `Out of ${Object.keys(passedArgs).length} received (${Object.keys(passedArgs)}), ${Object.keys(argsWithValues).length} had value: "${argNamesValues}". ${details ? 'Details: ' + details : ''}`;
        super(message);
    }
}
//# sourceMappingURL=exceptions.js.map