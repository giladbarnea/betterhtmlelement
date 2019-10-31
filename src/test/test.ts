// ***  util.ts
function test_isObject() {
    let errored = false;
    const expect_true = [
        {},
        {hi: "bye"},
        [],
        new Boolean(),
        new Number()
    ];
    const expect_false = [
        undefined,
        null,
        () => {
        },
        function () {
        },
        Boolean,
        Boolean(),
        Number,
        Number(),
        Function,
        Function()
    ];
    for (let t of expect_true) {
        if (isObject(t) !== true) {
            errored = true;
            console.error(`test_isObject | Expected true, but isnt: `, t)
        }
    }
    for (let f of expect_false) {
        if (isObject(f) !== false) {
            errored = true;
            console.error(`test_isObject | Expected false, but isnt: `, f)
        }
    }
    if (!errored)
        console.log('test_isObject() all pass');
}

function test_isEmptyObject() {
    let errored = false;
    const expect_true = [
        {},
        new Boolean(),
        new Number()
    ];
    const expect_false = [
        undefined,
        null,
        {hi: "bye"},
        [],
        () => {
        },
        function () {
        },
        Boolean,
        Boolean(),
        Number,
        Number(),
        Function,
        Function(),
        new Function()
    ];
    for (let t of expect_true) {
        if (isEmptyObj(t) !== true) {
            errored = true;
            console.error(`test_isEmptyObject | Expected true, but isnt: `, t)
        }
    }
    for (let f of expect_false) {
        if (isEmptyObj(f) !== false) {
            errored = true;
            console.error(`test_isEmptyObject | Expected false, but isnt: `, f)
        }
    }
    if (!errored)
        console.log('test_isEmptyObject() all pass');
}

function test_isFunction() {
    let errored = false;
    const expect_true = [
        () => {
        },
        function () {
        },
        Function,
        Function(),
        new Function(),
        Boolean,
        Number,
    ];
    const expect_false = [
        {},
        Boolean(),
        new Boolean(),
        Number(),
        new Number(),
        undefined,
        null,
        {hi: "bye"},
        []
    ];
    for (let i in expect_true) {
        let t = expect_true[i];
        if (isFunction(t) !== true) {
            errored = true;
            console.error(`test_isFunction | Expected true, but isnt (${i}): `, t)
        }
    }
    for (let i in expect_false) {
        let f = expect_false[i];
        if (isFunction(f) !== false) {
            errored = true;
            console.error(`test_isFunction | Expected false, but isnt (${i}). f: `, f, ', Actual: ', isFunction(f))
        }
    }
    if (!errored)
        console.log('test_isFunction() all pass');
}

test_isObject();
test_isEmptyObject();
test_isFunction();
