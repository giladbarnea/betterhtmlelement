class BadArgumentsAmountError extends Error {
    constructor(expectedArgsNum: number | number[], passedArgs) {
        const requiresExactNumOfArgs = !Array.isArray(expectedArgsNum);
        const validArgs = {};
        for (let [argname, argval] of Object.entries(passedArgs)) {
            if (argval)
                validArgs[argname] = argval;
        }
        const argNamesValues = Object.entries(validArgs).flatMap(([argname, argval]) => `${argname}: ${argval}`).join(', ');
        let message;
        if (requiresExactNumOfArgs) {
            message = `Didn't receive exactly ${expectedArgsNum} arg. `
        } else {
            
            message = `Didn't receive between ${expectedArgsNum[0]} to ${expectedArgsNum[1]} args. `
        }
        message += `Instead, out of ${Object.keys(passedArgs).length} received, ${Object.keys(validArgs).length} had value: ${argNamesValues}`;
        super(message);
    }
    
    
}



