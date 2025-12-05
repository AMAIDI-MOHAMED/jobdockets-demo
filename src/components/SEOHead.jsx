import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEOHead Component - Dynamic SEO meta tags using React Helmet
 * 
 * @param {Object} seoData - SEO configuration object
 * @param {string} seoData.meta_title - Page title (required)
 * @param {string} seoData.meta_description - Page description (required)
 * @param {string} seoData.meta_keywords - SEO keywords
 * @param {string} seoData.canonical_url - Canonical URL (required)
 * @param {string} seoData.og_title - Open Graph title
 * @param {string} seoData.og_description - Open Graph description
 * @param {string} seoData.og_image - Open Graph image URL
 * @param {string} seoData.og_url - Open Graph URL
 * @param {string} seoData.og_type - Open Graph type (website, article, etc.)
 * @param {string} seoData.twitter_card - Twitter card type
 * @param {Object} seoData.structured_data - JSON-LD structured data
 * 
 * @example
 * <SEOHead seoData={{
 *   meta_title: "Job Title - Jobdockets",
 *   meta_description: "Job description...",
 *   canonical_url: "https://jobdockets.com/jobs/job-slug",
 *   og_type: "article"
 * }} />
 */
const SEOHead = ({ 
    seoData 
}) => {
    // Fallback values
    const title = seoData?.meta_title || 'Jobdockets';
    const description = seoData?.meta_description || 'Find the latest job opportunities and free courses on Jobdockets.';
    const canonicalUrl = seoData?.canonical_url || 'https://jobdockets.com/';
    
    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {seoData?.meta_keywords && <meta name="keywords" content={seoData.meta_keywords} />}
            <meta name="robots" content="index, follow" />
            <meta name="author" content="Jobdockets" />
            
            {/* Canonical URL - Critical for SEO */}
            <link rel="canonical" href={canonicalUrl} />
            
            {/* Open Graph Meta Tags - For social sharing */}
            <meta property="og:title" content={seoData?.og_title || title} />
            <meta property="og:description" content={seoData?.og_description || description} />
            <meta property="og:url" content={seoData?.og_url || canonicalUrl} />
            <meta property="og:type" content={seoData?.og_type || 'website'} />
            <meta property="og:site_name" content="Jobdockets" />
            {seoData?.og_image && <meta property="og:image" content={seoData.og_image} />}
            {seoData?.og_image && <meta property="og:image:width" content="1200" />}
            {seoData?.og_image && <meta property="og:image:height" content="630" />}
            
            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content={seoData?.twitter_card || 'summary_large_image'} />
            <meta name="twitter:title" content={seoData?.twitter_title || title} />
            <meta name="twitter:description" content={seoData?.twitter_description || description} />
            {seoData?.twitter_image && <meta name="twitter:image" content={seoData.twitter_image} />}
            {seoData?.twitter_site && <meta name="twitter:site" content={seoData.twitter_site} />}
            {seoData?.twitter_creator && <meta name="twitter:creator" content={seoData.twitter_creator} />}
            
            {/* Additional Meta Tags */}
            {seoData?.additional_meta_tags && seoData.additional_meta_tags.map((tag, index) => (
                <meta key={index} name={tag.name} content={tag.content} />
            ))}
            
            {/* Structured Data (JSON-LD) - Critical for rich results */}
            {seoData?.structured_data && (
                <script type="application/ld+json">
                    {JSON.stringify(seoData.structured_data)}
                </script>
            )}
        </Helmet>
    );
};

export default SEOHead;