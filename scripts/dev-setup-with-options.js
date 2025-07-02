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

// Check command line arguments
const args = process.argv.slice(2);
const includeWatch = args.includes('--watch') || args.includes('-w');
const skipBuild = args.includes('--skip-build') || args.includes('-s');

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
    
    if (includeWatch) {
      logInfo('Watch mode enabled - will include npm run watch');
    }
    
    if (skipBuild) {
      logInfo('Skipping initial build check');
    } else {
      const { hasDist, hasMysource } = checkBuildStatus();
      
      if (!hasDist || !hasMysource) {
        logInfo('Building components and global assets...');
        await runCommand('npm', ['run', 'build:dev']);
        logSuccess('Initial build completed');
      } else {
        logInfo('Build artifacts found, skipping initial build');
      }
    }
    
    logInfo('Starting development servers...');
    
    const processes = [];
    
    // Start the enhanced dev server
    const devServer = spawn('node', ['dev-server/dev-server-enhanced.js'], {
      stdio: 'inherit',
      shell: true
    });
    processes.push(devServer);
    
    // Start DXP server
    const dxpServer = spawn('npm', ['run', 'dxp'], {
      stdio: 'inherit',
      shell: true
    });
    processes.push(dxpServer);
    
    // Start watch process if requested
    let watchProcess = null;
    if (includeWatch) {
      watchProcess = spawn('npm', ['run', 'watch'], {
        stdio: 'inherit',
        shell: true
      });
      processes.push(watchProcess);
      logInfo('Watch process started');
    }
    
    // Handle process termination
    const cleanup = (signal) => {
      logInfo('Shutting down development servers...');
      processes.forEach(process => {
        try {
          process.kill(signal);
        } catch (error) {
          // Process might already be dead
        }
      });
      process.exit(0);
    };
    
    process.on('SIGINT', () => cleanup('SIGINT'));
    process.on('SIGTERM', () => cleanup('SIGTERM'));
    
    // Wait for all processes
    await Promise.all(
      processes.map(proc => new Promise((resolve) => proc.on('close', resolve)))
    );
    
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Show usage if help requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node scripts/dev-setup-with-options.js [options]

Options:
  --watch, -w          Include npm run watch process
  --skip-build, -s     Skip initial build check
  --help, -h           Show this help message

Examples:
  node scripts/dev-setup-with-options.js                    # Standard setup
  node scripts/dev-setup-with-options.js --watch            # Include watch
  node scripts/dev-setup-with-options.js --skip-build       # Skip build check
  node scripts/dev-setup-with-options.js --watch --skip-build # Both options
`);
  process.exit(0);
}

// Run the setup
setupDev(); 