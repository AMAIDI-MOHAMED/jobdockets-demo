# React Snap Pre-rendering Setup Guide

## 🎯 Overview

This project now uses **react-snap** to pre-render all public routes at build time, making your React application fully indexable by Google without requiring Next.js or external services.

## 📦 What Was Installed

```bash
npm install --save-dev react-snap
```

## 🔧 Configuration

### 1. Package.json Changes

The following has been added to `package.json`:

```json
{
  "scripts": {
    "postbuild": "react-snap"
  },
  "reactSnap": {
    "source": "dist",
    "minifyHtml": {
      "collapseWhitespace": true,
      "removeComments": true,
      "minifyCSS": true
    },
    "include": [
      "/",
      "/jobs",
      "/free-courses",
      "/blog",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
      "/rates-invoices"
    ]
  }
}
```

### 2. Main.jsx Changes

The application entry point has been modified to support hydration:

- Uses `hydrateRoot` for pre-rendered content
- Falls back to `createRoot` for client-side rendering
- Maintains full React functionality

## 🚀 How to Build and Deploy

### Basic Build (Static Routes Only)

```bash
npm run build
```

This will:
1. Build your React app with Vite
2. Automatically run react-snap to pre-render all routes listed in `package.json`
3. Generate static HTML files in the `dist/` folder

### Build with Dynamic Routes

For pages with dynamic content (jobs, courses, blogs), you need to generate routes first:

#### Step 1: Update `generate-routes.js`

Open `generate-routes.js` and update the API endpoints:

```javascript
const config = {
  apiBaseUrl: 'https://api.jobdockets.com',
  endpoints: {
    jobs: '/api/jobs',
    courses: '/api/courses',
    blogs: '/api/blogs'
  }
};
```

Then implement the fetch functions:

```javascript
async function fetchJobRoutes() {
  const response = await fetch(`${config.apiBaseUrl}${config.endpoints.jobs}`);
  const jobs = await response.json();
  return jobs.map(job => `/jobs/${job.slug}`);
}
```

#### Step 2: Generate Routes

```bash
node generate-routes.js
```

This will:
- Fetch all jobs, courses, and blog posts from your API
- Generate a complete list of routes
- Update `package.json` with all routes to pre-render
- Create `routes.json` for reference

#### Step 3: Build

```bash
npm run build
```

## 📁 Output Structure

After building, your `dist/` folder will contain:

```
dist/
├── index.html              # Pre-rendered homepage
├── jobs/
│   ├── index.html         # Pre-rendered /jobs page
│   └── [job-slug]/
│       └── index.html     # Pre-rendered job detail pages
├── free-courses/
│   ├── index.html
│   └── [course-slug]/
│       └── index.html
├── blog/
│   ├── index.html
│   └── [blog-slug]/
│       └── index.html
└── assets/
    ├── js/
    └── css/
```

## 🔍 SEO Benefits

✅ **Fully Crawlable**: All pages have pre-rendered HTML
✅ **Fast First Paint**: Instant content display
✅ **Meta Tags**: All SEO meta tags are rendered server-side
✅ **Social Sharing**: Open Graph tags work perfectly
✅ **No JavaScript Required**: Content is accessible even without JS

## 🧪 Testing Pre-rendered Pages

### 1. Test Locally

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` and:
- View page source (Ctrl+U)
- Verify that HTML content is visible in the source
- Check that meta tags are present

### 2. Test Crawlability

Use these tools:
- **View Source**: Should show full HTML content
- **Google Search Console**: Submit sitemap and test URL
- **Lighthouse SEO Audit**: Should score 100
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly

### 3. Disable JavaScript

In Chrome DevTools:
1. Open DevTools (F12)
2. Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
3. Type "Disable JavaScript"
4. Reload page

Content should still be visible!

## 🎨 Customizing react-snap

You can modify the `reactSnap` configuration in `package.json`:

```json
"reactSnap": {
  "source": "dist",
  "concurrency": 4,              // Number of pages to render simultaneously
  "include": [...],              // Routes to pre-render
  "skipThirdPartyRequests": true, // Skip external API calls during pre-render
  "cacheAjaxRequests": false,    // Don't cache AJAX requests
  "preloadResources": true,      // Preload resources
  "inlineCss": false,            // Keep CSS in separate files
  "minifyHtml": {
    "collapseWhitespace": true,
    "removeComments": true,
    "minifyCSS": true
  }
}
```

## 🐛 Troubleshooting

### Issue: Some pages aren't being pre-rendered

**Solution**: Make sure the route is listed in `reactSnap.include` in `package.json`

### Issue: Dynamic content not showing

**Solution**: 
1. Run `node generate-routes.js` before building
2. Check that your API is accessible during build time
3. Verify routes are added to `package.json`

### Issue: Build fails with puppeteer errors

**Solution**: 
- On Linux/CI: Add these to `reactSnap.puppeteerArgs`:
  ```json
  "puppeteerArgs": ["--no-sandbox", "--disable-setuid-sandbox"]
  ```

### Issue: Styles not loading correctly

**Solution**: Make sure your CSS is imported in `main.jsx` before the App component

## 📊 Performance Monitoring

Monitor your SEO performance with:

1. **Google Search Console**
   - Submit your sitemap
   - Monitor crawl stats
   - Check for indexing issues

2. **Google PageSpeed Insights**
   - Test load times
   - Verify SEO score
   - Check mobile performance

3. **Structured Data Testing**
   - Use Google's Rich Results Test
   - Validate JSON-LD markup

## 🚢 Deployment

### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Apache (.htaccess)

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 📈 Next Steps

1. ✅ Build your project: `npm run build`
2. ✅ Test locally: `npm run preview`
3. ✅ Deploy to your hosting provider
4. ✅ Submit sitemap to Google Search Console
5. ✅ Monitor indexing status

## 🔗 Useful Resources

- [React Snap Documentation](https://github.com/stereobooster/react-snap)
- [Google Search Console](https://search.google.com/search-console)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [SEO Best Practices](https://developers.google.com/search/docs)

---

**Need help?** Check the troubleshooting section or review the react-snap documentation.
