import {input, Div, Input, BetterHTMLElement} from "../../src/index";
// npm test "input\.spec\.ts"
describe('{tag: ...}', () => {
    test("input()", () => {
        input({tag: 'input'});
        input({tag: 'shlomo'});
    });
    test("input({tag: 'div'})", () => {
        input({tag: 'div'});
    });
});