import React from 'react';
import { Link } from 'react-router-dom';
import { slugifyLocationLabel } from '@/constants/jobLocations';

const JobCard = ({ job }) => {
    const slugSegment = job?.slug || job?.id;
    const locationLabel = job?.location_label || job?.location || '';
    const detailPath = `/jobs/${slugSegment}`;

    const categorySlug = job?.category;
    const categoryLabel = job?.category_label || 'Others';
    const categoryPath = categorySlug ? `/jobs/c/${categorySlug}` : null;

    const locationSlug = locationLabel ? slugifyLocationLabel(locationLabel) : '';
    const locationPath = locationSlug ? `/jobs/l/${locationSlug}` : null;
    const safeLocationLabel = locationLabel || 'Location';

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden min-w-[280px]">
            {/* Job Content */}
            <div className="p-4">
                {/* Job Title */}
                <h3 className="text-lg font-bold text-gray-800 my-3 leading-tight">
                    {job?.title}
                </h3>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 my-7">
                    {categoryPath ? (
                        <Link
                            to={categoryPath}
                            className="px-3 py-1 bg-[#03A9F424] text-[#03A9F4] text-xs font-medium rounded-md hover:text-[#0288d1]"
                        >
                            {categoryLabel}
                        </Link>
                    ) : (
                        <span className="px-3 py-1 bg-[#03A9F424] text-[#03A9F4] text-xs font-medium rounded-md">
                            {categoryLabel}
                        </span>
                    )}
                    {locationPath ? (
                        <Link
                            to={locationPath}
                            className="px-3 py-1 bg-[#03A9F424] text-[#03A9F4] text-xs font-medium rounded-md hover:text-[#0288d1]"
                        >
                            {safeLocationLabel}
                        </Link>
                    ) : (
                        <span className="px-3 py-1 bg-[#03A9F424] text-[#03A9F4] text-xs font-medium rounded-md">
                            {safeLocationLabel}
                        </span>
                    )}
                </div>
                
                {/* Job Type */}
                <p className="text-sm text-gray-700 my-2">
                    Job Type: <span className="font-medium">{job?.type || 'Not specified'}</span>
                </p>
                
                {/* Salary */}
                <p className="text-sm font-bold text-gray-800 my-4">
                    Salary: {job?.salary || 'Not specified'}
                </p>
                <p className="text-sm font-bold text-gray-800 my-4">
                    Job Posted: {new Date(job?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || 'Not specified'}
                </p>
                
                {/* View Details Link */}
                <Link
                    to={detailPath}
                    className="inline-flex items-center mt-8 text-[#03A9F4] hover:text-blue-700 font-medium text-sm transition-colors"
                >
                    View Details <span className="ml-1">&gt;</span>
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
