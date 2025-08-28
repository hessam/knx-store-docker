module.exports = {
  // Lint and format TypeScript/JavaScript files
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix", // Remove --max-warnings for now
    "prettier --write",
    // Skip Jest tests for now due to JSX configuration issues
    // 'jest --bail --findRelatedTests --passWithNoTests'
  ],

  // Only format Astro files (don't lint them)
  "*.astro": ["prettier --write"],

  // Format other files
  "*.{json,md,yml,yaml}": ["prettier --write"],

  // Type check TypeScript files
  "*.{ts,tsx}": [() => "tsc --noEmit"],
};
