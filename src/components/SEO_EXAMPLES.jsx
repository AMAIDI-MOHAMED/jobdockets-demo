/**
 * SEO Implementation Examples for All Page Types
 * 
 * This file contains complete examples of how to implement SEO
 * using React Helmet Async in your application.
 */

import React from 'react';
import SEOHead from '@/components/SEOHead';

// ============================================
// EXAMPLE 1: Homepage SEO
// ============================================

export const HomePageSEOExample = () => {
  const homeSEO = {
    meta_title: "Jobdockets - Find Jobs & Free Courses in Nigeria",
    meta_description: "Discover the latest job opportunities, free online courses, live exchange rates, and freelancer tools on Jobdockets. Your gateway to career growth.",
    meta_keywords: "Nigerian jobs, free courses, Udemy coupons, exchange rates, invoice generator, currency converter",
    canonical_url: "https://jobdockets.com/",
    
    // Open Graph (Facebook, LinkedIn)
    og_title: "Jobdockets - Find Jobs & Free Courses",
    og_description: "Find Nigerian jobs, free Udemy courses, real-time exchange rates, and freelancer tools all in one place.",
    og_url: "https://jobdockets.com/",
    og_type: "website",
    og_image: "https://jobdockets.com/images/og-home.jpg",
    
    // Twitter
    twitter_card: "summary_large_image",
    twitter_title: "Jobdockets - Find Jobs & Free Courses",
    twitter_description: "Your one-stop platform for jobs, courses, and freelancer tools.",
    twitter_image: "https://jobdockets.com/images/twitter-home.jpg",
    
    // Structured Data (JSON-LD)
    structured_data: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Jobdockets",
      "url": "https://jobdockets.com/",
      "description": "Find jobs, free courses, and freelancer tools",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://jobdockets.com/jobs?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  };

  return (
    <div>
      <SEOHead seoData={homeSEO} />
      {/* Your page content */}
    </div>
  );
};

// ============================================
// EXAMPLE 2: Job Listing Page SEO
// ============================================

export const JobListingPageSEOExample = () => {
  const jobsListingSEO = {
    meta_title: "Latest Jobs in Nigeria - Jobdockets",
    meta_description: "Browse hundreds of verified job opportunities across Nigeria. Find your next career move with Jobdockets.",
    meta_keywords: "jobs Nigeria, job vacancies, careers, employment opportunities",
    canonical_url: "https://jobdockets.com/jobs",
    
    og_type: "website",
    og_title: "Latest Jobs in Nigeria",
    og_description: "Browse hundreds of verified job opportunities",
    og_url: "https://jobdockets.com/jobs",
    
    structured_data: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Job Listings",
      "description": "Browse job opportunities in Nigeria"
    }
  };

  return (
    <div>
      <SEOHead seoData={jobsListingSEO} />
      {/* Job listing content */}
    </div>
  );
};

// ============================================
// EXAMPLE 3: Job Details Page SEO (Dynamic)
// ============================================

export const JobDetailsPageSEOExample = ({ jobData }) => {
  // Sanitize HTML description for meta tags
  const cleanDescription = (jobData?.description || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 155);

  const jobDetailsSEO = {
    meta_title: `${jobData?.title} at ${jobData?.company} - Jobdockets`,
    meta_description: cleanDescription || `Apply for ${jobData?.title} position at ${jobData?.company}`,
    meta_keywords: `${jobData?.title}, ${jobData?.company}, ${jobData?.location}, ${jobData?.category_label}`,
    canonical_url: `https://jobdockets.com/jobs/${jobData?.slug}`,
    
    og_type: "article",
    og_title: `${jobData?.title} - ${jobData?.company}`,
    og_description: cleanDescription,
    og_url: `https://jobdockets.com/jobs/${jobData?.slug}`,
    
    // JobPosting structured data
    structured_data: {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": jobData?.title,
      "description": cleanDescription,
      "datePosted": jobData?.created_at,
      "validThrough": jobData?.deadline,
      "employmentType": jobData?.type || "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": jobData?.company,
        "sameAs": "https://jobdockets.com/"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": jobData?.location,
          "addressCountry": "NG"
        }
      },
      "baseSalary": jobData?.salary ? {
        "@type": "MonetaryAmount",
        "currency": "NGN",
        "value": {
          "@type": "QuantitativeValue",
          "value": jobData.salary,
          "unitText": "MONTH"
        }
      } : undefined
    }
  };

  return (
    <div>
      <SEOHead seoData={jobDetailsSEO} />
      {/* Job details content */}
    </div>
  );
};

