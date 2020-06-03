QUnit.test("BHE opts intended errors", assert => {
    assert.throws(() => {
        elem({byid: "foo", query: '.bar'})
    }, Error, "wrapping args: assert max one (or none if creating new)");
    // assert.ok(elem({setid: "foo"}), "elem param only setid");
});
/*
fail
ok
equal
notEqual
deepEqual
notDeepEqual
strictEqual
notStrictEqual
deepStrictEqual
notDeepStrictEqual
throws
doesNotThrow
ifError
rejects
doesNotReject
match
doesNotMatch
* */
