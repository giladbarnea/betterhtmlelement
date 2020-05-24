function expectsMouseEventFunction(fn) {
}
const mouseEventFunction = (event) => {
};
expectsMouseEventFunction(mouseEventFunction);
function expectsMouseEventFunctionPairs(pairs) {
    for (let [evName, evFn] of Object.entries(pairs)) {
        expectsMouseEventFunction(evFn);
    }
}
const pairs = { "mouseover": mouseEventFunction };
expectsMouseEventFunctionPairs(pairs);
//# sourceMappingURL=misc.js.map