//
describe('wow', () => {
    test("foo", () => {
        const actual = elem({htmlElement: document.createElement("div")});
        expect(actual.e).toBeTruthy()
    });

});