#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Performance tracking
class PerformanceMonitor {
  constructor() {
    this.startTime = Date.now();
    this.buildTimes = [];
    this.fileCounts = [];
  }

  startBuild() {
    return Date.now();
  }

  endBuild(startTime, buildType = 'unknown') {
    const duration = Date.now() - startTime;
    this.buildTimes.push({ type: buildType, duration });
    console.log(`⚡ ${buildType} build completed in ${duration}ms`);
    return duration;
  }

  getStats() {
    const totalTime = Date.now() - this.startTime;
    const avgBuildTime = this.buildTimes.length > 0 
      ? this.buildTimes.reduce((sum, build) => sum + build.duration, 0) / this.buildTimes.length 
      : 0;
    
    return {
      totalTime,
      buildCount: this.buildTimes.length,
      avgBuildTime,
      builds: this.buildTimes
    };
  }

  countFiles() {
    const packagesDir = join(__dirname, '../packages');
    const globalDir = join(__dirname, '../global');
    
    let componentCount = 0;
    let fileCount = 0;
    
    if (existsSync(packagesDir)) {
      const components = readdirSync(packagesDir).filter(dir => 
        statSync(join(packagesDir, dir)).isDirectory()
      );
      componentCount = components.length;
      
      // Count files in each component
      components.forEach(component => {
        const componentPath = join(packagesDir, component);
        const files = readdirSync(componentPath, { recursive: true });
        fileCount += files.length;
      });
    }
    
    return { componentCount, fileCount };
  }

  logPerformanceReport() {
    const stats = this.getStats();
    const fileStats = this.countFiles();
    
    console.log('\n📊 Performance Report');
    console.log('====================');
    console.log(`Total runtime: ${stats.totalTime}ms`);
    console.log(`Builds completed: ${stats.buildCount}`);
    console.log(`Average build time: ${Math.round(stats.avgBuildTime)}ms`);
    console.log(`Components: ${fileStats.componentCount}`);
    console.log(`Total files: ${fileStats.fileCount}`);
    
    if (stats.builds.length > 0) {
      console.log('\nBuild History:');
      stats.builds.forEach((build, index) => {
        console.log(`  ${index + 1}. ${build.type}: ${build.duration}ms`);
      });
    }
  }
}

// Export for use in other scripts
export { PerformanceMonitor };

// If run directly, show current stats
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new PerformanceMonitor();
  monitor.logPerformanceReport();
} 