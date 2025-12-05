import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/layout/Layout";

// Lazy load all page components for code splitting
const Home = lazy(() => import("@/pages/home/Home"));
const FreelancerKits = lazy(() => import("@/pages/freelancerKits/FreelancerKits"));
const AllJobs = lazy(() => import("@/pages/jobs/AllJobs"));
const JobDetails = lazy(() => import("@/pages/jobs/JobDetails"));
const AllCourses = lazy(() => import("@/pages/courses/AllCourses"));
const CourseDetails = lazy(() => import("@/pages/courses/CourseDetails"));
const BlogSpace = lazy(() => import("@/components/BlogSpace"));
const BlogDetails = lazy(() => import("@/pages/blog/BlogDetails"));
const AboutPage = lazy(() => import("@/pages/about/AboutPage"));
const ContactPage = lazy(() => import("@/pages/contact/ContactPage"));
const PrivacyPage = lazy(() => import("@/pages/privacy/PrivacyPage"));
const TermsPage = lazy(() => import("@/pages/terms/TermsPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: "/rates-invoices",
        element: (
          <Suspense fallback={<PageLoader />}>
            <FreelancerKits />
          </Suspense>
        ),
      },
      {
        path: '/all-jobs',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AllJobs />
          </Suspense>
        )
      },
      {
        path: '/jobs',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AllJobs />
          </Suspense>
        )
      },
      {
        path: '/jobs/c/:categorySlug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AllJobs />
          </Suspense>
        )
      },
      {
        path: '/jobs/l/:locationSlug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AllJobs />
          </Suspense>
        )
      },
      {
        path: '/jobs/c/:categorySlug/l/:locationSlug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AllJobs />
          </Suspense>
        )
      },
      {
        path: '/jobs/:jobSlug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <JobDetails />
          </Suspense>
        )
      },
      {
        path: '/free-courses',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AllCourses />
          </Suspense>
        )
      },
      {
        path: '/courses',
        element: <Navigate to="/free-courses" replace />
      },
      {
        path: '/courses/c/:categorySlug/:subcategorySlug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AllCourses />
          </Suspense>
        )
      },
      {
        path: '/courses/c/:categorySlug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AllCourses />
          </Suspense>
        )
      },
      {
        path: '/courses/:legacyCourseId(\\d+)',
        element: <Navigate to="/free-courses" replace />
      },
      {
        path: '/courses/:courseSlug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CourseDetails />
          </Suspense>
        )
      },
      {
        path: '/privacy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PrivacyPage />
          </Suspense>
        )
      },
      {
        path: '/about',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        )
      },
      {
        path: '/terms',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TermsPage />
          </Suspense>
        )
      },
      {
        path: '/contact',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactPage />
          </Suspense>
        )
      },
      {
        path: '/blog',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BlogSpace />
          </Suspense>
        )
      },
      {
        path: '/blogs/:legacyBlogId(\\d+)',
        element: <Navigate to="/free-courses" replace />
      },
      {
        path: '/blog/:slug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BlogDetails />
          </Suspense>
        )
      }
    ],
  },
]);

export default router;
