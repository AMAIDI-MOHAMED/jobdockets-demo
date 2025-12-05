import React from 'react';

const JobSkaleton = () => {
    return (
        <div

            className="bg-white rounded-xl border p-6 shadow-sm animate-pulse"
        >
            {/* Title skeleton */}
            <div className="h-6 bg-gray-300 rounded mb-2 w-2/3"></div>
            {/* Company/location skeleton */}
            <div className="h-4 bg-gray-200 rounded mb-1 w-1/2"></div>
            {/* Type skeleton */}
            <div className="h-4 bg-gray-200 rounded mb-1 w-1/3"></div>
            {/* Salary skeleton */}
            <div className="h-4 bg-gray-200 rounded mb-3 w-1/4"></div>
            {/* Button skeleton */}
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>
    );
};

export default JobSkaleton;