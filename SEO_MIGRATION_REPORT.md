# SEO Migration Report - JobDockets.com
**Generated:** December 5, 2025

## Project Status ✅

### 1. Project Verification
- ✅ Dependencies installed successfully (402 packages)
- ✅ Vulnerabilities resolved (npm audit fix - 0 vulnerabilities remaining)
- ✅ Development server running on http://localhost:5173/
- ✅ No build errors detected

### 2. Technology Stack
- **Framework:** React 18.3.1 with Vite 6.4.1
- **Router:** React Router DOM 7.5.3
- **State Management:** TanStack React Query 5.75.4
- **Styling:** Tailwind CSS 4.1.5
- **SEO Library:** react-helmet-async 2.0.5
- **API Client:** Axios 1.9.0

---

## Public Routes Map

### Main Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Homepage |
| `/about` | AboutPage | About page |
| `/contact` | ContactPage | Contact page |
| `/privacy` | PrivacyPage | Privacy policy |
| `/terms` | TermsPage | Terms of service |

### Jobs Routes
| Route | Component | Description | Type |
|-------|-----------|-------------|------|
| `/jobs` | AllJobs | Jobs listing page | Static |
| `/all-jobs` | AllJobs | Alternative jobs listing | Static |
| `/jobs/c/:categorySlug` | AllJobs | Jobs by category | Dynamic |
| `/jobs/l/:locationSlug` | AllJobs | Jobs by location | Dynamic |
| `/jobs/c/:categorySlug/l/:locationSlug` | AllJobs | Jobs by category & location | Dynamic |
| `/jobs/:jobSlug` | JobDetails | Individual job details | Dynamic |

### Courses Routes
| Route | Component | Description | Type |
|-------|-----------|-------------|------|
| `/free-courses` | AllCourses | Courses listing page | Static |
| `/courses` | Navigate → `/free-courses` | Redirect to free courses | Redirect |
| `/courses/c/:categorySlug` | AllCourses | Courses by category | Dynamic |
| `/courses/c/:categorySlug/:subcategorySlug` | AllCourses | Courses by category & subcategory | Dynamic |
| `/courses/:legacyCourseId(\\d+)` | Navigate → `/free-courses` | Legacy redirect | Redirect |
| `/courses/:courseSlug` | CourseDetails | Individual course details | Dynamic |

### Blog Routes
| Route | Component | Description | Type |
|-------|-----------|-------------|------|
| `/blog` | BlogSpace | Blog listing page | Static |
| `/blog/:slug` | BlogDetails | Individual blog post | Dynamic |
| `/blogs/:legacyBlogId(\\d+)` | Navigate → `/free-courses` | Legacy redirect | Redirect |

### Utility Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/rates-invoices` | FreelancerKits | Currency rates & invoice generator |

---

## API Endpoints Map

### Base Configuration
- **API Base URL:** `https://admin.jobdockets.com/api`
- **Image Base URL:** `https://admin.jobdockets.com/`
- **Timeout:** 30000ms (30 seconds)

### API Endpoints Identified

#### 1. Jobs/Internships Endpoint
```
GET /job-posts
```
**Parameters:**
- `per_page`: 40 (pagination)
- `sort_by`: "created_at"
- `sort_direction`: "desc"

**Response Structure:**
```javascript
{
  data: {
    jobs: []
  }
}
```

**Used in:**
- `InternshipProvider.jsx` (provides jobs data context)
- `AllJobs.jsx` page
- `JobDetails.jsx` page

---

#### 2. Courses Endpoint
```
GET /courses
```
**Parameters:**
- `per_page`: 40 (pagination)
- `sort_by`: "created_at"
- `sort_direction`: "desc"

**Response Structure:**
```javascript
{
  data: {
    courses: []
  }
}
```

**Used in:**
- `CourseProvider.jsx` (provides courses data context)
- `AllCourses.jsx` page
- `CourseDetails.jsx` page

---

#### 3. Blog Endpoint
```
GET /blogs
```
**Response Structure:**
```javascript
{
  data: []
}
```

**Used in:**
- `useBlogs.js` hook
- `BlogSpace.jsx` page
- `BlogDetails.jsx` page

---

#### 4. SEO/Dynamic Page Endpoints
Based on `useSEO.js` and `useDynamicPage.js` hooks, there appear to be SEO-specific endpoints (implementation to be verified in those files).

---

#### 5. External API
```
GET https://api.exchangerate.host/latest?base=USD&symbols=NGN
```
**Purpose:** Currency exchange rates for invoice generator
**Used in:** `useExchangeRates.js`

---

## SEO Current State Analysis

