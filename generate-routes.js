/**
 * Route Generator for React Snap
 * 
 * This script generates a list of all routes (including dynamic routes)
 * that should be pre-rendered by react-snap.
 * 
 * Run this before building to generate routes.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuration object containing your API endpoints
 * UPDATE THESE WITH YOUR ACTUAL API ENDPOINTS
 */
const config = {
  apiBaseUrl: process.env.VITE_API_BASE_URL || 'https://api.jobdockets.com',
  // Add your actual API endpoints here
  endpoints: {
    jobs: '/jobs',
    courses: '/courses',
    blogs: '/blogs'
  }
};

/**
 * Static routes that don't require API data
 */
const staticRoutes = [
  '/',
  '/jobs',
  '/free-courses',
  '/blog',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/rates-invoices'
];

/**
 * Fetch dynamic job routes
 * Replace with your actual API call
 */
async function fetchJobRoutes() {
  try {
    // Example: Fetch from your API
    // const response = await fetch(`${config.apiBaseUrl}${config.endpoints.jobs}`);
    // const jobs = await response.json();
    // return jobs.map(job => `/jobs/${job.slug}`);
    
    // For now, return empty array - you'll need to implement actual API calls
    console.log('⚠️  Job routes: Implement API call in generate-routes.js');
    return [];
  } catch (error) {
    console.error('Error fetching job routes:', error);
    return [];
  }
}

/**
 * Fetch dynamic course routes
 * Replace with your actual API call
 */
async function fetchCourseRoutes() {
  try {
    // Example: Fetch from your API
    // const response = await fetch(`${config.apiBaseUrl}${config.endpoints.courses}`);
    // const courses = await response.json();
    // return courses.map(course => `/courses/${course.slug}`);
    
    // For now, return empty array - you'll need to implement actual API calls
    console.log('⚠️  Course routes: Implement API call in generate-routes.js');
    return [];
  } catch (error) {
    console.error('Error fetching course routes:', error);
    return [];
  }
}

/**
 * Fetch dynamic blog routes
 * Replace with your actual API call
 */
async function fetchBlogRoutes() {
  try {
    // Example: Fetch from your API
    // const response = await fetch(`${config.apiBaseUrl}${config.endpoints.blogs}`);
    // const blogs = await response.json();
    // return blogs.map(blog => `/blog/${blog.slug}`);
    
    // For now, return empty array - you'll need to implement actual API calls
    console.log('⚠️  Blog routes: Implement API call in generate-routes.js');
    return [];
  } catch (error) {
    console.error('Error fetching blog routes:', error);
    return [];
  }
}

/**
 * Main function to generate all routes
 */
async function generateRoutes() {
  console.log('🚀 Generating routes for react-snap...\n');
  
  try {
    // Fetch all dynamic routes
    const [jobRoutes, courseRoutes, blogRoutes] = await Promise.all([
      fetchJobRoutes(),
      fetchCourseRoutes(),
      fetchBlogRoutes()
    ]);
    
    // Combine all routes
    const allRoutes = [
      ...staticRoutes,
      ...jobRoutes,
      ...courseRoutes,
      ...blogRoutes
    ];
    
    // Remove duplicates
    const uniqueRoutes = [...new Set(allRoutes)];
    
    console.log(`✅ Generated ${uniqueRoutes.length} routes:`);
    console.log(`   - Static routes: ${staticRoutes.length}`);
    console.log(`   - Job routes: ${jobRoutes.length}`);
    console.log(`   - Course routes: ${courseRoutes.length}`);
    console.log(`   - Blog routes: ${blogRoutes.length}\n`);
    
    // Write to package.json reactSnap config
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.reactSnap) {
      packageJson.reactSnap = {};
    }
    
    packageJson.reactSnap.include = uniqueRoutes;
    
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n'
    );
    
    console.log('✅ Updated package.json with routes');
    console.log('📝 Routes written to package.json reactSnap.include\n');
    
    // Also save to a separate file for reference
    const routesFilePath = path.join(__dirname, 'routes.json');
    fs.writeFileSync(
      routesFilePath,
      JSON.stringify({ routes: uniqueRoutes, total: uniqueRoutes.length }, null, 2)
    );
    
    console.log('✅ Saved routes.json for reference\n');
    
    return uniqueRoutes;
  } catch (error) {
    console.error('❌ Error generating routes:', error);
    process.exit(1);
  }
}

// Run the generator
generateRoutes()
  .then(() => {
    console.log('🎉 Route generation complete!\n');
  })
  .catch((error) => {
    console.error('❌ Route generation failed:', error);
    process.exit(1);
  });
