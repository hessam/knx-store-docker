module.exports = {
  // Lint and format TypeScript/JavaScript files
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'jest --bail --findRelatedTests'
  ],
  
  // Format Astro files
  '*.astro': [
    'prettier --write',
    'eslint --fix'
  ],
  
  // Format other files
  '*.{json,md,yml,yaml}': [
    'prettier --write'
  ],
  
  // Type check TypeScript files
  '*.{ts,tsx}': [
    () => 'tsc --noEmit'
  ]
}; 