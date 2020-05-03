import {div, elem, Input, input} from "../../src/index";
import {isBHE} from "../../src/util";

describe('methods', () => {

    test("child()", () => {
        let el = elem({tag: 'div'}).append(input({cls: 'myinput', type: "text"}));
        document.body.append(el.e);
        let child: Input = el.child("input");
        expect(isBHE(child, Input)).toStrictEqual(true);
    });
});

