#!/usr/bin/env node

import { execSync } from 'child_process';
import process from 'process';

// Check if prod flag is passed
const isProd = process.argv.includes('prod');

// Set environment variable to control namespace
process.env.BUILD_NAMESPACE = isProd ? 'stanford-components' : 'stanford-development';

try {
    console.log(`Building with namespace: ${process.env.BUILD_NAMESPACE}`);
    
    // Run the original build commands
    execSync('npm-run-all build:*', { stdio: 'inherit' });
    
    console.log('Build completed successfully!');
} catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
}
