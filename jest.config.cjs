module.exports = {
  testEnvironment: "node",
  testTimeout: 30000,
  transform: {},
  roots: ["<rootDir>/backend/test"],
  moduleFileExtensions: ["js", "mjs", "cjs", "json", "node"],
  // Only run the auth integration ESM test to avoid stray manual runners
  testMatch: ["**/auth.integration.test.mjs"],
};
