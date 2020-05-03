module.exports = {
    "//": "https://jestjs.io/docs/en/configuration",
    "verbose": true,
    "preset": "ts-jest",
    "testEnvironment": "jsdom",
    "maxConcurrency": 500,
    "globals": {
        "ts-jest": {
            "//": "https://kulshekhar.github.io/ts-jest/user/config/#options",
            "diagnostics": false
        }
    }
};
