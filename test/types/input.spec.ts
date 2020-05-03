import {input, Div, Input, BetterHTMLElement} from "../../src/index";
// npm test "input\.spec\.ts"
describe('{query: ...}', () => {
    test("input()", () => {
        let a = input({query: 'input'});
        let b = input({query: 'input[type=checkbox]'});
        let d = new Input({query: 'input'});
        let e = new Input({query: 'input[type=checkbox]'});
    });
    test("input({query: 'div'})", () => {
        let SHOULDFAILa = input({query: 'div'});
        let SHOULDFAILb = new Input({query: 'div'});
        let c = input({query: 'div.myclass'}); // can't squiggly
        let d = new Input({query: 'div.myclass'}); // can't squiggly
    });
});
describe('{htmlElement: ...}', () => {
    test("input()", () => {
        let a = input({htmlElement: document.createElement('input')});
    });
    test("input({query: 'div'})", () => {
        let SHOULDFAILa = input({htmlElement: document.createElement('div')});
        let SHOULDFAILb = new Input({htmlElement: document.createElement('div')});
    });
});