// ============================================
// EXAMPLE 4: Course Listing Page SEO
// ============================================

export const CourseListingPageSEOExample = () => {
  const coursesListingSEO = {
    meta_title: "Free Online Courses - 100% Off Udemy Coupons - Jobdockets",
    meta_description: "Access thousands of free online courses with 100% off Udemy coupons. Learn programming, design, business, and more.",
    meta_keywords: "free courses, Udemy coupons, online learning, free Udemy, programming courses",
    canonical_url: "https://jobdockets.com/free-courses",
    
    og_type: "website",
    og_title: "Free Online Courses - 100% Off Udemy",
    og_description: "Access thousands of free courses",
    og_url: "https://jobdockets.com/free-courses",
    
    structured_data: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Free Course Listings",
      "description": "Browse free online courses"
    }
  };

  return (
    <div>
      <SEOHead seoData={coursesListingSEO} />
      {/* Course listing content */}
    </div>
  );
};

// ============================================
// EXAMPLE 5: Course Details Page SEO (Dynamic)
// ============================================

export const CourseDetailsPageSEOExample = ({ courseData }) => {
  const cleanDescription = (courseData?.description || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 155);

  const courseDetailsSEO = {
    meta_title: `${courseData?.title} - Free Course - Jobdockets`,
    meta_description: cleanDescription || `Enroll in ${courseData?.title} for free. Limited time offer.`,
    meta_keywords: `${courseData?.title}, free course, online learning, ${courseData?.category}`,
    canonical_url: `https://jobdockets.com/courses/${courseData?.slug}`,
    
    og_type: "article",
    og_title: courseData?.title,
    og_description: cleanDescription,
    og_url: `https://jobdockets.com/courses/${courseData?.slug}`,
    og_image: courseData?.image,
    
    // Course structured data
    structured_data: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": courseData?.title,
      "description": cleanDescription,
      "provider": {
        "@type": "Organization",
        "name": courseData?.platform || "Udemy",
        "sameAs": "https://www.udemy.com"
      },
      "image": courseData?.image,
      "educationalLevel": courseData?.level || "Beginner",
      "instructor": courseData?.instructor ? {
        "@type": "Person",
        "name": courseData.instructor
      } : undefined,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    }
  };

  return (
    <div>
      <SEOHead seoData={courseDetailsSEO} />
      {/* Course details content */}
    </div>
  );
};

// ============================================
// EXAMPLE 6: Blog Listing Page SEO
// ============================================

export const BlogListingPageSEOExample = () => {
  const blogListingSEO = {
    meta_title: "Blog - Career Tips & Industry Insights - Jobdockets",
    meta_description: "Read expert articles on career development, job search tips, and industry trends. Stay informed with Jobdockets blog.",
    meta_keywords: "career blog, job search tips, career advice, industry insights",
    canonical_url: "https://jobdockets.com/blog",
    
    og_type: "website",
    og_title: "Jobdockets Blog - Career Tips & Insights",
    og_description: "Expert articles on career development and job search",
    og_url: "https://jobdockets.com/blog",
    
    structured_data: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Jobdockets Blog",
      "description": "Career tips and industry insights"
    }
  };

  return (
    <div>
      <SEOHead seoData={blogListingSEO} />
      {/* Blog listing content */}
    </div>
  );
};

// ============================================
// EXAMPLE 7: Blog Post Details SEO (Dynamic)
// ============================================

