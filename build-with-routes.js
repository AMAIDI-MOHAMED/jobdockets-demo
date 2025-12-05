#!/usr/bin/env node

/**
 * Build script with route generation
 * This script generates routes from your API and then builds the project
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting build process with route generation...\n');

// Step 1: Generate routes
console.log('📝 Step 1: Generating routes from API...');
const generateRoutes = spawn('node', ['generate-routes.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

generateRoutes.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Route generation failed');
    process.exit(code);
  }
  
  console.log('\n✅ Routes generated successfully!\n');
  
  // Step 2: Build the project
  console.log('🔨 Step 2: Building project with Vite...');
  const build = spawn('npm', ['run', 'build'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });
  
  build.on('close', (buildCode) => {
    if (buildCode !== 0) {
      console.error('❌ Build failed');
      process.exit(buildCode);
    }
    
    console.log('\n✅ Build complete!');
    console.log('📁 Pre-rendered files are in the dist/ folder');
    console.log('\n🧪 Test locally with: npm run preview\n');
  });
});
