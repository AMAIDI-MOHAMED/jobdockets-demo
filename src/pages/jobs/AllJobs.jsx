// pages/AllJobs.jsx
import JobCard from "@/components/jobs/JobCard";
import JobSkaleton from "@/components/jobs/JobSkaleton";
import SEOHead from "@/components/SEOHead";
import { JOB_LOCATIONS, getLocationBySlug, slugifyLocationLabel } from "@/constants/jobLocations";
import { useSEO } from "@/hooks/useSEO";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { ScrollRestoration, useNavigate, useParams } from "react-router-dom";
import { Search } from "lucide-react";

const JOBS_PER_PAGE = 12;

const formatCategoryName = (value = "") => {
    return value
        .split("-")
        .filter(Boolean)
        .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");
};

const AllJobs = () => {
    const { categorySlug, locationSlug } = useParams();
    const [selectedCategoryId, setSelectedCategoryId] = useState(categorySlug || "");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const { seoData } = useSEO('jobs');
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const filterMode = useMemo(() => {
        if (categorySlug && locationSlug) return "category-location";
        if (categorySlug) return "category";
        if (locationSlug) return "location";
        return null;
    }, [categorySlug, locationSlug]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm.trim());
        }, 400);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const locationDetails = useMemo(() => {
        if (!locationSlug) return null;
        return getLocationBySlug(locationSlug);
    }, [locationSlug]);

    useEffect(() => {
        if (categorySlug) {
            setSelectedCategoryId(categorySlug);
        } else if (filterMode === "category" || filterMode === "category-location") {
            setSelectedCategoryId("");
        }
    }, [categorySlug, filterMode]);

    useEffect(() => {
        if (locationDetails?.label) {
            setSelectedLocation(locationDetails.label);
        } else if (!locationSlug) {
            setSelectedLocation("");
        }
    }, [locationSlug, locationDetails?.label]);

    const { data: jobCategories = [] } = useQuery({
        queryKey: ["job-post-categories"],
        queryFn: async () => {
            const res = await axiosPublic.get("/job-post-categories");
            return res?.data?.data || [];
        }
    });

    const categoryDetails = useMemo(() => {
        if (!categorySlug) return null;
        return jobCategories.find((category) => category.value === categorySlug) || null;
    }, [categorySlug, jobCategories]);

    // Build category and location options
    const categoryOptions = useMemo(() => {
        return [
            { value: "", label: "All Jobs" },
            ...jobCategories.map((category) => ({
                value: category.value,
                label: category.label,
            }))
        ];
    }, [jobCategories]);

    const locationOptions = useMemo(() => JOB_LOCATIONS.map((loc) => loc.label), []);

    const fetchJobs = useCallback(async ({ pageParam = 1 }) => {
        const params = {
            page: pageParam,
            per_page: JOBS_PER_PAGE,
            sort_by: "created_at",
            sort_direction: "desc",
        };

        if (selectedCategoryId) {
            params.category = selectedCategoryId;
        }

        const effectiveLocationSlug = selectedLocation
            ? slugifyLocationLabel(selectedLocation)
            : (locationSlug || "");

        if (effectiveLocationSlug) {
            params.location = effectiveLocationSlug;
        }

        if (debouncedSearch) {
            params.search = debouncedSearch;
        }

        const res = await axiosPublic.get("/job-posts", { params });
        const payload = res?.data?.data || {};

        return {
            jobs: payload.jobs || [],
            pagination: payload.pagination || {},
        };
    }, [axiosPublic, selectedCategoryId, selectedLocation, locationSlug, debouncedSearch]);

    const {
        data: pagedJobsData,
        isLoading: isJobsLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["all-jobs", selectedCategoryId, selectedLocation, locationSlug, debouncedSearch],
        queryFn: ({ pageParam = 1 }) => fetchJobs({ pageParam }),
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

    const jobsList = useMemo(() => {
        if (!pagedJobsData?.pages?.length) {
            return [];
        }
        return pagedJobsData.pages.flatMap((page) => page?.jobs || []);
    }, [pagedJobsData]);

    const primaryPagination = pagedJobsData?.pages?.[0]?.pagination;
    const resultCount = primaryPagination?.total || 0;
    const isLoadingJobs = isJobsLoading && !pagedJobsData?.pages?.length;

    const navigateWithFilters = useCallback((categoryValue, locationValue) => {
        if (categoryValue && locationValue) {
            navigate(`/jobs/c/${categoryValue}/l/${locationValue}`);
            return;
        }
        if (categoryValue) {
            navigate(`/jobs/c/${categoryValue}`);
            return;
        }
        if (locationValue) {
            navigate(`/jobs/l/${locationValue}`);
            return;
        }
        navigate("/jobs");
    }, [navigate]);

    const handleCategoryRouteChange = (value) => {
        setSelectedCategoryId(value);
        const activeLocationSlug = locationSlug || (selectedLocation ? slugifyLocationLabel(selectedLocation) : "");
        navigateWithFilters(value || null, activeLocationSlug || null);
    };

    const handleLocationRouteChange = (value) => {
        const newLocationSlug = value ? slugifyLocationLabel(value) : "";
        const activeCategorySlug = categorySlug || (selectedCategoryId || "");
        navigateWithFilters(activeCategorySlug || null, newLocationSlug || null);
    };

    const handleCategoryChange = (value) => {
        handleCategoryRouteChange(value);
    };

    const handleLocationChange = (value) => {
        setSelectedLocation(value);
        handleLocationRouteChange(value);
    };

    const locationSeo = useMemo(() => {
        if (!locationDetails) return null;
        const locationName = locationDetails.label;
        const canonicalUrl = `https://jobdockets.com/jobs/l/${locationDetails.slug}`;
        const description = `Browse curated ${locationName} job vacancies and apply directly to hiring managers through Job Dockets.`;

        return {
            ...seoData,
            meta_title: `Jobs in ${locationName} | Job Dockets`,
            meta_description: description,
            og_title: `Jobs in ${locationName} | Job Dockets`,
            og_description: description,
            og_url: canonicalUrl,
            canonical_url: canonicalUrl,
            twitter_title: `Jobs in ${locationName} | Job Dockets`,
            twitter_description: description,
        };
    }, [locationDetails, seoData]);

    const categorySeo = useMemo(() => {
        if (!categorySlug) return null;
        const categoryName = categoryDetails?.label || formatCategoryName(categorySlug);
        if (!categoryName) return null;

        const canonicalUrl = `https://jobdockets.com/jobs/c/${categorySlug}`;
        const description = `Explore curated ${categoryName} job vacancies across Nigeria on Job Dockets.`;

        return {
            ...seoData,
            meta_title: `${categoryName} Jobs in Nigeria | Job Dockets`,
            meta_description: description,
            og_title: `${categoryName} Jobs in Nigeria | Job Dockets`,
            og_description: description,
            og_url: canonicalUrl,
            canonical_url: canonicalUrl,
            twitter_title: `${categoryName} Jobs in Nigeria | Job Dockets`,
            twitter_description: description,
        };
    }, [categorySlug, categoryDetails, seoData]);

    const combinedSeo = useMemo(() => {
        if (!categorySlug || !locationDetails) return null;
        const categoryName = categoryDetails?.label || formatCategoryName(categorySlug);
        if (!categoryName) return null;

        const locationName = locationDetails.label;
        const canonicalUrl = `https://jobdockets.com/jobs/c/${categorySlug}/l/${locationDetails.slug}`;
        const description = `Find ${categoryName} opportunities in ${locationName} and connect directly with decision-makers via Job Dockets.`;

        return {
            ...seoData,
            meta_title: `${categoryName} Jobs in ${locationName} | Job Dockets`,
            meta_description: description,
            og_title: `${categoryName} Jobs in ${locationName} | Job Dockets`,
            og_description: description,
            og_url: canonicalUrl,
            canonical_url: canonicalUrl,
            twitter_title: `${categoryName} Jobs in ${locationName} | Job Dockets`,
            twitter_description: description,
        };
    }, [categorySlug, categoryDetails, locationDetails, seoData]);

    const seoForPage = combinedSeo || locationSeo || categorySeo || seoData;

    const defaultHeading = seoData?.h1_tags || "Find Job vacancies in Nigeria – Remote, Online & On-Site";
    const defaultSubheading = "Connect directly with HR and employers for the latest job vacancies and career opportunities in Nigeria. Skip job boards. Get direct access.";

    let pageHeading = defaultHeading;
    let pageSubheading = defaultSubheading;

    if (categorySlug && locationDetails) {
        const categoryName = categoryDetails?.label || formatCategoryName(categorySlug);
        pageHeading = `Find ${categoryName} jobs in ${locationDetails.label} – Remote, Online & On-Site`;
        pageSubheading = `Connect directly with ${locationDetails.label} recruiters hiring for ${categoryName} roles.`;
    } else if (categorySlug) {
        const categoryName = categoryDetails?.label || formatCategoryName(categorySlug);
        pageHeading = `Find ${categoryName} job vacancies – Remote, Online & On-Site`;
        pageSubheading = `Connect directly with hiring teams for the best ${categoryName} opportunities in Nigeria.`;
    } else if (locationDetails) {
        pageHeading = `Find ${locationDetails.label} job vacancies – Remote, Online & On-Site`;
        pageSubheading = `Connect directly with ${locationDetails.label} recruiters and employers for the latest openings.`;
    }

    return (
        <div className="px-4 sm:px-8 py-12 bg-white">
            <SEOHead seoData={seoForPage} />
            <ScrollRestoration />
            <h1 className="text-2xl font-bold mb-6 text-center">
                {pageHeading}
            </h1>
            <h2 className="text-lg text-gray-600 mb-6 text-center max-w-4xl mx-auto">
                {pageSubheading}
            </h2>

            <div className="max-w-5xl mx-auto mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by job title, company, or keywords"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                {debouncedSearch && (
                    <p className="text-sm text-gray-500 mt-2 text-center sm:text-left">
                        Found {resultCount} job{resultCount === 1 ? '' : 's'} for "{debouncedSearch}"
                    </p>
                )}
            </div>

            {/* Filters */}
            <div className="max-w-5xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                    value={selectedCategoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {categoryOptions.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                </select>

                <select
                    value={selectedLocation}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">All Locations</option>
                    {locationOptions.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>

            {isLoadingJobs ? (
                <div className="grid md:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <JobSkaleton key={idx} />
                    ))}
                </div>
            ) : (
                <>
                    {jobsList.length === 0 ? (
                        <div className="text-center text-gray-600">No jobs found.</div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-3 gap-6">
                                {jobsList.map(job => (
                                    <JobCard job={job} key={job.id} />
                                ))}
                            </div>
                            {hasNextPage && (
                                <div className="text-center mt-10">
                                    <button
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                        className="px-6 py-3 bg-[#03a9f4] text-white font-semibold rounded-lg hover:bg-[#0288d1] disabled:opacity-60"
                                    >
                                        {isFetchingNextPage ? "Loading..." : "Load More"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {!isLoadingJobs && debouncedSearch && resultCount === 0 && (
                <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Search className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No jobs found</h3>
                        <p className="text-gray-600 mb-4">
                            No jobs match your search for "{debouncedSearch}"
                        </p>
                        <button
                            onClick={() => setSearchTerm("")}
                            className="text-[#03a9f4] hover:text-[#0288d1] font-medium"
                        >
                            Clear search
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllJobs;
