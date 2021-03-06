module.exports = {
    "transform": {
        "^.+\\.css$": "react-scripts-ts/config/jest/cssTransform.js",
        ".(ts|tsx)": "react-scripts-ts/config/jest/typescriptTransform.js",
        "^(?!.*\\.(css|json)$)": "react-scripts-ts/config/jest/fileTransform.js"
    },
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ],
    "collectCoverageFrom": ["src/**/*.{ts,tsx}"],
    "setupFiles": ["react-scripts-ts/config/polyfills.js"],
    "testEnvironment": "node",
    "testURL": "http://localhost",
    "transformIgnorePatterns": [
        "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$"
    ],
    "moduleNameMapper": {
        "^react-native$": "react-native-web"
    },
    "globals": {
        "ts-jest": {
            "tsConfigFile": "./tsconfig.test.json"
        }
    },
    "reporters": ["default", "jest-junit"]
};
