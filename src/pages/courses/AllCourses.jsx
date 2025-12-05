// pages/AllCourses.jsx
import CourseCard from "@/components/course/CourseCard";
import CourseCardSkaleton from "@/components/course/CourseCardSkaleton";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ScrollRestoration, useNavigate, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import SEOHead from "@/components/SEOHead";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const DEFAULT_COURSES_PATH = "/free-courses";
const COURSES_PER_PAGE = 12;

const AllCourses = () => {
    const { categorySlug, subcategorySlug } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
    const { seoData } = useSEO('courses');
    const axiosPublic = useAxiosPublic();

    const filterMode = useMemo(() => {
        if (categorySlug && subcategorySlug) return "category-subcategory";
        if (categorySlug) return "category";
        if (subcategorySlug) return "subcategory";
        return null;
    }, [categorySlug, subcategorySlug]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm.trim());
        }, 400);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data: categoryTree = [] } = useQuery({
        queryKey: ["course-categories"],
        queryFn: async () => {
            const res = await axiosPublic.get("/course-categories");
            return res?.data?.data || [];
        }
    });

    const findCategoryForSubcategory = useCallback((subSlug) => {
        if (!subSlug) return null;
        for (const category of categoryTree) {
            if (category?.subcategories?.some((sub) => sub.value === subSlug)) {
                return category;
            }
        }
        return null;
    }, [categoryTree]);

    useEffect(() => {
        if (categorySlug) {
            setSelectedCategoryId(categorySlug);
            return;
        }

        if (subcategorySlug) {
            const parentCategory = findCategoryForSubcategory(subcategorySlug);
            if (parentCategory) {
                setSelectedCategoryId(parentCategory.value);
                return;
            }
        }

        if (!filterMode) {
            setSelectedCategoryId("");
        }
    }, [categorySlug, subcategorySlug, filterMode, findCategoryForSubcategory]);

    useEffect(() => {
        if (subcategorySlug) {
            setSelectedSubcategoryId(subcategorySlug);
        } else if (!filterMode || filterMode === "category") {
            setSelectedSubcategoryId("");
        }
    }, [subcategorySlug, filterMode]);

    const categoryOptions = useMemo(() => {
        const options = categoryTree.map(category => ({
            value: category.value,
            label: category.label,
        }));
        return [
            { value: "", label: "All Courses" },
            ...options
        ];
    }, [categoryTree]);

    const subcategoryOptions = useMemo(() => {
        if (!selectedCategoryId) {
            return [{ value: "", label: "All Subcategories" }];
        }
        const category = categoryTree.find(item => item.value === selectedCategoryId);
        if (!category) {
            return [{ value: "", label: "All Subcategories" }];
        }
        return [
            { value: "", label: "All Subcategories" },
            ...(category.subcategories || []).map(sub => ({
                value: sub.value,
                label: sub.label,
            }))
        ];
    }, [categoryTree, selectedCategoryId]);

    const fetchCourses = useCallback(async ({ pageParam = 1 }) => {
        const params = {
            page: pageParam,
            per_page: COURSES_PER_PAGE,
            sort_by: "created_at",
            sort_direction: "desc",
        };

        if (debouncedSearch) {
            params.search = debouncedSearch;
        }

        if (selectedCategoryId) {
            params.category = selectedCategoryId;
        }

        if (selectedSubcategoryId) {
            params.subcategory = selectedSubcategoryId;
        }

        const res = await axiosPublic.get("/courses", { params });
        const payload = res?.data?.data || {};

        return {
            courses: payload.courses || [],
            pagination: payload.pagination || {},
        };
    }, [axiosPublic, debouncedSearch, selectedCategoryId, selectedSubcategoryId]);

    const {
        data: pagedCoursesData,
        isLoading: isCoursesLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["all-courses", selectedCategoryId, selectedSubcategoryId, debouncedSearch],
        queryFn: ({ pageParam = 1 }) => fetchCourses({ pageParam }),
        getNextPageParam: (lastPage) => {
            const pagination = lastPage?.pagination;
            if (pagination?.has_more) {
                const nextPage = (pagination?.current_page || 1) + 1;
                if (nextPage <= (pagination?.last_page || 1)) {
                    return nextPage;
                }
            }
            return undefined;
        },
    });

    const coursesList = useMemo(() => {
        if (!pagedCoursesData?.pages?.length) {
            return [];
        }
        return pagedCoursesData.pages.flatMap((page) => page?.courses || []);
    }, [pagedCoursesData]);

    const primaryPagination = pagedCoursesData?.pages?.[0]?.pagination;
    const resultCount = primaryPagination?.total || 0;
    const isLoadingCourses = isCoursesLoading && !pagedCoursesData?.pages?.length;

    const resolvedCategory = useMemo(() => {
        if (categorySlug && categoryTree.length) {
            return categoryTree.find((category) => category.value === categorySlug) || null;
        }
        if (subcategorySlug) {
            return findCategoryForSubcategory(subcategorySlug);
        }
        return null;
    }, [categorySlug, categoryTree, subcategorySlug, findCategoryForSubcategory]);

    const resolvedSubcategory = useMemo(() => {
        if (subcategorySlug && categoryTree.length) {
            const parent = findCategoryForSubcategory(subcategorySlug);
            const match = parent?.subcategories?.find((sub) => sub.value === subcategorySlug);
            return match || null;
        }
        return null;
    }, [subcategorySlug, categoryTree, findCategoryForSubcategory]);

    const handleCategorySelect = (value) => {
        setSelectedCategoryId(value);
        setSelectedSubcategoryId("");

        if (!value) {
            navigate(DEFAULT_COURSES_PATH);
            return;
        }

        navigate(`/courses/c/${value}`);
    };

    const handleSubcategorySelect = (value) => {
        setSelectedSubcategoryId(value);

        if (!value) {
            if (selectedCategoryId) {
                navigate(`/courses/c/${selectedCategoryId}`);
            } else {
                navigate(DEFAULT_COURSES_PATH);
            }
            return;
        }

        const parentCategory = selectedCategoryId || findCategoryForSubcategory(value)?.value;

        if (parentCategory) {
            if (!selectedCategoryId) {
                setSelectedCategoryId(parentCategory);
            }
            navigate(`/courses/c/${parentCategory}/${value}`);
        } else {
            navigate(DEFAULT_COURSES_PATH);
        }
    };

    const defaultHeading = seoData?.h1_tags || "Explore All Courses";
    const defaultSubheading = "Your ultimate hub for free Udemy courses. Learn high-value skills with 100% off coupon codes.";

    let heading = defaultHeading;
    let subheading = defaultSubheading;

    if (resolvedCategory && resolvedSubcategory) {
        heading = `Free ${resolvedSubcategory.label} Courses`;
        subheading = `Unlock 100% off coupons for ${resolvedSubcategory.label} inside ${resolvedCategory.label}.`;
    } else if (resolvedCategory) {
        heading = `Free ${resolvedCategory.label} Courses`;
        subheading = `Explore curated ${resolvedCategory.label} Udemy coupons.`;
    }

    const seoPayload = useMemo(() => {
        if (resolvedCategory && resolvedSubcategory) {
            const canonicalUrl = `https://jobdockets.com/courses/c/${resolvedCategory.value}/${resolvedSubcategory.value}`;
            const description = `Access handpicked ${resolvedSubcategory.label} courses (${resolvedCategory.label}) with 100% free Udemy coupons.`;
            return {
                ...seoData,
                meta_title: `${resolvedSubcategory.label} Courses | Job Dockets`,
                meta_description: description,
                og_title: `${resolvedSubcategory.label} Courses | Job Dockets`,
                og_description: description,
                og_url: canonicalUrl,
                canonical_url: canonicalUrl,
                twitter_title: `${resolvedSubcategory.label} Courses | Job Dockets`,
                twitter_description: description,
            };
        }

        if (resolvedCategory) {
            const canonicalUrl = `https://jobdockets.com/courses/c/${resolvedCategory.value}`;
            const description = `Browse curated ${resolvedCategory.label} courses with verified Udemy coupons from Job Dockets.`;
            return {
                ...seoData,
                meta_title: `${resolvedCategory.label} Courses | Job Dockets`,
                meta_description: description,
                og_title: `${resolvedCategory.label} Courses | Job Dockets`,
                og_description: description,
                og_url: canonicalUrl,
                canonical_url: canonicalUrl,
                twitter_title: `${resolvedCategory.label} Courses | Job Dockets`,
                twitter_description: description,
            };
        }

        return seoData;
    }, [seoData, resolvedCategory, resolvedSubcategory]);

    return (
        <div className="min-h-screen bg-gradient-to-t from-[#09B1FE] to-[#433DCA]">
            <SEOHead seoData={seoPayload} />
            <ScrollRestoration />

            <section className="bg-transparent py-5 px-4 sm:px-8 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                        {heading}
                    </h1>
                    <h2 className="text-lg sm:text-xl text-white/90 mb-2 max-w-3xl mx-auto">
                        {subheading}
                    </h2>
                </div>
            </section>

            <div className="px-4 sm:px-8 py-3">
                <div className="max-w-5xl mx-auto mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder=""
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="placeholder:text-white text-white w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    {debouncedSearch && (
                        <p className="text-sm text-gray-200 mt-2 text-center">
                            Found {resultCount} course{resultCount === 1 ? '' : 's'} for "{debouncedSearch}"
                        </p>
                    )}
                </div>

                <div className="max-w-5xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => handleCategorySelect(e.target.value)}
                        className="w-full px-4 py-3 border border-white/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    >
                        {categoryOptions.map(cat => (
                            <option key={cat.value} value={cat.value} className="text-black">
                                {cat.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedSubcategoryId}
                        onChange={(e) => handleSubcategorySelect(e.target.value)}
                        className="w-full px-4 py-3 border border-white/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent disabled:opacity-60"
                        disabled={selectedCategoryId === "" || subcategoryOptions.length <= 1}
                    >
                        {subcategoryOptions.map(sub => (
                            <option key={sub.value} value={sub.value} className="text-black">
                                {sub.label}
                            </option>
                        ))}
                    </select>
                </div>

                {isLoadingCourses ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {Array.from({ length: 10 }).map((_, idx) => (
                            <CourseCardSkaleton key={idx} />
                        ))}
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto">
                        {coursesList.length === 0 ? (
                            <div className="text-white/90 text-center py-8">No courses found.</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                                    {coursesList.map(course => (
                                        <CourseCard course={course} key={course.id} />
                                    ))}
                                </div>
                                {hasNextPage && (
                                    <div className="text-center mt-10">
                                        <button
                                            onClick={() => fetchNextPage()}
                                            disabled={isFetchingNextPage}
                                            className="px-6 py-3 bg-white/90 text-blue-600 font-semibold rounded-lg hover:bg-white disabled:opacity-60"
                                        >
                                            {isFetchingNextPage ? "Loading..." : "Load More"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {!isLoadingCourses && debouncedSearch && resultCount === 0 && (
                    <div className="text-center py-12">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Search className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No courses found</h3>
                            <p className="text-gray-600 mb-4">
                                No courses match your search for "{searchTerm}"
                            </p>
                            <button
                                onClick={() => setSearchTerm("")}
                                className="text-blue-500 hover:text-blue-600 font-medium"
                            >
                                Clear search
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllCourses;
