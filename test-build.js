#!/usr/bin/env node

/**
 * Test Build Script for KNX Store
 * This script tests the build process and identifies potential issues
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 KNX Store Build Test Script');
console.log('================================\n');

// Test 1: Check Node.js version
console.log('1️⃣ Checking Node.js version...');
try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`   ✅ Node.js version: ${nodeVersion}`);
    
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (majorVersion < 18) {
        console.log('   ⚠️  Warning: Node.js 18+ recommended');
    }
} catch (error) {
    console.log('   ❌ Error checking Node.js version:', error.message);
}

// Test 2: Check npm version
console.log('\n2️⃣ Checking npm version...');
try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`   ✅ npm version: ${npmVersion}`);
} catch (error) {
    console.log('   ❌ Error checking npm version:', error.message);
}

// Test 3: Check if package.json exists
console.log('\n3️⃣ Checking package.json...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
    console.log('   ✅ package.json exists');
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        console.log(`   ✅ Package name: ${packageJson.name}`);
        console.log(`   ✅ Version: ${packageJson.version}`);
        console.log(`   ✅ Type: ${packageJson.type || 'commonjs'}`);
    } catch (error) {
        console.log('   ❌ Error parsing package.json:', error.message);
    }
} else {
    console.log('   ❌ package.json not found');
}

// Test 4: Check if node_modules exists
console.log('\n4️⃣ Checking node_modules...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
    console.log('   ✅ node_modules exists');
    
    // Check for key dependencies
    const keyDeps = ['astro', '@astrojs/vercel', 'jest', 'ts-jest'];
    keyDeps.forEach(dep => {
        const depPath = path.join(nodeModulesPath, dep);
        if (fs.existsSync(depPath)) {
            console.log(`   ✅ ${dep} installed`);
        } else {
            console.log(`   ❌ ${dep} not found`);
        }
    });
} else {
    console.log('   ❌ node_modules not found - run npm install');
}

// Test 5: Check Astro configuration
console.log('\n5️⃣ Checking Astro configuration...');
const astroConfigPath = path.join(__dirname, 'astro.config.mjs');
if (fs.existsSync(astroConfigPath)) {
    console.log('   ✅ astro.config.mjs exists');
    try {
        const configContent = fs.readFileSync(astroConfigPath, 'utf8');
        if (configContent.includes('@astrojs/vercel')) {
            console.log('   ✅ Vercel adapter configured');
        } else {
            console.log('   ⚠️  Vercel adapter not found in config');
        }
    } catch (error) {
        console.log('   ❌ Error reading astro.config.mjs:', error.message);
    }
} else {
    console.log('   ❌ astro.config.mjs not found');
}

// Test 6: Check Jest configuration
console.log('\n6️⃣ Checking Jest configuration...');
const jestConfigPath = path.join(__dirname, 'jest.config.js');
if (fs.existsSync(jestConfigPath)) {
    console.log('   ✅ jest.config.js exists');
} else {
    console.log('   ❌ jest.config.js not found');
}

// Test 7: Check Vercel configuration
console.log('\n7️⃣ Checking Vercel configuration...');
const vercelConfigPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelConfigPath)) {
    console.log('   ✅ vercel.json exists');
    try {
        const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
        console.log(`   ✅ Vercel version: ${vercelConfig.version}`);
        console.log(`   ✅ Build command: ${vercelConfig.buildCommand}`);
        console.log(`   ✅ Output directory: ${vercelConfig.outputDirectory}`);
    } catch (error) {
        console.log('   ❌ Error parsing vercel.json:', error.message);
    }
} else {
    console.log('   ❌ vercel.json not found');
}

// Test 8: Check source files
console.log('\n8️⃣ Checking source files...');
const srcPath = path.join(__dirname, 'src');
if (fs.existsSync(srcPath)) {
    console.log('   ✅ src directory exists');
    
    const pagesPath = path.join(srcPath, 'pages');
    if (fs.existsSync(pagesPath)) {
        console.log('   ✅ pages directory exists');
        const pages = fs.readdirSync(pagesPath);
        console.log(`   ✅ Found ${pages.length} files in pages directory`);
    } else {
        console.log('   ❌ pages directory not found');
    }
} else {
    console.log('   ❌ src directory not found');
}

// Test 9: Try to run Astro check
console.log('\n9️⃣ Running Astro check...');
try {
    execSync('npx astro check', { stdio: 'pipe' });
    console.log('   ✅ Astro check passed');
} catch (error) {
    console.log('   ❌ Astro check failed:', error.message);
}

// Test 10: Try to run Jest tests
console.log('\n🔟 Running Jest tests...');
try {
    execSync('npm test', { stdio: 'pipe' });
    console.log('   ✅ Jest tests passed');
} catch (error) {
    console.log('   ❌ Jest tests failed:', error.message);
}

// Test 11: Try to build the project
console.log('\n1️⃣1️⃣ Testing build process...');
try {
    console.log('   🔨 Running npm run build...');
    execSync('npm run build', { stdio: 'pipe' });
    console.log('   ✅ Build completed successfully');
    
    // Check if dist directory was created
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
        console.log('   ✅ dist directory created');
        const distFiles = fs.readdirSync(distPath);
        console.log(`   ✅ Found ${distFiles.length} files in dist directory`);
    } else {
        console.log('   ❌ dist directory not found after build');
    }
} catch (error) {
    console.log('   ❌ Build failed:', error.message);
}

// Test 12: Check environment variables
console.log('\n1️⃣2️⃣ Checking environment variables...');
const envVars = [
    'NODE_ENV',
    'VERCEL_ENV',
    'VERCEL_URL',
    'VERCEL_GIT_COMMIT_SHA'
];

envVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
        console.log(`   ✅ ${envVar}: ${value}`);
    } else {
        console.log(`   ⚠️  ${envVar}: not set`);
    }
});

console.log('\n🎯 Build Test Summary');
console.log('====================');
console.log('If you see any ❌ errors above, those need to be fixed before deployment.');
console.log('If you see ⚠️ warnings, those should be addressed but may not block deployment.');
console.log('✅ items indicate everything is working correctly.');

console.log('\n📋 Next Steps:');
console.log('1. Fix any ❌ errors shown above');
console.log('2. Add Vercel secrets to GitHub repository');
console.log('3. Test deployment with a simple commit');
console.log('4. Check GitHub Actions logs for detailed error information');

console.log('\n🔗 Useful Commands:');
console.log('- npm install          # Install dependencies');
console.log('- npm run build        # Build the project');
console.log('- npm test             # Run tests');
console.log('- npx astro check      # Check Astro configuration');
console.log('- docker-compose up    # Start development environment'); 