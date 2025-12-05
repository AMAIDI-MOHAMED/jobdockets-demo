import React from 'react';
import { ScrollRestoration } from 'react-router-dom';
import { useDynamicPage } from '@/hooks/useDynamicPage';
import DOMPurify from 'dompurify';
import SEOHead from '@/components/SEOHead';

const AboutPage = () => {
    const { pageData, isLoading } = useDynamicPage('about-us');

    const seoData = {
        meta_title: pageData?.page_title || 'About Us - Jobdockets',
        meta_description: 'Learn about Jobdockets, Nigeria\'s leading platform for job opportunities, free courses, and freelancer tools.',
        canonical_url: 'https://jobdockets.com/about',
        og_type: 'website',
        og_title: 'About Jobdockets',
        og_description: 'Nigeria\'s leading job and education platform',
        og_url: 'https://jobdockets.com/about',
        structured_data: {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Jobdockets",
            "description": "Learn about Jobdockets mission and services"
        }
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] py-12 px-6 md:px-20">
            <SEOHead seoData={seoData} />
            <ScrollRestoration />
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-10">
                <h1 className="text-3xl font-bold text-[#22404B] mb-6 border-b pb-3">
                    {isLoading ? (
                        <div className="h-8 w-2/3 bg-gray-300 rounded animate-pulse"></div>
                    ) : (
                        pageData?.page_title || 'About Us'
                    )}
                </h1>

                {isLoading ? (
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                    </div>
                ) : (
                    <div 
                        className="space-y-6 text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(pageData?.page_content || '')
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default AboutPage; 