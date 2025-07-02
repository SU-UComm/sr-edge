#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

// Check if dist directory exists and has content
function checkBuildStatus() {
  const distPath = join(__dirname, '../dist');
  const mysourcePath = join(__dirname, '../mysource_files');
  
  const hasDist = existsSync(distPath);
  const hasMysource = existsSync(mysourcePath);
  
  return { hasDist, hasMysource };
}

// Run a command and return a promise
function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Main development setup function
async function setupDev() {
  try {
    log('🚀 Starting Stanford Edge Components Development Setup', 'bright');
    
    const { hasDist, hasMysource } = checkBuildStatus();
    
    if (!hasDist || !hasMysource) {
      logInfo('Building components and global assets...');
      await runCommand('npm', ['run', 'build:dev']);
      logSuccess('Initial build completed');
    } else {
      logInfo('Build artifacts found, skipping initial build');
    }
    
    logInfo('Starting development servers...');
    
    // Start the enhanced dev server, DXP, and watch in parallel
    const devServer = spawn('node', ['dev-server/dev-server-enhanced.js'], {
      stdio: 'inherit',
      shell: true
    });
    
    const dxpServer = spawn('npm', ['run', 'dxp'], {
      stdio: 'inherit',
      shell: true
    });
    
    const watchProcess = spawn('npm', ['run', 'watch'], {
      stdio: 'inherit',
      shell: true
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      logInfo('Shutting down development servers...');
      devServer.kill('SIGINT');
      dxpServer.kill('SIGINT');
      watchProcess.kill('SIGINT');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      logInfo('Shutting down development servers...');
      devServer.kill('SIGTERM');
      dxpServer.kill('SIGTERM');
      watchProcess.kill('SIGTERM');
      process.exit(0);
    });
    
    // Wait for all processes
    await Promise.all([
      new Promise((resolve) => devServer.on('close', resolve)),
      new Promise((resolve) => dxpServer.on('close', resolve)),
      new Promise((resolve) => watchProcess.on('close', resolve))
    ]);
    
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the setup
setupDev(); 