import React, { useState } from 'react';
import { ScrollRestoration } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SEOHead from '@/components/SEOHead';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const seoData = {
        meta_title: 'Contact Us - Jobdockets',
        meta_description: 'Get in touch with the Jobdockets team. We\'re here to help with your questions about jobs, courses, and our services.',
        canonical_url: 'https://jobdockets.com/contact',
        og_type: 'website',
        og_title: 'Contact Jobdockets',
        og_description: 'Get in touch with our team',
        og_url: 'https://jobdockets.com/contact',
        structured_data: {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Jobdockets",
            "description": "Get in touch with us"
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] py-12 px-6 md:px-20">
            <SEOHead seoData={seoData} />
            <ScrollRestoration />
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-10">
                <h1 className="text-3xl font-bold text-[#22404B] mb-6 border-b pb-3">
                    Contact Us
                </h1>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-[#22404B] mb-4">Get in Touch</h2>
                            <p className="text-gray-700 leading-relaxed">
                                 We'd love to hear from you--whether it's about our services, advert bookings, or any other questions.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-[#22404B] rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-[#22404B]">Email</p>
                                    <p className="text-gray-600">admin@jobdockets.com</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-[#22404B] rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-[#22404B]">Response Time</p>
                                    <p className="text-gray-600">Within 24 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-[#22404B] font-medium">Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1"
                                    placeholder="Your full name"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-[#22404B] font-medium">Email *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone" className="text-[#22404B] font-medium">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="mt-1"
                                    placeholder="Your phone number"
                                />
                            </div>

                            <div>
                                <Label htmlFor="message" className="text-[#22404B] font-medium">Message *</Label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22404B] focus:border-transparent resize-none"
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>

                            {submitStatus === 'success' && (
                                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                                    Delivered.
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    Sorry, there was an error sending your message. Please try again.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#22404B] text-white py-3 px-6 rounded-md hover:bg-[#1a323a] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage; 