export const BlogPostDetailsSEOExample = ({ blogData }) => {
  const cleanDescription = (blogData?.content || blogData?.excerpt || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 155);

  const blogPostSEO = {
    meta_title: `${blogData?.title} - Jobdockets Blog`,
    meta_description: cleanDescription,
    meta_keywords: blogData?.tags?.join(', '),
    canonical_url: `https://jobdockets.com/blog/${blogData?.slug}`,
    
    og_type: "article",
    og_title: blogData?.title,
    og_description: cleanDescription,
    og_url: `https://jobdockets.com/blog/${blogData?.slug}`,
    og_image: blogData?.featured_image,
    
    // Article structured data
    structured_data: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": blogData?.title,
      "description": cleanDescription,
      "image": blogData?.featured_image,
      "author": {
        "@type": "Person",
        "name": blogData?.author || "Jobdockets Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Jobdockets",
        "logo": {
          "@type": "ImageObject",
          "url": "https://jobdockets.com/logo.png"
        }
      },
      "datePublished": blogData?.published_at,
      "dateModified": blogData?.updated_at,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://jobdockets.com/blog/${blogData?.slug}`
      }
    }
  };

  return (
    <div>
      <SEOHead seoData={blogPostSEO} />
      {/* Blog post content */}
    </div>
  );
};

// ============================================
// EXAMPLE 8: Static Pages (About, Contact, etc.)
// ============================================

export const AboutPageSEOExample = () => {
  const aboutSEO = {
    meta_title: "About Us - Jobdockets",
    meta_description: "Learn about Jobdockets, Nigeria's leading platform for job opportunities, free courses, and freelancer tools.",
    canonical_url: "https://jobdockets.com/about",
    
    og_type: "website",
    og_title: "About Jobdockets",
    og_description: "Nigeria's leading job and education platform",
    og_url: "https://jobdockets.com/about",
    
    structured_data: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Jobdockets",
      "description": "Learn about our mission and services"
    }
  };

  return (
    <div>
      <SEOHead seoData={aboutSEO} />
      {/* About page content */}
    </div>
  );
};

export const ContactPageSEOExample = () => {
  const contactSEO = {
    meta_title: "Contact Us - Jobdockets",
    meta_description: "Get in touch with the Jobdockets team. We're here to help with your questions about jobs, courses, and our services.",
    canonical_url: "https://jobdockets.com/contact",
    
    og_type: "website",
    og_title: "Contact Jobdockets",
    og_url: "https://jobdockets.com/contact",
    
    structured_data: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Jobdockets",
      "description": "Get in touch with us"
    }
  };

  return (
    <div>
      <SEOHead seoData={contactSEO} />
      {/* Contact page content */}
    </div>
  );
};

// ============================================
// USAGE INSTRUCTIONS
// ============================================

/**
 * HOW TO USE IN YOUR COMPONENTS:
 * 
 * 1. Import SEOHead component:
 *    import SEOHead from '@/components/SEOHead';
 * 
 * 2. Create seoData object with page-specific data
 * 
 * 3. Place <SEOHead seoData={seoData} /> at the top of your component's JSX
 * 
 * 4. For dynamic pages (jobs, courses, blogs), create seoData from API response
 * 
 * EXAMPLE IN A REAL COMPONENT:
 */

export const RealWorldExample = () => {
  // In a real component, this would come from API/props
  const jobData = {
    title: "Senior React Developer",
    company: "Tech Company Ltd",
    location: "Lagos, Nigeria",
    slug: "senior-react-developer-tech-company",
    description: "<p>We're looking for an experienced React developer...</p>",
    created_at: "2025-12-01",
    deadline: "2025-12-31",
    type: "FULL_TIME",
    category_label: "Technology"
  };

  const seoData = {
    meta_title: `${jobData.title} at ${jobData.company} - Jobdockets`,
    meta_description: jobData.description.replace(/<[^>]+>/g, ' ').substring(0, 155),
    canonical_url: `https://jobdockets.com/jobs/${jobData.slug}`,
    og_type: "article",
    structured_data: {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": jobData.title,
      // ... rest of structured data
    }
  };

  return (
    <div>
      {/* SEO Meta Tags */}
      <SEOHead seoData={seoData} />
      
      {/* Page Content */}
      <h1>{jobData.title}</h1>
      <p>Company: {jobData.company}</p>
      {/* ... rest of your component */}
    </div>
  );
};
