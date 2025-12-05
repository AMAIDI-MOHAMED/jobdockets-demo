// pages/JobDetails.jsx
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { ScrollRestoration, useParams, Link, Navigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { useSEOByPage } from "@/hooks/useSEO";
import SEOHead from "@/components/SEOHead";
import JobCard from "@/components/jobs/JobCard";
import { slugifyLocationLabel } from "@/constants/jobLocations";
import './JobDetails.css'

const JobDetailsSkeleton = () => (
  <div className="px-4 sm:px-8 py-12 max-w-4xl mx-auto bg-white animate-pulse ">
    {/* Job Title */}
    <div className="h-10 w-2/3 bg-gray-300 rounded mb-2"></div>
    <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>

    {/* Company Overview */}
    <div className="mb-6">
      <div className="h-6 w-1/4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded mb-1"></div>
    </div>

    {/* Job Description */}
    <div className="mb-6">
      <div className="h-6 w-1/4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
      <div className="h-4 w-4/5 bg-gray-200 rounded mb-1"></div>
    </div>

    {/* Responsibilities */}
    <div className="mb-6">
      <div className="h-6 w-1/4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded mb-1"></div>
      <div className="h-4 w-2/3 bg-gray-200 rounded mb-1"></div>
    </div>

    {/* Requirements */}
    <div className="mb-6">
      <div className="h-6 w-1/4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-4/5 bg-gray-200 rounded mb-1"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded mb-1"></div>
    </div>

    {/* CTA */}
    <div className="flex items-center justify-between bg-blue-50 border rounded-xl p-5">
      <div>
        <div className="h-6 w-24 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
      <div className="h-10 w-32 bg-blue-300 rounded"></div>
    </div>
  </div>
);

const JobDetails = () => {
  const { jobSlug, id } = useParams();
  const identifier = jobSlug || id;

  const axiosPublic = useAxiosPublic();

  const { data: jobDetails, isLoading: isJobDetailsLoading } = useQuery({
    queryKey: ["jobDetails", identifier],
    queryFn: async () => {
      const res = await axiosPublic.get(`/job-posts/details/${identifier}`);
      return res?.data?.data;
    },
    enabled: !!identifier
  });

  const { seoData } = useSEOByPage('job-details');

  const jobSchema = useMemo(() => {
    if (!jobDetails) return null;

    return {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": jobDetails.title,
      "description": DOMPurify.sanitize(jobDetails.description || "", { ALLOWED_TAGS: [] }),
      "datePosted": jobDetails.created_at,
      "employmentType": jobDetails.type || "CONTRACTOR",
      "industry": jobDetails.category_label || "General",
      "hiringOrganization": {
        "@type": "Organization",
        "name": jobDetails.company || "Hiring Organization",
        "sameAs": "https://jobdockets.com/"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": jobDetails.location || "Nigeria",
          "addressCountry": "NG"
        }
      },
      "applicantLocationRequirements": {
        "@type": "Country",
        "name": "Nigeria"
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "NGN",
        "value": {
          "@type": "QuantitativeValue",
          "value": jobDetails.salary || 0,
          "unitText": "MONTH"
        }
      },
      "validThrough": jobDetails.valid_through || jobDetails.created_at,
      "employmentUnit": jobDetails.type || undefined
    };
  }, [jobDetails]);

  const seoPayload = useMemo(() => {
    if (!jobDetails) return seoData;
    return {
      ...seoData,
      meta_title: jobDetails.title ? `${jobDetails.title} | Job Dockets` : seoData?.meta_title,
      meta_description: jobDetails.description
        ? DOMPurify.sanitize(jobDetails.description, { ALLOWED_TAGS: [] }).slice(0, 155)
        : seoData?.meta_description,
      canonical_url: `https://jobdockets.com/jobs/${jobDetails.slug || jobDetails.id}`,
      structured_data: jobSchema || seoData?.structured_data
    };
  }, [jobDetails, seoData, jobSchema]);

  if (isJobDetailsLoading) {
    return <JobDetailsSkeleton />;
  }

  if (!jobDetails) {
    return <Navigate to="/jobs" replace />;
  }

  return (
    <div className="px-4 sm:px-8 py-12 max-w-4xl mx-auto bg-white">
      <SEOHead seoData={seoPayload} />
      <ScrollRestoration />
      <nav className="text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">&rsaquo;</span>
        <Link to="/jobs" className="hover:text-blue-600">Jobs</Link>
        {jobDetails.category && jobDetails.category_label && (
          <>
            <span className="mx-2">&rsaquo;</span>
            <Link to={`/jobs/c/${jobDetails.category}`} className="hover:text-blue-600">
              {jobDetails.category_label}
            </Link>
          </>
        )}
        {jobDetails.location && (
          <>
            <span className="mx-2">&rsaquo;</span>
            {(() => {
              const locationSlug = slugifyLocationLabel(jobDetails.location);
              if (!locationSlug) {
                return <span className="text-gray-800">{jobDetails.location}</span>;
              }
              return (
                <Link to={`/jobs/l/${locationSlug}`} className="hover:text-blue-600">
                  {jobDetails.location}
                </Link>
              );
            })()}
          </>
        )}
        <span className="mx-2">&rsaquo;</span>
        <span className="text-gray-800">{jobDetails.title}</span>
      </nav>
      {/* Job Title */}
      <h1 className="text-3xl font-bold mb-2">
        {seoData?.h1_tags || jobDetails?.title}
      </h1>
      <p className="text-gray-600 text-sm mb-4">
        {jobDetails?.company || 'Company'} &bull; {jobDetails?.location || 'Location'} &bull; {jobDetails?.type || 'Job Type'} &bull; {jobDetails?.salary || 'Compensation'}
      </p>

      {/* Category & Location badges */}
      <div className="mb-6 flex flex-wrap gap-2">
        {jobDetails?.category && jobDetails?.category_label && (
          <Link
            to={`/jobs/c/${jobDetails.category}`}
            className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
          >
            {jobDetails.category_label}
          </Link>
        )}
        {(jobDetails?.job_location || jobDetails?.location) && (() => {
          const locationSlug = slugifyLocationLabel(jobDetails?.job_location || jobDetails?.location);
          if (!locationSlug) {
            return (
              <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                {jobDetails?.job_location || jobDetails?.location}
              </span>
            );
          }
          return (
            <Link
              to={`/jobs/l/${locationSlug}`}
              className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
            >
              {jobDetails?.job_location || jobDetails?.location}
            </Link>
          );
        })()}
      </div>

      {/* Company Overview */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">About the Company</h2>
        <div className="text-gray-700 leading-relaxed prose max-w-none blog-content"
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(jobDetails?.about_company || '')
          }}
        ></div>
      </div>

      {/* Job Description */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Job Description</h2>
        <div className="text-gray-700 leading-relaxed prose max-w-none blog-content"
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(jobDetails?.description || '')
          }}
        ></div>
      </div>

      {/* Responsibilities */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Key Responsibilities</h2>
        <div className="text-gray-700 leading-relaxed prose max-w-none blog-content"
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(jobDetails?.responsibilities || '')
          }}
        ></div>
      </div>

      {/* Requirements */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Required Skills</h2>
        <div className="text-gray-700 leading-relaxed prose max-w-none blog-content"
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(jobDetails?.requirements || '')
          }}
        ></div>
      </div>

      {/* CTA */}
      {/*<div className="flex items-center justify-between bg-blue-50 border rounded-xl p-5">*/}
      {/*  <div>*/}
      {/*    /!* <p className="text-xl font-bold text-blue-700">${jobDetails?.salary}</p>*/}
      {/*    <p className="text-sm text-gray-600">{jobDetails?.type} &bull; {jobDetails?.location}</p> *!/*/}
      {/*  </div>*/}
      {/*  <Link to={jobDetails?.link_url} target="_blank">*/}
      {/*    <button className="bg-blue-500 cursor-pointer text-white px-6 py-2 rounded-md hover:bg-blue-600 transition">*/}
      {/*      Apply Now*/}
      {/*    </button>*/}
      {/*  </Link>*/}
      {/*</div>*/}

      {/* Related Jobs */}
      <RelatedJobs currentId={jobDetails?.id} />
    </div>
  );
};

const RelatedJobs = ({ currentId }) => {
  const axiosPublic = useAxiosPublic();
  const { data: allJobs, isLoading } = useQuery({
    queryKey: ["allJobsForRelated"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/job-posts`, {
        params: {
          per_page: 60,
          sort_by: "created_at",
          sort_direction: "desc",
        },
      });
      return res?.data?.data?.jobs || [];
    }
  });

  if (isLoading) return null;

  const getTimeValue = (value) => {
    if (!value) return 0;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
  };

  const related = (allJobs || [])
    .filter(j => String(j.id) !== String(currentId))
    .sort((a, b) => {
      const timeB = getTimeValue(b?.created_at || b?.created_at_date || b?.updated_at);
      const timeA = getTimeValue(a?.created_at || a?.created_at_date || a?.updated_at);
      return timeB - timeA;
    })
    .slice(0, 6);

  if (!related.length) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Related Jobs</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {related.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobDetails;
