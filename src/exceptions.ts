/**Thrown when either too much or not enough arguments were passed. Prints what was expected and what was actually passed.*/
class BadArgumentsAmountError extends Error {
    /**@param expectedArgsNum - Being a number and not array, it implies function requires an exact number of args*/
    constructor(expectedArgsNum: number, passedArgs: object, details?: string)
    /**@param expectedArgsNum - Being a 2-tuple and not a number, implies function requires between this and that number of args*/
    constructor(expectedArgsNum: [ number, number ], passedArgs: object, details?: string)
    constructor(expectedArgsNum: number | [ number, number ], passedArgs: object, details?: string) {
        const requiresExactNumOfArgs: boolean = !Array.isArray(expectedArgsNum);
        const argsWithValues = BadArgumentsAmountError.getArgsWithValues(passedArgs);
        const argNamesValues: string = BadArgumentsAmountError.getArgNamesValues(argsWithValues);
        let message;
        if ( requiresExactNumOfArgs ) {
            message = `Didn't receive exactly ${expectedArgsNum} arg. `
        } else {
            message = `Didn't receive between ${expectedArgsNum[0]} to ${expectedArgsNum[1]} args. `
        }
        message += `Instead, out of ${Object.keys(passedArgs).length} received (${Object.keys(passedArgs)}), ${Object.keys(argsWithValues).length} had value: "${argNamesValues}". ${details ? 'Details: ' + details : ''}`;
        super(message);
    }
    
    static getArgNamesValues(argsWithValues: object): string {
        return Object.entries(argsWithValues)
            // @ts-ignore
                     .flatMap(([ argname, argval ]) => `${argname}: ${argval}`)
                     .join('", "');
    }
    
    static getArgsWithValues(passedArgs: object) {
        const argsWithValues: object = {};
        for ( let [ argname, argval ] of Object.entries(passedArgs) ) {
            if ( argval !== undefined )
                argsWithValues[argname] = argval;
        }
        return argsWithValues;
    }
}



