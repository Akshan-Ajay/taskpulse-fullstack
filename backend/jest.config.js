export default {
  testEnvironment: "node",
  transform: {},
  testMatch: [
    "**/tests/**/*.test.js",
    "**/__tests__/**/*.js"
  ],
  collectCoverageFrom: [
    "routes/authRoutes.js",
    "models/User.js"
  ],
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 70,
      functions: 75,
      lines: 75
    }
  }
};
