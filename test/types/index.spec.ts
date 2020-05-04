import {Anchor, BetterHTMLElement, Button, Div, Input, Paragraph, Span, wrapWithBHE} from "../../src/index";
import {Tag} from "../../src/typings/misc";
import {isBHE} from "../../src/util";

describe('wrapWithBHE', () => {
    test("ok scenarios", () => {
        const a: Button = wrapWithBHE("button", document.createElement("button"));
        expect(a).toBeInstanceOf(BetterHTMLElement);
        expect(a.e).toBeInstanceOf(HTMLButtonElement);
        const b = wrapWithBHE("button", document.createElement("button"));
        expect(b).toBeInstanceOf(Button);
        expect(b.e).toBeInstanceOf(HTMLButtonElement);
        expect(isBHE(wrapWithBHE("button", document.createElement("button")), Button)).toStrictEqual(true);
        expect(isBHE(wrapWithBHE("button", document.createElement("button")), Div)).toStrictEqual(false);
        const c: Anchor = wrapWithBHE("a", document.createElement("a"));
        expect(isBHE(c, Anchor)).toStrictEqual(true);
        const d: Paragraph = wrapWithBHE("p", document.createElement("p"));
        expect(isBHE(d, Paragraph)).toStrictEqual(true);
        expect(d.e).toBeInstanceOf(HTMLParagraphElement);

        const e: Button = wrapWithBHE("button", document.createElement("button"));
        const f: Input = wrapWithBHE("input", document.createElement("input"));
    });
    test("fails", () => {
        expect(isBHE(wrapWithBHE("div", document.createElement("button")), Button)).toStrictEqual(false);
        expect(isBHE(wrapWithBHE("div", document.createElement("button")), BetterHTMLElement)).toStrictEqual(true);
        expect(isBHE(wrapWithBHE("div", document.createElement("button")), Div)).toStrictEqual(true);
        expect(isBHE(wrapWithBHE("button", document.createElement("div")), Div)).toStrictEqual(false);
        expect(isBHE(wrapWithBHE("button", document.createElement("div")), Button)).toStrictEqual(true);
        const g: Div = wrapWithBHE("button", document.createElement("button"));
        const h: Span = wrapWithBHE("button", document.createElement("button"));
        const i: Span = new Button({})
    });
});

