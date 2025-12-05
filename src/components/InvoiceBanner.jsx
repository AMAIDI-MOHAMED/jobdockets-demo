import { imageProvider } from '@/imageProvider/ImageProvider';
import React from 'react';
import { motion } from 'framer-motion';
import { SlideLeft, SlideRight, Zooming } from '@/animation/animate';

const InvoiceBanner = () => {
    return (
        <div className='flex flex-col-reverse md:flex-row justify-center'>
            <div className="md:w-1/2">
                <motion.img
                variants={Zooming(0.3)}
                initial="initial"
                whileInView={"animate"}
                viewport={{ once: true }}
                src={imageProvider.invoiceReal} alt="" />
            </div>
            <motion.div
            variants={SlideRight(0.3)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="md:w-1/2">
                <h2 className="text-[28px] sm:text-[38px] xmd:text-[48px] font-semibold mb-6">
                    Sample Downloaded Invoice Design
                </h2>
                
                <img src={imageProvider.invoicelogo} alt="" />
            </motion.div>
        </div>
    );
};

export default InvoiceBanner;