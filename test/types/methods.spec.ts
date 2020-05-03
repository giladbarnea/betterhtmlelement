import {div, elem, Input, input} from "../../src/index";
import {isBHE} from "./util";

describe('methods', () => {

    test("child()", () => {
        let el = elem({tag: 'div'}).append(input({cls: 'myinput', type: "text"}));
        document.body.append(el.e);
        expect(isBHE(el.child("input"), Input)).toStrictEqual(true);
    });
});

