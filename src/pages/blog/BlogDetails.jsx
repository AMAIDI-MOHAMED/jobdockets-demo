import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ScrollRestoration } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { imageProvider } from '@/imageProvider/ImageProvider';
import { Helmet } from 'react-helmet-async';
import './BlogDetails.css';
import toast from 'react-hot-toast';

const BlogDetails = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosPublic = useAxiosPublic();

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                setLoading(true);
                const response = await axiosPublic.get(`/blogs/details/${slug}`);
                setBlog(response.data.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching blog details:', err);
                if (err?.response?.status === 404) {
                    setError(null);
                    setBlog(null);
                } else {
                    setError(err.message || 'Failed to fetch blog details');
                }
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchBlogDetails();
        }
    }, [slug]);

    // Set meta tags when blog data is loaded
    useEffect(() => {
        if (blog) {
            // Set document title
            document.title = blog.meta_title || blog.title;
            
            // Function to set or update meta tag
            const setMetaTag = (name, property, content) => {
                let metaTag = document.querySelector(`meta[${name ? 'name' : 'property'}="${name || property}"]`);
                if (!metaTag) {
                    metaTag = document.createElement('meta');
                    if (name) {
                        metaTag.name = name;
                    } else {
                        metaTag.setAttribute('property', property);
                    }
                    document.head.appendChild(metaTag);
                }
                metaTag.content = content;
            };
            
            // Set meta description
            setMetaTag('description', null, blog.meta_description || blog.excerpt || (blog.description ? blog.description.replace(/<[^>]*>/g, '') : ''));
            
            // Set keywords
            if (blog.keywords) {
                setMetaTag('keywords', null, blog.keywords);
            }
            
            // Set Open Graph tags
            setMetaTag(null, 'og:title', blog.meta_title || blog.title);
            setMetaTag(null, 'og:description', blog.meta_description || blog.excerpt || (blog.description ? blog.description.replace(/<[^>]*>/g, '') : ''));
            setMetaTag(null, 'og:type', 'article');
            
            if (blog.image) {
                setMetaTag(null, 'og:image', blog.image);
            }
            
            // Set Twitter Card tags
            setMetaTag(null, 'twitter:card', 'summary_large_image');
            setMetaTag(null, 'twitter:title', blog.meta_title || blog.title);
            setMetaTag(null, 'twitter:description', blog.meta_description || blog.excerpt || (blog.description ? blog.description.replace(/<[^>]*>/g, '') : ''));
            
            if (blog.image) {
                setMetaTag(null, 'twitter:image', blog.image);
            }
            
            console.log('Meta tags set successfully for:', blog.title);
        }
    }, [blog]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f9f9f9] py-12 px-6 md:px-20">
                <ScrollRestoration />
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-96 bg-gray-300 rounded-lg"></div>
                        <div className="space-y-4">
                            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f9f9f9] py-12 px-6 md:px-20">
                <ScrollRestoration />
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-[#22404B] mb-4">Error</h1>
                    <p className="text-red-500 mb-6">{error}</p>
                    <Link 
                        to="/blog"
                        className="inline-flex items-center gap-2 bg-[#22404B] text-white px-6 py-3 rounded-md hover:bg-[#1a323a] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    if (!blog) {
        return <Navigate to="/blog" replace />;
    }

    const handleShare = async () => {
        const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
        const rawText = blog?.excerpt || blog?.description || '';
        const plainText = rawText
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        const shareData = {
            title: blog?.title || 'Job Dockets Blog',
            text: plainText.substring(0, 120) || 'Check out this blog on Job Dockets.',
            url: shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                if (error?.name !== 'AbortError') {
                    toast.error('Unable to open share dialog.');
                }
            }
            return;
        }

        try {
            await navigator.clipboard.writeText(shareData.url);
            toast.success('Blog link copied to clipboard.');
        } catch {
            toast.error('Unable to copy link. Please copy it manually.');
        }
    };

    return (
        <>

            <div className="min-h-screen bg-[#f9f9f9] py-12 px-6 md:px-20">
                <ScrollRestoration />
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Back Button */}
                <div className="p-6 border-b">
                    <Link 
                        to="/blog"
                        className="inline-flex items-center gap-2 text-[#22404B] hover:text-[#1a323a] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Blog
                    </Link>
                </div>

                {/* Blog Content */}
                <div className="p-6 md:p-8">
                    {/* Blog Image */}
                    <div className="mb-6">
                        <img
                            src={blog.image || imageProvider.blog3}
                            alt={blog.image_alt || blog.title}
                            className="w-full h-64 md:h-96 object-cover rounded-lg"
                            onError={(e) => {
                                e.target.src = imageProvider.blog3;
                            }}
                        />
                    </div>

                    {/* Blog Meta Information */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 text-sm text-gray-600">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{formatDate(blog.published_at || blog.created_at)}</span>
                            </div>
                            {blog.reading_time && (
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{blog.reading_time}</span>
                                </div>
                            )}
                            {blog.publisher_name && (
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-700">Publisher:</span>
                                    <span>{blog.publisher_name}</span>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleShare}
                            className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors self-start sm:self-auto"
                            aria-label="Share this blog post"
                        >
                            <Share2 className="h-4 w-4" />
                            Share
                        </button>
                    </div>

                    {/* Blog Title */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#22404B] mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    {/* Blog Excerpt */}
                    {blog.excerpt && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg break-words">
                            <p className="text-gray-700 italic">{blog.excerpt}</p>
                        </div>
                    )}



                    {/* Blog Content */}
                    <div className="prose prose-lg max-w-none">
                        <div 
                            className="text-gray-700 leading-relaxed break-words blog-content"
                            dangerouslySetInnerHTML={{ __html: blog.long_description || blog.description }}
                        />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default BlogDetails; 
