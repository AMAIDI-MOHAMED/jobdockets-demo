import React from 'react';
import { ScrollRestoration } from 'react-router-dom';
import { useDynamicPage } from '@/hooks/useDynamicPage';
import DOMPurify from 'dompurify';

const TermsPage = () => {
    const { pageData, isLoading } = useDynamicPage('terms-conditions');

    return (
        <div className="min-h-screen bg-[#f9f9f9] py-12 px-6 md:px-20">
            <ScrollRestoration />
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-10">
                <h1 className="text-3xl font-bold text-[#22404B] mb-6 border-b pb-3">
                    {isLoading ? (
                        <div className="h-8 w-2/3 bg-gray-300 rounded animate-pulse"></div>
                    ) : (
                        pageData?.page_title || 'Terms & Conditions'
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

export default TermsPage; 