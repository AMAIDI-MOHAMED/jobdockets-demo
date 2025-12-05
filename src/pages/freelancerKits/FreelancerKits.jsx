import Banner from '@/components/Banner';
import BlogSpace from '@/components/BlogSpace';
import CBNRateList from '@/components/CBNRateList';
import Converter from '@/components/Converter';
import CurrencyRateList from '@/components/CurrencyRateList';
import CurrencyRateSection from '@/components/CurrencyRateSection';
import InvoiceBanner from '@/components/InvoiceBanner';
import InvoiceGenerator from '@/components/InvoiceGenerator';
import ServicesSlider from '@/components/ServicesSlider';
import SportLight from '@/components/SportLight';
import { CommonPageWrapper } from '@/lib/CommonPageWrapper';
import React, { useEffect, useMemo, useRef } from 'react';
import { ScrollRestoration, useLocation } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import SEOHead from '@/components/SEOHead';


const FreelancerKits = () => {
  const { seoData } = useSEO('rates-invoice');
  const location = useLocation();

  const currencyRef = useRef(null);
  const converterRef = useRef(null);
  const invoiceGeneratorRef = useRef(null);

  const sectionRefs = useMemo(() => ({
    'currency-rate': currencyRef,
    'converter': converterRef,
    'invoice-generator': invoiceGeneratorRef,
  }), []);

  useEffect(() => {
    const hash = location.hash?.replace('#', '');
    if (!hash) {
      return;
    }

    const targetRef = sectionRefs[hash];

    if (targetRef?.current) {
      requestAnimationFrame(() => {
        targetRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      });
    }
  }, [location.hash, sectionRefs]);
  
  return (
    <div>
      <SEOHead seoData={seoData} />
      <ScrollRestoration />
      <SportLight />
      <Banner />
      <CommonPageWrapper>
        {/* <CurrencyRateList /> */}
        <section id="currency-rate" ref={currencyRef} className="scroll-mt-24">
          <CurrencyRateSection />
        </section>
        {/* <CBNRateList/> */}
        <section id="converter" ref={converterRef} className="scroll-mt-24">
          <Converter />
        </section>
        <ServicesSlider />
        <section id="invoice-generator" ref={invoiceGeneratorRef} className="scroll-mt-24">
          <InvoiceGenerator />
        </section>
        <InvoiceBanner />
        {/* <BlogSpace/> */}
      </CommonPageWrapper>
    </div>
  );
};

export default FreelancerKits;
