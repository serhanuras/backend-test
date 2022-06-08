module.exports = {
    preset: 'ts-jest',
    modulePathIgnorePatterns: ['dist'],
    testPathIgnorePatterns: [
      'dist',
      'node_modules',
      'coverage',
      'e2e',
      '__fixtures__',
    ],
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
          diagnostics: false
        }
      }
  };
  