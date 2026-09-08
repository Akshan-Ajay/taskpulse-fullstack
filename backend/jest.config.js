export default {
  testEnvironment: "node",
  transform: {},
  passWithNoTests: true,
  testMatch: [
    "**/tests/**/*.test.js",
    "**/__tests__/**/*.test.js"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/tests/setup/"
  ],
  collectCoverageFrom: [
    "routes/authRoutes.js",
    "models/User.js"
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70
    }
  }
};
