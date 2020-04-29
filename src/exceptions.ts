/**Thrown when either too much or not enough arguments were passed. Prints what was expected and what was actually passed.*/
class MutuallyExclusiveArgs extends Error {
    constructor(passedArgs: object, details?: string) {
        const argsWithValues = MutuallyExclusiveArgs.getArgsWithValues(passedArgs);
        const argNamesValues: string = MutuallyExclusiveArgs.getArgNamesValues(argsWithValues);
        let message = `Didn't receive exactly one arg.`;
        message += `Instead, out of ${Object.keys(passedArgs).length} received (${Object.keys(passedArgs)}), ${Object.keys(argsWithValues).length} had value: "${argNamesValues}". ${details ? 'Details: ' + details : ''}`;
        super(message);
    }

    static getArgNamesValues(argsWithValues: object): string {
        return Object.entries(argsWithValues)
            // @ts-ignore
            .flatMap(([argname, argval]) => `${argname}: ${argval}`)
            .join('", "');
    }

    static getArgsWithValues(passedArgs: object) {
        const argsWithValues: object = {};
        for (let [argname, argval] of Object.entries(passedArgs)) {
            if (argval !== undefined) {
                argsWithValues[argname] = argval;
            }
        }
        return argsWithValues;
    }
}



