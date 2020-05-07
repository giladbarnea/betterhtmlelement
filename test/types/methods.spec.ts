// type GenericReturnType<X> = X extends Callable<X> ? R extends infer U ? U : R : any;

describe('methods', () => {

    test("child()", () => {
        let el = elem({tag: 'div'}).append(
            input({cls: 'myinput', type: "text"}),
            img({cls: 'myimg'}),
            anchor({cls: 'myanchor'}),
        );
        document.body.append(el.e);
        const inp: Input = el.child("input");
        const image: Img = el.child("img");
        const a: Anchor = el.child("a");
        expect(isBHE(inp, Input)).toStrictEqual(true);
        expect(isBHE(image, Img)).toStrictEqual(true);
        const what: Callable<"img", HTMLImageElement, typeof wrapWithBHE> = img();
        const what2: Callable2<"img", typeof wrapWithBHE> = img();
        const what3: Callable2<"a", typeof wrapWithBHE> = img();
    });
    test("shouldfail", () => {
        const z: Callable<"img", HTMLImageElement, typeof wrapWithBHE> = anchor();
        const el = elem({tag: 'div'}).append(input({cls: 'myinput', type: "text"}));
        document.body.append(el.e);
        const child: Img = el.child("input");
        const a: Input = el.child("a");
    })
});

