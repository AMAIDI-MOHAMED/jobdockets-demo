// pages/CourseDetails.jsx
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import ReactPlayer from "react-player";
import { Link, Navigate, ScrollRestoration, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { useSEOByPage } from "@/hooks/useSEO";
import SEOHead from "@/components/SEOHead";
import { Share2 } from "lucide-react";
import toast from "react-hot-toast";
import CourseCard from "@/components/course/CourseCard";
import './CourseDetails.css';

const CourseDetailsSkeleton = () => (
    <div className="px-4 sm:px-8 py-12 max-w-5xl mx-auto bg-white animate-pulse">
        {/* Title */}
        <div className="h-10 w-2/3 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>

        {/* Description */}
        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-4/5 bg-gray-200 rounded mb-6"></div>

        {/* Image */}
        <div className="mb-10">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-md bg-gray-200">
                <div className="absolute top-0 left-0 w-full h-full bg-gray-300 rounded-2xl" />
            </div>
        </div>

        {/* course description */}
        <div className="mb-8">
            <div className="h-6 w-1/4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-1"></div>
        </div>

        {/* course eligibility */}
        <div className="mb-8">
            <div className="h-6 w-1/4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded mb-1"></div>
        </div>

        {/* course requirements */}
        <div className="mb-8">
            <div className="h-6 w-1/4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-1"></div>
        </div>

        {/* Instructor */}
        <div className="mb-8 border rounded-xl p-5 bg-gray-50">
            <div className="h-6 w-1/4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-1"></div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between bg-blue-50 border rounded-xl p-5">
            <div>
                <div className="h-6 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="h-8 w-40 bg-gray-300 rounded"></div>
            </div>
            <div className="h-10 w-32 bg-blue-300 rounded"></div>
        </div>
    </div>
);

const CourseDetails = () => {
    const { courseSlug } = useParams();
    const axiosPublic = useAxiosPublic();

    const { data: courseDetails, isLoading: isCourseDetailsLoading } = useQuery({
        queryKey: ["courseDetails", courseSlug],
        queryFn: async () => {
            const res = await axiosPublic.get(`/courses/details/${courseSlug}`);
            return res?.data?.data;
        },
        enabled: !!courseSlug, // only run if slug exists
    });

    const { seoData } = useSEOByPage('course-details');

    const seoPayload = useMemo(() => {
        const baseTitle = seoData?.meta_title || 'Job Dockets Course';
        const cleanDescription = (courseDetails?.sub_description || courseDetails?.description || '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const description = cleanDescription
            ? `${cleanDescription.substring(0, 152)}${cleanDescription.length > 152 ? '…' : ''}`
            : (seoData?.meta_description || 'Discover free courses on Job Dockets.');

        const slugSegment = courseDetails?.slug || courseDetails?.id;
        const canonical = slugSegment
            ? `https://jobdockets.com/courses/${slugSegment}`
            : undefined;

        return {
            ...seoData,
            meta_title: courseDetails?.title ? `${courseDetails.title} | Job Dockets` : baseTitle,
            meta_description: description,
            canonical_url: canonical ?? seoData?.canonical_url,
        };
    }, [courseDetails, seoData]);

    const hasCopoun = Boolean(courseDetails?.copoun);

    const courseLink = useMemo(() => {
        const baseLink = courseDetails?.link_url;
        if (!baseLink) {
            return "#";
        }
        if (!hasCopoun) {
            return baseLink;
        }
        if (baseLink.includes("couponCode=")) {
            return baseLink;
        }
        const couponValue = courseDetails?.copoun || "KEEPLEARNINGOCTA";
        const separator = baseLink.includes("?") ? "&" : "?";
        return `${baseLink}${separator}couponCode=${encodeURIComponent(couponValue)}`;
    }, [courseDetails?.link_url, courseDetails?.copoun, hasCopoun]);

    if (isCourseDetailsLoading) {
        return <CourseDetailsSkeleton />;
    }

    if (!courseDetails) {
        return <Navigate to="/free-courses" replace />;
    }

    const handleShare = async () => {
        const shareUrl = typeof window !== "undefined" ? window.location.href : "";
        const shareData = {
            title: courseDetails?.title || "Job Dockets Course",
            text: courseDetails?.sub_description?.replace(/<[^>]+>/g, " ").slice(0, 120) || "Check out this free course on Job Dockets.",
            url: shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                if (error?.name !== "AbortError") {
                    toast.error("Unable to open share dialog.");
                }
            }
            return;
        }

        try {
            await navigator.clipboard.writeText(shareData.url);
            toast.success("Course link copied to clipboard.");
        } catch {
            toast.error("Unable to copy link. Please copy it manually.");
        }
    };

    return (
        <div className="px-4 sm:px-8 py-12 max-w-5xl mx-auto bg-white">
            <SEOHead seoData={seoPayload} />
            <ScrollRestoration />
            {/* Title */}
            <nav className="text-sm text-gray-600 mb-3">
                <Link to="/" className="hover:text-blue-600">Home</Link>
                <span className="mx-2">&rsaquo;</span>
                <Link to="/free-courses" className="hover:text-blue-600">Courses</Link>
                {courseDetails?.category_group && (
                    <>
                        <span className="mx-2">&rsaquo;</span>
                        <Link to={`/courses/c/${courseDetails.category_group}`} className="hover:text-blue-600">
                            {courseDetails?.category_group_label}
                        </Link>
                    </>
                )}
                <span className="mx-2">&rsaquo;</span>
                <span className="text-gray-800">{courseDetails?.title}</span>
            </nav>

            <h1 className="text-3xl font-bold mb-2">
                {seoData?.h1_tags || courseDetails?.title}
            </h1>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <p className="text-sm text-gray-600">
                    Instructor: {courseDetails?.instructor_name || 'N/A'} &bull; Language: {courseDetails?.language || 'N/A'}
                </p>
                <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors self-start sm:self-auto"
                    aria-label="Share this course"
                >
                    <Share2 className="h-4 w-4" />
                    Share
                </button>
            </div>

            {/* Categories & Subcategories */}
            <div className="mb-6">
                {!!(courseDetails?.categories?.length) && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {courseDetails.categories.map(cat => {
                            const catSlug = cat.slug || cat.id;
                            return (
                                <Link
                                    key={cat.id}
                                    to={`/courses/c/${catSlug}`}
                                    className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                                >
                                    {cat.name}
                                </Link>
                            );
                        })}
                    </div>
                )}
                {!!(courseDetails?.subcategories?.length) && (
                    <div className="flex flex-wrap gap-2">
                        {courseDetails.subcategories.map(sub => {
                            const subSlug = sub.slug || sub.id;
                            const parentSlug = courseDetails?.category_group || courseDetails?.categories?.[0]?.slug || courseDetails?.categories?.[0]?.id;
                            const subLink = parentSlug
                                ? `/courses/c/${parentSlug}/${subSlug}`
                                : "/free-courses";
                            return (
                                <Link
                                    key={sub.id}
                                    to={subLink}
                                    className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                                >
                                    {sub.name}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Description */}
            <div className="text-base text-gray-700 leading-relaxed mb-6 prose max-w-none blog-content"
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(courseDetails?.sub_description || '')
                }}
            >
            </div>

            <div className="mb-10">
                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-md">
                    <img src={courseDetails?.image} alt={courseDetails?.title} className="absolute border rounded-2xl shadow-md top-0 left-0 w-full h-full object-cover" />
                </div>
            </div>

            {/* course description */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Description</h2>

                <div className="prose max-w-none blog-content"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(courseDetails?.description || '')
                    }}
                />
            </div>

            {/* course eligibility */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Course Eligibility</h2>

                <div className="prose max-w-none blog-content"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(courseDetails?.course_eligibility || '')
                    }}
                ></div>
            </div>

            {/* course requirements */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Course Requirements</h2>

                <div className="prose max-w-none blog-content"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(courseDetails?.requirements || '', {
                            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span'],
                            ALLOWED_ATTR: ['class', 'style']
                        })
                    }}
                ></div>
            </div>

            {/* Instructor */}
            {/* <div className="mb-8 border rounded-xl p-5 bg-gray-50">
                <h2 className="text-xl font-semibold mb-2">Instructor</h2>
                <p className="text-gray-800 font-medium">{courseDetails?.instructor_name}</p>
                <p className="text-sm text-gray-600 mb-4">
                    Instructor: {courseDetails?.instructor_name} &bull; Language: {courseDetails?.language}
                </p>
            </div> */}



            {/* CTA */}
            <div className="flex items-center justify-between bg-blue-50 border rounded-xl p-5">
                <div>
                    {/* <p className="text-xl font-bold  line-through">Price: ${courseDetails?.original_price}</p> */}
                    <p className="text-3xl text-blue-700 font-bold">    
                        Price: Free
                    </p>
                </div>
                <Link to={courseLink} target="_blank" rel="noreferrer">

                    <button
                        className={`${hasCopoun ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-2 rounded-md transition cursor-pointer`}
                    >
                        {hasCopoun ? 'Learn for Free' : 'Enroll Now'}
                    </button>
                </Link>
            </div>

            {/* Related Courses */}
            <RelatedCourses currentId={courseDetails?.id} currentCategories={courseDetails?.categories} />
        </div>
    );
};

// Related Courses section component
const RelatedCourses = ({ currentId, currentCategories }) => {
    const axiosPublic = useAxiosPublic();

    const { data: allCourses, isLoading } = useQuery({
        queryKey: ["allCoursesForRelated"],
        queryFn: async () => {
            const res = await axiosPublic.get(`/courses`, {
                params: {
                    per_page: 60,
                    sort_by: "created_at",
                    sort_direction: "desc",
                },
            });
            return res?.data?.data?.courses || [];
        }
    });

    if (isLoading) return null;

    const currentCategoryIds = new Set((currentCategories || []).map(c => String(c.id)));
    const related = (allCourses || [])
        .filter(c => String(c.id) !== String(currentId))
        .filter(c => (c.categories || []).some(cat => currentCategoryIds.has(String(cat.id))))
        .slice(0, 8);

    if (!related.length) return null;

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Related Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {related.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default CourseDetails;
