import React from 'react';
import { motion } from 'framer-motion';
import { SlideLeft, Zooming } from '@/animation/animate';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';

const BannerSkeleton = () => (
  <section id='home'>
    <div className="flex flex-col-reverse xmd:flex-row justify-center items-center w-11/12 mx-auto section-padding-y">
      <div className="xmd:w-1/2 animate-pulse">
        {/* Title skeleton */}
        <div className="h-8 sm:h-10 xmd:h-12 xlg:h-16 bg-gray-300 rounded mb-4 w-3/4"></div>
        <div className="h-6 sm:h-8 xmd:h-10 xlg:h-12 bg-gray-300 rounded mb-4 w-1/2"></div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Button skeleton */}
        <div className="h-12 bg-gray-300 rounded w-32"></div>
      </div>
      
      <div className="xmd:w-1/2 animate-pulse">
        {/* Image skeleton */}
        <div className="w-64 h-64 bg-gray-300 rounded mx-auto"></div>
      </div>
    </div>
  </section>
);

const Banner = () => {
    const axiosPublic = useAxiosPublic();
    const { data: bannerData, isLoading } = useQuery({
        queryKey: ['bannerData'],
        queryFn: async () => {
            const res = await axiosPublic.get('/cms/freelance_kit_page/banner_section');
            return res?.data?.data?.banner_section;
        }
    });

    console.log('bannerData', bannerData);

    if (isLoading) {
        return <BannerSkeleton />;
    }

    return (
        <section id='home'>
            <div className="flex flex-col-reverse xmd:flex-row justify-center items-center w-11/12 mx-auto section-padding-y">
                <motion.div
                    variants={SlideLeft(0.3)}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="xmd:w-1/2 ">
                    <p className="font-bold text-[28px] sm:text-[38px] xmd:text-[48px] xlg:text-[64px]">
                        {bannerData?.title}
                    </p>
                    <p className="text-Gray"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bannerData?.description) }}
                    >

                    </p>
                    <button className="bg-Custom-primary hover:bg-blue-300 transition transform hover:scale-105 duration-200 text-white py-4 my-4 px-3 md:px-8 rounded-md">Let's Start</button>
                </motion.div>
                <div className="xmd:w-1/2 ">
                    <motion.img
                        variants={Zooming(0.3)}
                        initial="initial"
                        whileInView={"animate"}
                        viewport={{ once: true }}
                        src={bannerData?.image} className='object-contain w-fit mx-auto' alt="" />
                </div>
            </div>
        </section>
    );
};

export default Banner;