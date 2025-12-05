import React, { useMemo } from "react";
import { Link, ScrollRestoration, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import CourseCard from "@/components/course/CourseCard";
import CourseCardSkaleton from "@/components/course/CourseCardSkaleton";
import { useSEO } from "@/hooks/useSEO";
import SEOHead from "@/components/SEOHead";

const CourseCategory = () => {
    const { categorySlug } = useParams();
    const axiosPublic = useAxiosPublic();
    const { seoData } = useSEO('courses');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['course-category', categorySlug],
        queryFn: async () => {
            const res = await axiosPublic.get(`/courses/category/${categorySlug}`);
            return res?.data?.data;
        },
        enabled: !!categorySlug,
        retry: false,
    });

    const categoryLabel = data?.category?.label || 'Courses';
    const courses = data?.courses || [];

    const pageTitle = useMemo(() => {
        const base = seoData?.meta_title || 'Job Dockets Courses';
        return `${categoryLabel} | ${base}`;
    }, [categoryLabel, seoData?.meta_title]);

    const metaDescription = useMemo(() => {
        const base = seoData?.meta_description || 'Discover curated free courses on Job Dockets.';
        return `${categoryLabel} courses on Job Dockets. ${base}`;
    }, [categoryLabel, seoData?.meta_description]);

    const seoPayload = useMemo(() => ({
        ...seoData,
        meta_title: pageTitle,
        meta_description: metaDescription,
        canonical_url: `https://jobdockets.com/courses/c/${categorySlug}`,
    }), [seoData, pageTitle, metaDescription, categorySlug]);

    return (
        <div className="px-4 sm:px-8 py-12 bg-gradient-to-t from-[#09B1FE] to-[#433DCA] min-h-screen">
            <SEOHead seoData={seoPayload} />
            <ScrollRestoration />

            <nav className="text-sm text-white/80 mb-6 text-center">
                <Link to="/" className="hover:text-white">Home</Link>
                <span className="mx-2">&rsaquo;</span>
                <Link to="/free-courses" className="hover:text-white">Courses</Link>
                <span className="mx-2">&rsaquo;</span>
                <span className="text-white font-semibold">{categoryLabel}</span>
            </nav>

            <header className="max-w-4xl mx-auto text-center text-white mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                    {categoryLabel} Courses
                </h1>
                <p className="text-white/90">
                    Explore verified 100% free Udemy coupons curated for {categoryLabel.toLowerCase()} learners.
                </p>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <CourseCardSkaleton key={idx} />
                    ))}
                </div>
            ) : isError ? (
                <div className="text-center text-white/90">
                    We could not find this course category. <Link className="underline" to="/free-courses">Browse all courses</Link>.
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center text-white/90">
                    No courses found in this category yet. <Link className="underline" to="/free-courses">Browse all courses</Link>.
                </div>
            ) : (
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseCategory;
