/**
 * EXAMPLE: How to implement route fetching in generate-routes.js
 * 
 * This file shows you how to fetch actual routes from your API.
 * Copy the relevant functions to generate-routes.js and customize them.
 */

import axios from 'axios';

// ============================================
// OPTION 1: Using Axios (Recommended)
// ============================================

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://api.jobdockets.com';

/**
 * Fetch job routes using Axios
 */
async function fetchJobRoutesWithAxios() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/jobs`, {
      params: {
        limit: 1000, // Adjust based on your needs
        status: 'published'
      }
    });
    
    const jobs = response.data;
    
    // If your API returns data in a nested structure:
    // const jobs = response.data.data;
    
    return jobs.map(job => `/jobs/${job.slug || job.id}`);
  } catch (error) {
    console.error('Error fetching job routes:', error.message);
    return [];
  }
}

/**
 * Fetch course routes using Axios
 */
async function fetchCourseRoutesWithAxios() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/courses`, {
      params: {
        limit: 1000,
        status: 'published'
      }
    });
    
    const courses = response.data;
    return courses.map(course => `/courses/${course.slug || course.id}`);
  } catch (error) {
    console.error('Error fetching course routes:', error.message);
    return [];
  }
}

/**
 * Fetch blog routes using Axios
 */
async function fetchBlogRoutesWithAxios() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/blogs`, {
      params: {
        limit: 1000,
        status: 'published'
      }
    });
    
    const blogs = response.data;
    return blogs.map(blog => `/blog/${blog.slug || blog.id}`);
  } catch (error) {
    console.error('Error fetching blog routes:', error.message);
    return [];
  }
}

// ============================================
// OPTION 2: Using Fetch API
// ============================================

/**
 * Fetch job routes using native fetch
 */
async function fetchJobRoutesWithFetch() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs?limit=1000&status=published`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const jobs = await response.json();
    return jobs.map(job => `/jobs/${job.slug || job.id}`);
  } catch (error) {
    console.error('Error fetching job routes:', error.message);
    return [];
  }
}

// ============================================
// OPTION 3: Using your existing API utility
// ============================================

/**
 * If you have an existing API utility (like in src/apiFunctions/Api.jsx),
 * you can import and use it:
 */

// Example (adjust imports based on your actual file structure):
// import { getJobs, getCourses, getBlogs } from './src/apiFunctions/Api.jsx';

async function fetchJobRoutesFromYourAPI() {
  try {
    // Replace with your actual API function
    // const jobs = await getJobs({ limit: 1000, status: 'published' });
    // return jobs.map(job => `/jobs/${job.slug}`);
    
    // Placeholder:
    return [];
  } catch (error) {
    console.error('Error fetching job routes:', error.message);
    return [];
  }
}

// ============================================
// OPTION 4: Paginated API Responses
// ============================================

/**
 * If your API uses pagination, fetch all pages
 */
async function fetchAllJobsWithPagination() {
  const allJobs = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/jobs`, {
        params: {
          page,
          limit: 100,
          status: 'published'
        }
      });
      
      const { data, pagination } = response.data;
      allJobs.push(...data);
      
      // Check if there are more pages
      hasMore = page < pagination.totalPages;
      page++;
      
      console.log(`Fetched page ${page - 1}/${pagination.totalPages}`);
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error.message);
      hasMore = false;
    }
  }
  
  return allJobs.map(job => `/jobs/${job.slug || job.id}`);
}

// ============================================
// OPTION 5: With Authentication
// ============================================

/**
 * If your API requires authentication
 */
async function fetchJobRoutesWithAuth() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/jobs`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      params: {
        limit: 1000,
        status: 'published'
      }
    });
    
    const jobs = response.data;
    return jobs.map(job => `/jobs/${job.slug || job.id}`);
  } catch (error) {
    console.error('Error fetching job routes:', error.message);
    return [];
  }
}

// ============================================
// OPTION 6: Category-based routes
// ============================================

/**
 * If you also want to pre-render category pages
 */
async function fetchJobCategoryRoutes() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/job-categories`);
    const categories = response.data;
    
    return categories.map(category => `/jobs/c/${category.slug}`);
  } catch (error) {
    console.error('Error fetching job category routes:', error.message);
    return [];
  }
}

async function fetchLocationRoutes() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/locations`);
    const locations = response.data;
    
    return locations.map(location => `/jobs/l/${location.slug}`);
  } catch (error) {
    console.error('Error fetching location routes:', error.message);
    return [];
  }
}

// ============================================
// Complete Example Usage
// ============================================

async function generateAllRoutes() {
  console.log('🚀 Fetching all routes from API...\n');
  
  const [
    jobRoutes,
    courseRoutes,
    blogRoutes,
    categoryRoutes,
    locationRoutes
  ] = await Promise.all([
    fetchJobRoutesWithAxios(),
    fetchCourseRoutesWithAxios(),
    fetchBlogRoutesWithAxios(),
    fetchJobCategoryRoutes(),
    fetchLocationRoutes()
  ]);
  
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
  
  const allRoutes = [
    ...staticRoutes,
    ...jobRoutes,
    ...courseRoutes,
    ...blogRoutes,
    ...categoryRoutes,
    ...locationRoutes
  ];
  
  // Remove duplicates
  const uniqueRoutes = [...new Set(allRoutes)];
  
  console.log(`\n✅ Total routes generated: ${uniqueRoutes.length}`);
  console.log(`   - Static: ${staticRoutes.length}`);
  console.log(`   - Jobs: ${jobRoutes.length}`);
  console.log(`   - Courses: ${courseRoutes.length}`);
  console.log(`   - Blogs: ${blogRoutes.length}`);
  console.log(`   - Categories: ${categoryRoutes.length}`);
  console.log(`   - Locations: ${locationRoutes.length}\n`);
  
  return uniqueRoutes;
}

// ============================================
// Environment Variables
// ============================================

/**
 * Create a .env file in your project root:
 * 
 * VITE_API_BASE_URL=https://api.jobdockets.com
 * API_TOKEN=your_api_token_here
 * 
 * Then load them in generate-routes.js:
 * 
 * import dotenv from 'dotenv';
 * dotenv.config();
 */

export {
  fetchJobRoutesWithAxios,
  fetchCourseRoutesWithAxios,
  fetchBlogRoutesWithAxios,
  fetchJobRoutesWithFetch,
  fetchAllJobsWithPagination,
  fetchJobRoutesWithAuth,
  fetchJobCategoryRoutes,
  fetchLocationRoutes,
  generateAllRoutes
};
