import { useCMS } from "@/hooks/useCMS";
import React from "react";

const JobBannerSkeleton = () => {
    return (
        <div className="relative w-full rounded-xl overflow-hidden shadow-sm mb-10 h-[300px] sm:h-[700px] bg-gray-200 animate-pulse">
            {/* Background skeleton */}
            <div className="absolute inset-0 bg-gray-300 animate-pulse" />
            
            {/* Overlay skeleton */}
            <div className="absolute inset-0 bg-gray-400 opacity-30" />
            
            {/* Content skeleton */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-8">
                {/* Title skeleton */}
                <div className="h-8 sm:h-10 bg-gray-400 rounded-lg mb-3 w-3/4 animate-pulse"></div>
                
                {/* Description skeleton */}
                <div className="space-y-2 w-full max-w-2xl">
                    <div className="h-4 bg-gray-400 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-400 rounded w-4/5 mx-auto animate-pulse"></div>
                    <div className="h-4 bg-gray-400 rounded w-3/4 mx-auto animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

const JobBanner = () => {
    const { InternshipBanner, InternshipBannerLoading } = useCMS();
    
    // Show skeleton while loading
    if (InternshipBannerLoading) {
        return <JobBannerSkeleton />;
    }
    
    return (
        <div className="relative w-full rounded-xl overflow-hidden shadow-sm mb-10 h-[300px] sm:h-[700px]">
            {/* Background Image */}
            <img
                src={InternshipBanner?.image}
                alt="Internship Banner"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 sm:px-8">
                <h1 className="text-3xl sm:text-5xl font-bold mb-3">
                    {InternshipBanner?.title}
                </h1>
                <p className="text-base sm:text-lg max-w-2xl">
                    {InternshipBanner?.description}
                </p>
            </div>
        </div>
    );
};

export default JobBanner;
