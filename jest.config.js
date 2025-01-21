module.exports = {
  // Use ts-jest to transpile TypeScript
  preset: 'ts-jest',
  testEnvironment: 'node',  // Use Node environment for testing

  // Set up file extensions for TypeScript and other necessary files
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',  // Handle TypeScript files
  },

  // Ignore node_modules from transformation
  transformIgnorePatterns: ['/node_modules/'],
  
  // Coverage settings (optional)
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  // Optional: Enable verbose output for testing
  verbose: true,
};
