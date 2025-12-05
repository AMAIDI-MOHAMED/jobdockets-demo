import React, { useMemo, useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { CommonPageWrapper } from "@/lib/CommonPageWrapper";
import CurrencyRateList from "@/components/CurrencyRateList";
import Converter from "@/components/Converter";
import InvoiceGenerator from "@/components/InvoiceGenerator";
import CourseBanner from "@/components/course/CourseBanner";
import JobBanner from "@/components/jobs/JobBanner";
import { useCMS } from "@/hooks/useCMS";
import DOMPurify from 'dompurify';
import CourseCard from "@/components/course/CourseCard";
import { useCourse } from "@/hooks/useCourse";
import CourseCardSkaleton from "@/components/course/CourseCardSkaleton";
import { useInternship } from "@/hooks/useInternship";
import JobCard from "@/components/jobs/JobCard";
import JobSkaleton from "@/components/jobs/JobSkaleton";
import { useSEO } from "@/hooks/useSEO";
import SEOHead from "@/components/SEOHead";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import toast from "react-hot-toast";

const DEFAULT_HOME_SEO = {
    meta_title: "Job Dockets | Nigerian Jobs, Free Courses & Rates",
    meta_description: "Explore vetted Nigerian job opportunities, free Udemy coupons, live exchange rates, a currency converter, and invoice tools on Job Dockets.",
    meta_keywords: "Nigerian jobs, free courses, exchange rates, currency converter, invoice generator, Job Dockets",
    og_title: "Job Dockets | Nigerian Jobs, Free Courses & Rates",
    og_description: "Job Dockets curates Nigerian jobs, 100% free Udemy coupons, live fintech rates, a converter, and an invoice generator built for freelancers.",
    og_url: "https://jobdockets.com/",
    og_type: "website",
    twitter_card: "summary_large_image",
    twitter_title: "Job Dockets | Nigerian Jobs, Free Courses & Rates",
    twitter_description: "Find Nigerian jobs, free Udemy courses, real-time exchange rates, converter tools, and invoice software all in one place.",
    canonical_url: "https://jobdockets.com/",
    structured_data: {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Job Dockets",
        "url": "https://jobdockets.com/",
        "logo": "https://jobdockets.com/logo.png",
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "email": "admin@jobdockets.com",
                "contactType": "customer support",
                "areaServed": "NG"
            }
        ]
    }
};

