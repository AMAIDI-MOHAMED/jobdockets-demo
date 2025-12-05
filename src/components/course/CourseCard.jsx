import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

const CourseCard = ({ course }) => {
    const slugSegment = course?.slug || course?.id;
    const detailPath = `/courses/${slugSegment}`;
    const hasCopoun = Boolean(course?.copoun);
    const badgeStyles = hasCopoun
        ? "bg-blue-600 text-white"
        : "bg-green-600 text-white";
    const badgeLabel = hasCopoun ? "100% Off" : "Free";
    const categoryBadge = course?.category_label || course?.category_group_label;

    return (
        <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden min-w-[280px] p-4">
            {categoryBadge && (
                <span className="absolute top-4 left-4 px-3 py-1 m-2 text-xs font-semibold rounded-full bg-gray-900/80 text-white">
                    {categoryBadge}
                </span>
            )}
            <span className={`absolute top-4 right-4 px-3 py-1 m-2 text-sm font-bold rounded-full ${badgeStyles}`}>
                {badgeLabel}
            </span>
            {/* Course Image */}
            <div className="w-full h-48 bg-gray-200 overflow-hidden rounded-lg mb-4">
                <img 
                    src={course?.image} 
                    alt={course?.title || 'Course thumbnail'} 
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-all duration-300" 
                />
            </div>

            {/* Course Content */}
            <div className="p-4">
                {/* Course Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">
                    {course?.title}
                </h3>
                
                {/* Course Description */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed" style={{wordBreak: 'break-word'}}
                   dangerouslySetInnerHTML={{
                       __html: DOMPurify.sanitize(course?.sub_description?.slice(0, 80) || "")
                   }}
                />
                
                {/* View Details Link */}
                <Link
                    to={detailPath}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                    Learn For Free <span className="ml-1">&gt;</span>
                </Link>
            </div>
        </div>
    );
};

export default CourseCard;
