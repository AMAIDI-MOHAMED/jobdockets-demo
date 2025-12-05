import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from "lucide-react";
import { imageProvider } from '@/imageProvider/ImageProvider';
import useBlogs from '@/hooks/useBlogs';
import {useSEO} from "@/hooks/useSEO.js";
import SEOHead from "@/components/SEOHead.jsx";

const BlogSpace = () => {
    const { blogs, loading, error } = useBlogs();
    const { seoData } = useSEO('blog');

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Loading state
    if (loading) {
        return (
            <section className="px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:flex-row gap-6 lg:gap-10">
                <div className="space-y-4 lg:space-y-6 lg:w-[40%]">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                        {seoData?.h1_tags || "Daily Nigerian Updates"}
                    </h2>
                    <p className="text-Gray text-sm sm:text-base">
                        Nigerian News, Economy, Business, and Finance Highlights 
                    </p>
                </div>
                <div className="space-y-4 lg:space-y-6 lg:w-[60%]">
                    {[1, 2, 3].map((index) => (
                        <div key={index} className="animate-pulse">
                            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-5 rounded-xl bg-gray-200">
                                <div className="w-full sm:w-1/3 h-48 sm:h-auto rounded-lg bg-gray-300"></div>
                                <div className="space-y-2 sm:space-y-3 w-full sm:w-2/3">
                                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className="px-4 sm:px-6 py-8 sm:py-12">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
                        {seoData?.h1_tags || "Daily Nigerian Updates"}
                    </h2>
                    <p className="text-red-500">Error loading blogs: {error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:flex-row gap-6 lg:gap-10">
            <SEOHead seoData={seoData} />

            {/* Left Column */}
            <div className="space-y-4 lg:space-y-6 lg:w-[40%]">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                    {seoData?.h1_tags || "Daily Nigerian Updates"}
                </h2>
                <p className="text-Gray text-sm sm:text-base">
                    Nigerian News, Economy, Business, and Finance Highlights 
                </p>
            </div>

            {/* Right Column */}
            <div className="space-y-4 lg:space-y-6 lg:w-[60%]">
                {blogs.length > 0 ? (
                    blogs.slice(0, 3).map((blog, index) => (
                        <div
                            key={blog.id}
                            className={`group flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-5 rounded-xl bg-[#F1FBFF] shadow-sm transition duration-300 ease-in-out hover:bg-Custom-primary hover:text-white`}
                        >
                            <img
                                src={blog.image || imageProvider.blog3}
                                alt={blog.title}
                                className="w-full sm:w-1/3 h-48 sm:h-auto rounded-lg object-cover flex-shrink-0 transition duration-300 ease-in-out group-hover:brightness-75"
                                onError={(e) => {
                                    e.target.src = imageProvider.blog3;
                                }}
                            />
                            <div className="flex flex-col justify-between transition-all duration-300 ease-in-out space-y-2 sm:space-y-3 w-full sm:w-2/3">
                                <p className={`text-base sm:text-lg transition group-hover:text-white`}>
                                    {formatDate(blog.published_at || blog.created_at)}
                                </p>
                                <h3 className={`font-semibold text-xl sm:text-2xl transition group-hover:text-white line-clamp-2`}>
                                    {blog.title}
                                </h3>
                                <div 
                                    className={`text-xs sm:text-sm opacity-80 transition group-hover:text-white line-clamp-3`}
                                    dangerouslySetInnerHTML={{ __html: blog.description }}
                                />
                                <Link
                                    to={`/blog/${blog.slug || blog.id}`}
                                    className={`mt-2 flex items-center w-fit gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full text-xs sm:text-sm font-medium transition duration-300 ease-in-out bg-Custom-primary group-hover:bg-[#FEEAA0] text-white group-hover:text-black  transform hover:scale-105`}
                                >
                                    Read More <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No blogs available at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogSpace;