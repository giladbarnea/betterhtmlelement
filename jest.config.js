module.exports = {
    "//": "https://jestjs.io/docs/en/configuration",
    "preset": "ts-jest",
    "verbose": true,
    "testEnvironment": "jsdom",
    "maxConcurrency": 500,
    "bail": false,
    // "testMatch": ["**/input.spec.ts"],
    "globals": {
        "ts-jest": {
            "//": "https://kulshekhar.github.io/ts-jest/user/config/#options",
            "diagnostics": {
                // pathRegex: /elem\b\.spec\.ts$/
                warnOnly: true
            }

        }
    }
};
