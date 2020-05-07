// npm test "input\.spec\.ts"
describe('{query: ...}', () => {
    test("sanity", () => {
        const a: Input = input({query: 'input'});
        const b: Input = input({query: 'input[type=checkbox]'});
        const d: Input = new Input({query: 'input'});
        const e: Input = new Input({query: 'input[type=checkbox]'});
    });
    test("input({query: 'div'})", () => {

        const c = input({query: 'div.myclass'}); // can't squiggly
        const d = new Input({query: 'div.myclass'}); // can't squiggly
    });
});
describe('{htmlElement: ...}', () => {
    test("sanity", () => {
        const a = input({htmlElement: document.createElement('input')});
    });
    test("input({query: 'div'})", () => {
        const SHOULDFAILa = input({htmlElement: document.createElement('div')});
        const SHOULDFAILb = input({query: 'div'});
    });
});

describe("badctor", () => {
    test("badctor", () => {
        expect(() => {
            input({});
            input();
        }).not.toThrowError();
    })

});