const Home = () => {
    const { internships, isInternshipsLoading } = useInternship();
    const { InternshipSectionText, InternshipSectionTextLoading, RateSectionText, RateSectionTextLoading, RateSectionInfoCard, RateSectionInfoCardLoading } = useCMS();
    const { courses, isCoursesLoading } = useCourse();
    const { seoData } = useSEO('home');
    const axiosPublic = useAxiosPublic();
    const [showFullForm, setShowFullForm] = useState(false);
    const [emailStepValue, setEmailStepValue] = useState("");
    const [emailStepError, setEmailStepError] = useState("");
    const [submissionSuccess, setSubmissionSuccess] = useState("");
    const emailStepInputRef = useRef(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            lookingFor: [],
            specificPreferences: ""
        }
    });

    const subscriptionOptions = [
        { value: "jobs", label: "Jobs in [industry]" },
        { value: "courses", label: "Free courses in [skill]" },
        { value: "interns", label: "Interns for my business" },
        { value: "freelancers", label: "Freelancers for projects" },
        { value: "all", label: "All opportunities" }
    ];
    const watchEmail = watch("email");

    useEffect(() => {
        if (showFullForm && emailStepValue) {
            setValue("email", emailStepValue, { shouldValidate: false });
        }
    }, [showFullForm, emailStepValue, setValue]);

    useEffect(() => {
        if (showFullForm && watchEmail !== undefined) {
            setEmailStepValue(watchEmail || "");
        }
    }, [showFullForm, watchEmail]);

    const handleEmailStepSubmit = (event) => {
        event.preventDefault();
        const trimmed = emailStepValue.trim();
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!trimmed) {
            setEmailStepError("Please enter your email address.");
            return;
        }

        if (!emailRegex.test(trimmed)) {
            setEmailStepError("Please enter a valid email address.");
            return;
        }

        setEmailStepError("");
        setValue("email", trimmed, { shouldValidate: false });
        setSubmissionSuccess("");
        setShowFullForm(true);
    };

    const handleRestartEmailStep = () => {
        setShowFullForm(false);
        setEmailStepError("");
        setValue("email", "", { shouldValidate: false });
        setSubmissionSuccess("");
        setTimeout(() => {
            if (emailStepInputRef.current) {
                emailStepInputRef.current.focus();
            }
        }, 200);
    };

    const handleCheckboxToggle = (optionValue, currentValue = [], onChange) => {
        const baseSelections = subscriptionOptions
            .filter(option => option.value !== "all")
            .map(option => option.value);

        const isSelected = currentValue.includes(optionValue);
        let updatedSelections = Array.isArray(currentValue) ? [...currentValue] : [];

        if (optionValue === "all") {
            updatedSelections = isSelected ? [] : subscriptionOptions.map(option => option.value);
        } else {
            if (isSelected) {
                updatedSelections = updatedSelections.filter(value => value !== optionValue);
            } else {
                updatedSelections.push(optionValue);
            }

            const hasAllBaseSelections = baseSelections.every(value => updatedSelections.includes(value));
            if (hasAllBaseSelections) {
                updatedSelections = Array.from(new Set([...updatedSelections, "all"]));
            } else {
                updatedSelections = updatedSelections.filter(value => value !== "all");
            }
        }

        onChange(updatedSelections);
    };

    const onSubmitSubscription = async (values) => {
        const normalizedPayload = {
            ...values,
            lookingFor: Array.isArray(values.lookingFor)
                ? values.lookingFor
                : values.lookingFor
                ? [values.lookingFor]
                : []
        };
        const toastId = toast.loading("Submitting your request...");
        try {
            await axiosPublic.post("/subscription", normalizedPayload);
            toast.success("Thanks! We will share new opportunities soon.", { id: toastId });
            reset();
            setShowFullForm(false);
            setEmailStepValue("");
            setSubmissionSuccess("Your request has been received. We'll send opportunities to your inbox soon.");
            setValue("email", "", { shouldValidate: false });
            setTimeout(() => {
                if (emailStepInputRef.current) {
                    emailStepInputRef.current.focus();
                }
            }, 300);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to submit your request.", { id: toastId });
        }
    };

    const seoPayload = useMemo(() => {
        if (!seoData) {
            return DEFAULT_HOME_SEO;
        }
        return {
            ...DEFAULT_HOME_SEO,
            ...seoData,
            structured_data: seoData.structured_data ?? DEFAULT_HOME_SEO.structured_data
        };
    }, [seoData]);

    return (
        <div className="min-h-screen">
            <SEOHead seoData={seoPayload} />
            
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-[#03a9f4] to-[#0288d1] py-16 px-4 sm:px-8 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                        {seoData?.h1_tags || "Nigerian Jobs, Free Udemy Courses, Invoice App & Rates"}
                    </h1>
                    <h2 className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                        Discover verified job opportunities across Nigeria, access free Udemy courses with 100% coupons, track live fintech and currency rates, use our simple currency converter, and manage invoices.
                    </h2>
                </div>
            </section>

            {/* Email Subscription Section */}
            <section className="bg-blue-50 py-12 px-4 sm:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-3xl font-bold text-[#1976d2] mb-4">Get the right opportunities sent to you
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
                    Share what you’re looking for (jobs, free courses, or workers) and get curated opportunities delivered straight to your inbox.
                    
                    </p>
                    {submissionSuccess && (
                        <div className="max-w-3xl mx-auto mb-6 px-4 py-3 rounded-lg border border-green-200 bg-green-50 text-green-800 text-sm">
                            {submissionSuccess}
                        </div>
                    )}
                    {showFullForm ? (
                        <form
                            onSubmit={handleSubmit(onSubmitSubscription)}
                            className="bg-white border border-blue-100 rounded-2xl shadow-sm p-6 sm:p-8 text-left space-y-6 max-w-4xl mx-auto"
                        >
                            <button
                                type="button"
                                onClick={handleRestartEmailStep}
                                className="text-sm font-medium text-[#1976d2] hover:underline"
                            >
                                Change email
                            </button>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03a9f4] focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-300"}`}
                                    disabled={isSubmitting}
                                    {...register("name", {
                                        required: "Please tell us your name."
                                    })}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03a9f4] focus:border-transparent ${errors.email ? "border-red-500" : "border-gray-300"}`}
                                    disabled={isSubmitting}
                                    {...register("email", {
                                        required: "Email is required.",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Please enter a valid email address."
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <Controller
                                control={control}
                                name="lookingFor"
                                rules={{
                                    validate: (value) =>
                                        (Array.isArray(value) && value.length > 0) ||
                                        "Please pick at least one option."
                                }}
                                render={({ field: { value = [], onChange }, fieldState }) => (
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-3">
                                            I’m looking for:
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {subscriptionOptions.map((option) => {
                                                const checked = Array.isArray(value) && value.includes(option.value);
                                                return (
                                                    <label
                                                        key={option.value}
                                                        className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 hover:border-[#03a9f4] transition-colors cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            value={option.value}
                                                            className="mt-1 h-4 w-4 text-[#1976d2] focus:ring-[#03a9f4]"
                                                            checked={checked}
                                                            disabled={isSubmitting}
                                                            onChange={() =>
                                                                handleCheckboxToggle(option.value, value, onChange)
                                                            }
                                                        />
                                                        <span className="text-sm text-gray-700 leading-5">
                                                            {option.label}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        {fieldState.error && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Specific preferences (optional)
                                </label>
                                <textarea
                                    rows="3"
                                    placeholder='e.g., "remote writing jobs" or "web design courses"'
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03a9f4] focus:border-transparent resize-none"
                                    disabled={isSubmitting}
                                    {...register("specificPreferences")}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#1976d2] text-white px-6 py-3 rounded-lg hover:bg-[#1565c0] transition-colors font-semibold"
                                disabled={isSubmitting}
                            >
                                Send me opportunities
                            </button>
                        </form>
                    ) : (
                        <form
                            onSubmit={handleEmailStepSubmit}
                            className="bg-white border border-blue-100 rounded-2xl shadow-sm p-4 sm:p-6 text-left space-y-4 max-w-3xl mx-auto"
                        >
                            <div className="space-y-2">
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <input
                                        ref={emailStepInputRef}
                                        type="email"
                                        id="email-step-input"
                                        value={emailStepValue}
                                        onChange={(event) => setEmailStepValue(event.target.value)}
                                        placeholder="you@example.com"
                                        className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03a9f4] focus:border-transparent ${emailStepError ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    <button
                                        type="submit"
                                        className="w-full sm:w-1/4 min-w-[120px] inline-flex justify-center items-center gap-2 bg-[#1976d2] text-white px-4 py-3 rounded-lg hover:bg-[#1565c0] transition-colors font-semibold"
                                    >
                                        Subscribe
                                    </button>
                                </div>
                                {emailStepError && (
                                    <p className="text-sm text-red-500">{emailStepError}</p>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </section>

            {/* Free Courses Section */}
            <section className="bg-blue-50 py-12 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
                        <div className="mb-4 sm:mb-0">
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1976d2] mb-2">Explore a Wide Range of Free Udemy Courses and Coupons</h2>
                            <h3 className="text-gray-600 max-w-2xl mb-2">Learn New Skills with 100% verified Coupons from Udemy</h3>
                        </div>
                        {/* Desktop View All button */}
                        <Link to="/free-courses" className="hidden sm:block bg-[#03a9f4] text-white px-6 py-3 rounded-lg hover:bg-[#0288d1] transition-colors whitespace-nowrap">
                            View All Courses
                        </Link>
                    </div>
                    
                    {/* Mobile: Show 2 courses vertically, Desktop: Show 4 courses horizontally */}
                    <div className="block sm:hidden">
                        <div className="space-y-4">
                            {isCoursesLoading
                                ? Array.from({ length: 2 }).map((_, idx) => (
                                    <CourseCardSkaleton key={idx} />
                                ))
                                :
                                courses?.slice(0, 2)?.map((course) => (
                                    <CourseCard course={course} key={course.id} />
                                ))}
                        </div>
                        {/* Mobile View All button */}
                        <div className="mt-6 text-center">
                            <Link to="/free-courses" className="bg-[#03a9f4] text-white px-6 py-3 rounded-lg hover:bg-[#0288d1] transition-colors inline-block">
                                View All Courses
                            </Link>
                        </div>
                    </div>

                    {/* Desktop: Horizontal slider */}
                    <div className="hidden sm:block relative">
                        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                            {isCoursesLoading
                                ? Array.from({ length: 4 }).map((_, idx) => (
                                    <CourseCardSkaleton key={idx} />
                                ))
                                :
                                courses?.slice(0, 4)?.map((course) => (
                                    <CourseCard course={course} key={course.id} />
                                ))}
                        </div>
                        {/* Scroll indicator */}
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Vacancies Section */}
            <section className="bg-blue-50 py-12 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
                        <div className="mb-4 sm:mb-0">
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1976d2] mb-2">
                                {InternshipSectionTextLoading ? (
                                    <div className="h-8 w-2/3 bg-gray-300 rounded animate-pulse"></div>
                                ) : (
                                    InternshipSectionText?.section_title || "Job Vacancies in Nigeria - Direct from Recruiters & HR"
                                )}
                            </h2>
                            <p className="text-gray-600 max-w-2xl">
                            Skip job boards. Get direct access.
                            </p>
                        </div>
                        {/* Desktop View All button */}
                        <Link to="/all-jobs" className="hidden sm:block bg-[#03a9f4] text-white px-6 py-3 rounded-lg hover:bg-[#0288d1] transition-colors whitespace-nowrap">
                            View All Jobs
                        </Link>
                    </div>

                    {/* Mobile: Show 2 jobs vertically, Desktop: Show 3 jobs horizontally */}
                    <div className="block sm:hidden">
                        <div className="space-y-4">
                            {isInternshipsLoading ?
                                Array.from({ length: 2 }).map((_, idx) => (
                                    <JobSkaleton key={idx} />
                                ))
                                :
                                internships?.slice(0, 2)?.map((job) => (
                                    <JobCard job={job} key={job.id} />
                                ))
                            }
                        </div>
                        {/* Mobile View All button */}
                        <div className="mt-6 text-center">
                            <Link to="/all-jobs" className="bg-[#03a9f4] text-white px-6 py-3 rounded-lg hover:bg-[#0288d1] transition-colors inline-block">
                                View All Jobs
                            </Link>
                        </div>
                    </div>

                    {/* Desktop: Horizontal slider */}
                    <div className="hidden sm:block relative">
                        {isInternshipsLoading ?
                            <div className="flex gap-6 overflow-x-auto pb-4">
                                {Array.from({ length: 3 }).map((_, idx) => (
                                    <JobSkaleton key={idx} />
                                ))}
                            </div>
                            :
                            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                                {internships?.slice(0,3)?.map((job) => (
                                    <JobCard job={job} key={job.id} />
                                ))}
                            </div>
                        }
                        {/* Scroll indicator */}
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Freelancer Kit Section */}
            <section className="bg-blue-50 py-12 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1976d2] mb-2">
                                Exchange Rates, Currency Converter, and Invoice app
                            </h2>
                            <h3 className="text-gray-600 max-w-2xl">
                                Monitor Live CBN, Black Market & Fintech Rates and Send Invoices Instantly
                            </h3>
                        </div>
                    </div>

                    
                    <div className="grid lg:grid-cols-1 gap-12 items-center">
                        {/* Left Side - Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {RateSectionInfoCardLoading ? (
                                // Loading skeleton for freelancer kit cards
                                Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl border p-6 shadow-sm animate-pulse"
                                    >
                                        {/* Icon skeleton */}
                                        <div className="w-10 h-10 bg-gray-300 rounded mb-3 animate-pulse"></div>
                                        {/* Title skeleton */}
                                        <div className="h-6 bg-gray-300 rounded mb-2 animate-pulse"></div>
                                        {/* Description skeleton */}
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                                            <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                                            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                RateSectionInfoCard?.map((tool, index) => {
                                    const targetHash = tool?.feature ? `#${tool.feature}` : '';
                                    return (
                                        <Link
                                            to={`/rates-invoices${targetHash}`}
                                            key={index}
                                            className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition block"
                                        >
                                        <img
                                            src={tool?.icon}
                                            className="w-10 h-10"
                                            alt={tool?.title ? `${tool.title} icon` : "Job Dockets tool icon"}
                                            loading="lazy"
                                        />
                                        <h3 className="text-xl font-semibold text-black">{tool.title}</h3>
                                        <p
                                            className="text-sm text-gray-600 mt-1"
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(tool?.description || "")
                                            }}
                                        ></p>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                        
                    </div>
                        <Link to="/rates-invoices" className="block w-fit mx-auto mt-6 bg-[#03a9f4] text-white px-6 py-3 rounded-lg hover:bg-[#0288d1] transition-colors whitespace-nowrap">
                            Rates & Invoice
                        </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
