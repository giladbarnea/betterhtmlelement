import {Anchor, BetterHTMLElement, Button, Div, Paragraph, wrapWithBHE} from "../../src/index";

describe('wrapWithBHE', () => {
    test("ok scenarios", () => {
        let btn1: Button = wrapWithBHE("button", document.createElement("button"));
        expect(btn1).toBeInstanceOf(BetterHTMLElement);
        expect(btn1.e).toBeInstanceOf(HTMLButtonElement);
        let btn2 = wrapWithBHE("button", document.createElement("button"));
        expect(btn2).toBeInstanceOf(Button);
        expect(btn2.e).toBeInstanceOf(HTMLButtonElement);
        expect(isBHE(wrapWithBHE("button", document.createElement("button")), Button)).toStrictEqual(true);
        expect(isBHE(wrapWithBHE("button", document.createElement("button")), Div)).toStrictEqual(false);
        let a: Anchor = wrapWithBHE("a", document.createElement("a"));
        expect(isBHE(a, Anchor)).toStrictEqual(true);
        let p: Paragraph = wrapWithBHE("p", document.createElement("p"));
        expect(isBHE(p, Paragraph)).toStrictEqual(true);
        expect(p.e).toBeInstanceOf(HTMLParagraphElement)
    });
    test("fails", () => {
        expect(isBHE(wrapWithBHE("div", document.createElement("button")), Button)).toStrictEqual(false);
        expect(isBHE(wrapWithBHE("div", document.createElement("button")), BetterHTMLElement)).toStrictEqual(true);
        expect(isBHE(wrapWithBHE("div", document.createElement("button")), Div)).toStrictEqual(true);
        expect(isBHE(wrapWithBHE("button", document.createElement("div")), Div)).toStrictEqual(false);
        expect(isBHE(wrapWithBHE("button", document.createElement("div")), Button)).toStrictEqual(true);
    });
});

function isBHE<T extends BetterHTMLElement>(arg: T, bheSubType): arg is T {
    return (arg instanceof bheSubType)
}