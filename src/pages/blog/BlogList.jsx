import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollRestoration } from 'react-router-dom';
import { ArrowRight } from "lucide-react";
import { imageProvider } from '@/imageProvider/ImageProvider';
import useBlogs from '@/hooks/useBlogs';
import { useSEO } from '@/hooks/useSEO';
import SEOHead from '@/components/SEOHead';

const BlogList = () => {
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
            <div className="min-h-screen bg-[#f9f9f9] py-12 px-6 md:px-20">
                <ScrollRestoration />
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#22404B] mb-4">
                            Blog Space
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore entertaining articles, inspiring stories, media highlights, and lifestyle tips tailored for freelancers and remote workers
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((index) => (
                            <div key={index} className="animate-pulse">
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <div className="h-48 bg-gray-300"></div>
                                    <div className="p-6 space-y-3">
                                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                                        <div className="h-10 bg-gray-300 rounded w-1/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-[#f9f9f9] py-12 px-6 md:px-20">
                <ScrollRestoration />
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#22404B] mb-4">
                        Blog Space
                    </h1>
                    <p className="text-red-500">Error loading blogs: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] py-12 px-6 md:px-20">
            <SEOHead seoData={seoData} />
            <ScrollRestoration />
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#22404B] mb-4">
                        {seoData?.h1_tags || "Blog Space"}
                    </h1>
                    <h2 className="text-gray-600 max-w-2xl mx-auto">
                        Explore entertaining articles, inspiring stories, media highlights, and lifestyle tips tailored for freelancers and remote workers
                    </h2>
                </div>

                {/* Blog Grid */}
                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog) => (
                            <div
                                key={blog.id}
                                className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 ease-in-out"
                            >
                                {/* Blog Image */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={blog.image || imageProvider.blog3}
                                        alt={blog.title}
                                        className="w-full h-48 object-cover transition duration-300 ease-in-out group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.src = imageProvider.blog3;
                                        }}
                                    />
                                </div>

                                {/* Blog Content */}
                                <div className="p-6">
                                    {/* Date */}
                                    <p className="text-sm text-gray-500 mb-3">
                                        {formatDate(blog.published_at || blog.created_at)}
                                    </p>

                                    {/* Title */}
                                    <h3 className="font-semibold text-lg md:text-xl text-[#22404B] mb-3 line-clamp-2 group-hover:text-[#00A8FF] transition-colors">
                                        {blog.title}
                                    </h3>

                                    {/* Description */}
                                    <div 
                                        className="text-sm text-gray-600 mb-4 line-clamp-3"
                                        dangerouslySetInnerHTML={{ __html: blog.description }}
                                    />

                                    {/* Read More Button */}
                                    <Link
                                        to={`/blog/${blog.id}`}
                                        className="inline-flex items-center gap-2 text-[#00A8FF] hover:text-[#0088CC] font-medium text-sm transition-colors"
                                    >
                                        Read More <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-[#22404B] mb-2">No Blogs Available</h3>
                            <p className="text-gray-600">Check back soon for new content!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList; 