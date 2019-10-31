// ***  util.ts
function test_isObject() {
    const expect_true = [{}, {hi: "bye"}, [], new Boolean(), new Number()];
    const expect_false = [undefined, null, () => {
    }, function () {
    }, Boolean(), Number()];
    for (let t of expect_true) {
        if (isObject(t) !== true)
            console.error(`Expected true, but isnt: `, t)
    }
    for (let f of expect_false) {
        if (isObject(f) !== false)
            console.error(`Expected false, but isnt: `, f)
    }
    console.log('test_isObject() all pass');
}

function test_isEmptyObject() {
    const expect_true = [{}, new Boolean(), new Number()];
    const expect_false = [undefined, null, {hi: "bye"}, [], () => {
    }, function () {
    }, Boolean(), Number()];
    for (let t of expect_true) {
        if (isEmptyObj(t) !== true)
            console.error(`Expected true, but isnt: `, t)
    }
    for (let f of expect_false) {
        if (isEmptyObj(f) !== false)
            console.error(`Expected false, but isnt: `, f)
    }
    console.log('test_isEmptyObject() all pass');
}

test_isObject();
test_isEmptyObject();
