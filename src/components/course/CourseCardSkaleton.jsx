import React from 'react';

const CourseCardSkaleton = () => {
    return (
        <div
            className="border rounded-xl p-6 bg-gray-50 animate-pulse flex flex-col gap-3"
        >
            <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>
    );
};

export default CourseCardSkaleton;