import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion'
import { SlideUp } from '@/animation/animate';
import { services } from '@/lib/data';




const ServiceCard = ({ service }) => {
    const [selectedLevel, setSelectedLevel] = useState(0); // Default to first level
    const currentLevel = service.levelTags[selectedLevel];

    const rateTypes = [
        { key: 'hourlyRate', label: 'Hourly Rate' },
        { key: 'perProjectRate', label: 'Per Project' },
        { key: 'monthlyRetainer', label: 'Monthly Retainer' },
        { key: 'perWordRate', label: 'Per Word' },
        { key: 'perSessionRate', label: 'Per Session' },
        { key: 'perPageRate', label: 'Per Page' }
    ];

    return (
        <div className="bg-white rounded-xl p-4 md:p-6 border h-full">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#22404B] my-3 md:my-5">
                {service.category}
            </h3>

            {/* Level Tags - Responsive Stack on Mobile */}
            <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                {service.levelTags.map((tag, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedLevel(index)}
                        className={`text-xs sm:text-sm md:text-base font-medium px-3 py-2 md:px-4 md:py-3 rounded-md transition-colors ${selectedLevel === index
                            ? 'bg-[#46d7ff] text-white'
                            : 'bg-[#E6F6FF] text-[#0A99FF] hover:bg-[#D0EFFF]'
                            }`}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>

            {/* Tasks List - Adjust font size and spacing */}
            <ul className="mb-4 md:mb-6 text-sm sm:text-base lg:text-xl text-Gray list-disc list-inside space-y-2 md:space-y-4">
                {currentLevel.tasks.map((task, i) => (
                    <li key={i} className="break-words">{task}</li>
                ))}
            </ul>

            {/* Rates section - only shows fields with actual values */}
            <div className="flex flex-wrap gap-4">
                {/* Hourly Rate */}
                {(currentLevel.hourlyRate !== 'N/A' && currentLevel.hourlyRate) && (
                    <div className="min-w-[150px] flex-1">
                        <p className="font-medium text-sm sm:text-base md:text-lg mb-1 text-[#323232]">
                            Hourly Rate
                        </p>
                        <p className="bg-[#00BFFF] text-white rounded-md px-3 py-2 md:px-4 md:py-3 w-full text-center sm:text-left">
                            {currentLevel.hourlyRate}
                        </p>
                    </div>
                )}

                {/* Per Project Rate */}
                {(currentLevel.perProjectRate !== 'N/A' && currentLevel.perProjectRate) && (
                    <div className="min-w-[150px] flex-1">
                        <p className="font-medium text-sm sm:text-base md:text-lg mb-1 text-[#323232]">
                            Per Project
                        </p>
                        <p className="bg-[#00BFFF] text-white rounded-md px-3 py-2 md:px-4 md:py-3 w-full text-center sm:text-left">
                            {currentLevel.perProjectRate}
                        </p>
                    </div>
                )}

                {/* Monthly Retainer */}
                {(currentLevel.monthlyRetainer !== 'N/A' && currentLevel.monthlyRetainer) && (
                    <div className="min-w-[150px] flex-1">
                        <p className="font-medium text-sm sm:text-base md:text-lg mb-1 text-[#323232]">
                            Monthly Retainer
                        </p>
                        <p className="bg-[#00BFFF] text-white rounded-md px-3 py-2 md:px-4 md:py-3 w-full text-center sm:text-left">
                            {currentLevel.monthlyRetainer}
                        </p>
                    </div>
                )}

                {/* Per Word Rate */}
                {(currentLevel.perWordRate !== 'N/A' && currentLevel.perWordRate) && (
                    <div className="min-w-[150px] flex-1">
                        <p className="font-medium text-sm sm:text-base md:text-lg mb-1 text-[#323232]">
                            Per Word
                        </p>
                        <p className="bg-[#00BFFF] text-white rounded-md px-3 py-2 md:px-4 md:py-3 w-full text-center sm:text-left">
                            {currentLevel.perWordRate}
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default function ServicesSlider() {
    const swiperRef = useRef(null);

    return (
        <section id='service' className="px-6">
            <h2 className="text-[28px] sm:text-[38px] xmd:text-[48px] font-semibold mb-6">
                Charge Your Worth: Explore Freelance Roles And Rates
            </h2>
            <motion.div
                variants={SlideUp(0.3)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="">


                <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1200: { slidesPerView: 3 },
                    }}
                >
                    {services.map((service, idx) => (
                        <SwiperSlide key={idx}>
                            <ServiceCard service={service} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>
            {/* Custom navigation buttons */}
            <div className="flex justify-end mt-4 gap-2">
                <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="p-2 rounded-full bg-white border hover:bg-gray-300 transition-colors"
                    aria-label="Previous slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="p-2 rounded-full bg-[#00BFFF] border hover:bg-gray-300 transition-colors"
                    aria-label="Next slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
        </section>
    );
}