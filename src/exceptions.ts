function getArgsFullRepr(argsWithValues: TMap<any>): string {
    return Object.entries(argsWithValues)
        // @ts-ignore
        .flatMap(([argname, argval]) => `${argname}: ${isObject(argval) ? `{${getArgsFullRepr(argval)}}` : argval}`)
        .join('", "');
}

function getArgsWithValues(passedArgs: TMap<any>) {
    const argsWithValues: TMap<any> = {};
    for (let [argname, argval] of Object.entries(passedArgs)) {
        if (argval !== undefined) {
            argsWithValues[argname] = argval;
        }
    }
    return argsWithValues;
}

function summary(argset: TMap<any>): string {
    const argsWithValues = getArgsWithValues(argset);
    const argsFullRepr: string = getArgsFullRepr(argsWithValues);
    let argNames = Object.keys(argset);
    return `${argNames.length} args (${argNames}); ${Object.keys(argsWithValues).length} had value: "${argsFullRepr}".\n`;
}

/**Prints what was expected and what was actually passed.*/
class MutuallyExclusiveArgs extends Error {
    constructor(passedArgs: TMap<any> | TMap<any>[], details?: string) {
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


class NotEnoughArgs extends Error {
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