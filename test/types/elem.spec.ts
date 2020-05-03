import {elem, Div, Input, BetterHTMLElement} from "../../src/index";
// npm test "elem\.spec\.ts"
describe('{htmlElement: document.createElement("input")}', () => {
    test("bad htmlElement", () => {
        let SHOULDFAIL = elem({htmlElement: "input"});
        let SHOULDFAIL2: BetterHTMLElement<HTMLInputElement> = elem({htmlElement: document.createElement("div")});
    });

    test("elem()", () => {
        let actual: BetterHTMLElement<HTMLInputElement> = elem({htmlElement: document.createElement("input")});
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).not.toHaveProperty('toggleChecked')
    });

    test("Input()", () => {
        let actual: Input = new Input({htmlElement: document.createElement("input")});
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual).toBeInstanceOf(Input);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).toHaveProperty('toggleChecked')
    });
    test("BetterHTMLElement()", () => {
        let actual: BetterHTMLElement<HTMLInputElement> = new BetterHTMLElement({htmlElement: document.createElement("input")});
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual).not.toBeInstanceOf(Input);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).not.toHaveProperty('toggleChecked')
    })


});


describe('{query: ...}', () => {
    document.body.append(document.createElement("input"));
    let node = document.createElement("input");
    node.className = "myinput";
    node.type = 'checkbox';
    document.body.append(node);

    test("elem()", () => {
        let actual: BetterHTMLElement<HTMLInputElement> = elem({query: "input"});
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).not.toHaveProperty('toggleChecked');
    });

    test("elem()2", () => {
        // <HTMLInputElement> doesn't work because query isn't tag
        let actual: BetterHTMLElement = elem({query: "input.myinput"});
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).not.toHaveProperty('toggleChecked');
    });

    test("elem()3", () => {
        // <HTMLInputElement> doesn't work because query isn't tag
        // let actual: BetterHTMLElement<HTMLInputElement> = elem<HTMLInputElement>({query: "input.myinput"}) as BetterHTMLElement<HTMLInputElement>;
        let actual = elem({query: "input.myinput"}) as BetterHTMLElement<HTMLInputElement>;
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).not.toHaveProperty('toggleChecked');
    });
    test("BetterHTMLElement", () => {
        // <HTMLInputElement> doesn't work because query isn't tag
        let actual: BetterHTMLElement = new BetterHTMLElement({query: "input"});
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).not.toHaveProperty('toggleChecked');
    });
    test("BetterHTMLElement2", () => {
        // <HTMLInputElement> doesn't work because query isn't tag
        let actual: BetterHTMLElement<HTMLInputElement> = new BetterHTMLElement<HTMLInputElement>({query: "input"});
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).not.toHaveProperty('toggleChecked');
    });
    test("Input()", () => {
        // let ctor = ;
        let actual: Input = new Input({query: "input"});
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual).toBeInstanceOf(Input);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).toHaveProperty('toggleChecked')
    });


});
describe('{tag: ...}', () => {
    test("bad tag", () => {
        let SHOULDFAIL = elem({tag: "BAD"});
    });
    test("elem()", () => {
        let actual: BetterHTMLElement<HTMLInputElement> = elem({tag: "input"});
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).not.toHaveProperty('toggleChecked')
    });
    test("elem2()", () => {
        let actual = <BetterHTMLElement<HTMLInputElement>>elem({tag: "input"});
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).not.toHaveProperty('toggleChecked')
    });
    test("elem3()", () => {
        let actual = elem({tag: "input"}) as BetterHTMLElement<HTMLInputElement>;
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).not.toHaveProperty('toggleChecked')
    });
    test("elem4()", () => {
        let actual = elem<"input">({tag: "input"});
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).not.toHaveProperty('toggleChecked')
    });
    test("Input()", () => {
        let ctor = {htmlElement: document.createElement("input")};
        let actual: Input = new Input(ctor);
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual).toBeInstanceOf(Input);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).toHaveProperty('toggleChecked')
    });
    test("BetterHTMLElement()", () => {
        let ctor = {htmlElement: document.createElement("input")};
        let actual: BetterHTMLElement<HTMLInputElement> = new BetterHTMLElement(ctor);
        expect(actual).toBeInstanceOf(BetterHTMLElement);
        expect(actual).not.toBeInstanceOf(Input);
        expect(actual.e).toBeInstanceOf(HTMLInputElement);
        expect(actual).not.toHaveProperty('toggleChecked')
    })
});
describe('FAILS: {tag: ...}', () => {
    test("elem5()", () => {
        let SHOULDFAIL = elem<"div">({tag: "input"});
    });
    test("elem5()", () => {
        let SHOULDFAIL: BetterHTMLElement<HTMLDivElement> = elem({tag: "input"});
        expect(SHOULDFAIL).toBeInstanceOf(BetterHTMLElement);
        expect(SHOULDFAIL.e).toBeInstanceOf(HTMLInputElement);
        expect(SHOULDFAIL).not.toHaveProperty('toggleChecked')
    });


});