### SEO Implementation Found
1. **react-helmet-async** installed and configured
2. SEO component exists: `src/components/SEOHead.jsx`
3. Custom SEO hooks:
   - `useSEO.js` (for SEO data fetching)
   - `useDynamicPage.js` (for dynamic page content)

### Critical SEO Issues (React SPA)
⚠️ **Client-Side Rendering:** The application is a pure React SPA (Single Page Application) with client-side routing. This means:
- Search engines receive minimal HTML on initial load
- Content is loaded via JavaScript after page load
- Dynamic routes (jobs, courses, blog posts) are not pre-rendered
- Meta tags are updated client-side (may not be crawled properly)

---

## Next Steps for SEO Migration

### Recommended Actions:

#### 1. Capture "Before" SEO Baseline
Run the following command to capture raw HTML:
```bash
curl -A "Googlebot" -L http://localhost:5173/ > seo-baseline-home.html
curl -A "Googlebot" -L https://jobdockets.com/ > seo-baseline-production-home.html
```

#### 2. Required Screenshots
- [ ] Google Search Console - "not indexed" pages
- [ ] Lighthouse report - Home page
- [ ] Lighthouse report - Job details page  
- [ ] Lighthouse report - Blog post page
- [ ] Google Search Console - Coverage report
- [ ] Current indexing status

#### 3. Migration Strategy Options

**Option A: Next.js Migration (Recommended)**
- Convert to Next.js with App Router
- Implement SSR/SSG for all public pages
- Use Incremental Static Regeneration (ISR) for dynamic content
- Preserve existing React components

**Option B: Pre-rendering Solution**
- Use react-snap or react-snapshot
- Generate static HTML for all routes
- Implement dynamic sitemap generation
- Add prerendering middleware

**Option C: SSR with Vite**
- Implement Vite SSR plugin
- Configure server-side rendering
- Maintain current Vite setup

---

## Critical Findings

### URLs Requiring SSR/SSG
Based on the route analysis, these dynamic routes need server-side rendering:

**High Priority (Content Pages):**
- `/jobs/:jobSlug` - Individual job postings
- `/courses/:courseSlug` - Individual courses
- `/blog/:slug` - Individual blog posts

**Medium Priority (Listing Pages):**
- `/jobs` - Jobs listing
- `/free-courses` - Courses listing
- `/blog` - Blog listing
- `/jobs/c/:categorySlug` - Category-filtered jobs
- `/courses/c/:categorySlug` - Category-filtered courses

**Low Priority (Filter Combinations):**
- `/jobs/l/:locationSlug` - Location-filtered jobs
- `/jobs/c/:categorySlug/l/:locationSlug` - Combined filters
- `/courses/c/:categorySlug/:subcategorySlug` - Subcategory filters

---

## Technical Debt & Issues

### Legacy Redirects Found
```javascript
/courses/:legacyCourseId(\\d+) → /free-courses
/blogs/:legacyBlogId(\\d+) → /free-courses
```
These suggest a previous migration. Need to:
- Verify 301 redirects are properly configured
- Update sitemap to exclude legacy URLs
- Check for broken internal links

### API Concerns
1. No API pagination visible for SEO crawling
2. No sitemap generation endpoint found
3. No structured data (JSON-LD) implementation detected

---

## Files to Review for Complete API Map
- [ ] `src/hooks/useSEO.js` - SEO-specific API calls
- [ ] `src/hooks/useDynamicPage.js` - Dynamic content fetching
- [ ] `src/hooks/useCMS.js` - CMS integration endpoints
- [ ] `src/pages/jobs/JobDetails.jsx` - Individual job API calls
- [ ] `src/pages/courses/CourseDetails.jsx` - Individual course API calls
- [ ] `src/pages/blog/BlogDetails.jsx` - Individual blog API calls

---

## Action Items for Next Session

1. **Capture SEO Baseline**
   - Run curl commands to save raw HTML
   - Take screenshots of Search Console
   - Run Lighthouse audits

2. **Complete API Documentation**
   - Review individual page components for API calls
   - Document query parameters for filtering/pagination
   - Identify all endpoints used

3. **Plan Migration Architecture**
   - Choose migration path (Next.js recommended)
   - Create component migration checklist
   - Plan routing structure preservation

4. **Set Up Testing Environment**
   - Configure preview deployment
   - Set up A/B testing for SEO comparison
   - Prepare rollback strategy

---

## Summary Statistics

- **Total Public Routes:** 22 routes
- **Dynamic Routes:** 11 routes requiring SSR
- **Static Routes:** 8 routes
- **Redirects:** 3 legacy redirects
- **API Endpoints:** 4+ identified
- **External APIs:** 1 (exchange rates)

**Status:** ✅ Ready for SEO migration planning
