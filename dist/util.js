function* enumerate(obj) {
    if (Array.isArray(obj)) {
        let i = 0;
        for (let x of obj) {
            yield [i, x];
        }
    }
    else {
        for (let prop in obj) {
            yield [prop, obj[prop]];
        }
    }
}
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=util.js.map