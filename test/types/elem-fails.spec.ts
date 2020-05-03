import {elem, Div, Input, BetterHTMLElement} from "../../src/index";

describe('elem', () => {


    test("elem({htmlElement: ...}) fails", () => {
        let SHOULDFAIL: BetterHTMLElement<HTMLInputElement> = elem({htmlElement: document.createElement("div")});
    })


});

