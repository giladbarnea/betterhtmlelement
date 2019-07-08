module.exports = {
	maxConcurrency: 20,
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: "jsdom",
	globals: {
		'ts-jest': {
			diagnostics: false
		}
	}
};
