/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest/presets/default-esm", // Use the ESM preset
  clearMocks: true,
  collectCoverage: true,
  verbose: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules"], // Ignore node_modules for coverage
  coverageProvider: "v8",
  moduleDirectories: ["node_modules", "src"], // Resolve modules in these directories
  extensionsToTreatAsEsm: [".ts"], // Treat .ts files as ES modules
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true, // Enable ESM support in ts-jest
        tsconfig: "tsconfig.json", // Path to your tsconfig file
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Map aliases to the src folder
  },
  // Optional: Explicitly define where Jest should look for test files
  testMatch: ["**/__tests__/**/*.test.ts"], // Match test files in __tests__ folder
  // Optional: Ignore specific paths when searching for tests
  testPathIgnorePatterns: ["/node_modules/"],
};

export default config;