# Quick Start: React Snap Pre-rendering

## 🚀 Build Your Pre-rendered Site

### Option 1: Build with Static Routes Only

```bash
npm run build
```

This pre-renders all static routes defined in `package.json`:
- Homepage (`/`)
- Jobs listing (`/jobs`)
- Courses listing (`/free-courses`)
- Blog listing (`/blog`)
- Static pages (`/about`, `/contact`, `/privacy`, `/terms`)

### Option 2: Build with Dynamic Routes (Recommended)

**Step 1:** Update the API configuration in `generate-routes.js`:

```javascript
const config = {
  apiBaseUrl: 'https://your-api.com',
  endpoints: {
    jobs: '/api/jobs',
    courses: '/api/courses',
    blogs: '/api/blogs'
  }
};
```

**Step 2:** Implement the fetch functions in `generate-routes.js`:

```javascript
async function fetchJobRoutes() {
  const response = await fetch(`${config.apiBaseUrl}${config.endpoints.jobs}`);
  const jobs = await response.json();
  return jobs.map(job => `/jobs/${job.slug}`);
}
```

**Step 3:** Generate routes and build:

```bash
node generate-routes.js
npm run build
```

## 🧪 Test Your Pre-rendered Site

### Local Testing

```bash
npm run preview
```

Visit `http://localhost:4173` and:

1. **View Page Source** (Right-click → View Page Source)
   - ✅ You should see full HTML content, not just `<div id="root"></div>`
   - ✅ Meta tags should be visible in the source
   - ✅ Content should be in the HTML

2. **Disable JavaScript**
   - Open DevTools (F12)
   - Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
   - Type "Disable JavaScript" and enable it
   - Reload the page
   - ✅ Content should still be visible

3. **Check Individual Pages**
   - Navigate to `/jobs`, `/free-courses`, `/blog`
   - View source for each page
   - Verify content is pre-rendered

## 📁 What Gets Generated

After running `npm run build`, your `dist/` folder will contain:

```
dist/
├── index.html              ← Pre-rendered homepage
├── jobs/
│   └── index.html         ← Pre-rendered jobs page
├── free-courses/
│   └── index.html         ← Pre-rendered courses page
├── blog/
│   └── index.html         ← Pre-rendered blog page
├── about/
│   └── index.html
├── contact/
│   └── index.html
└── assets/
    ├── index-[hash].js
    └── index-[hash].css
```

## 🐛 Common Issues

### "react-snap" not found
```bash
npm install --save-dev react-snap
```

### Pages not pre-rendering
Check that routes are listed in `package.json` → `reactSnap.include`

### Build fails
Add this to `package.json` → `reactSnap`:
```json
"puppeteerArgs": ["--no-sandbox", "--disable-setuid-sandbox"]
```

## 📊 Verify SEO Success

1. **Google Search Console**
   - Add your site
   - Submit sitemap: `https://jobdockets.com/sitemap.xml`
   - Request indexing for key pages

2. **Test Tools**
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
   - [PageSpeed Insights](https://pagespeed.web.dev/)

3. **Manual Verification**
   - Search Google for: `site:jobdockets.com`
   - Check if pages are being indexed

## 🚢 Deploy

Your `dist/` folder is ready to deploy to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting provider

Make sure to configure redirects so all routes fall back to `index.html` for client-side routing.

---

For detailed documentation, see [REACT_SNAP_SETUP.md](./REACT_SNAP_SETUP.md)
