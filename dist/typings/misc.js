(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const a = undefined;
    const b = undefined;
    const foo = (tag) => document.createElement(tag);
    const baz = (query) => document.querySelector(query);
    const bar = (query) => document.querySelector(query);
});
//# sourceMappingURL=misc.js.map