import React, { useEffect, useState } from "react";
import { Button, Drawer } from "antd";
import { IoMenu, IoClose } from "react-icons/io5";
import { HashLink } from "react-router-hash-link";
import { Link, useLocation } from "react-router-dom";
import { imageProvider } from "@/imageProvider/ImageProvider";



const MobileNavbar = () => {
    const [open, setOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const location = useLocation();
    const isCoursesRoute = location.pathname === '/free-courses' || location.pathname.startsWith('/courses');
    const isJobsRoute = location.pathname === '/all-jobs' || location.pathname.startsWith('/jobs');

    useEffect(() => {
        const sections = document.querySelectorAll("section");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.6 }
        );
        sections.forEach((section) => observer.observe(section));
        return () => sections.forEach((section) => observer.unobserve(section));
    }, []);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="bg-white flex justify-between px-5 items-center py-6">
                <div className="flex items-center">
                    <Link to="/"><img src={imageProvider.logo} className='h-12 w-15 rounded-lg' alt=""/></Link>
                    <h1 className='text-2xl font-bold ms-2'>Jobdockets</h1>
                </div>

                <Button
                    type="text"
                    className="text-2xl text-black md:hidden"
                    onClick={showDrawer}
                >
                    <IoMenu className="text-black text-2xl" />
                </Button>
            </div>

            {/* Mobile Drawer */}
            <Drawer
                placement="left"
                closable={false}
                onClose={onClose}
                open={open}
                width={280}
                className="p-0 bg-dark"
            >
                {/* Close Button */}
                <div className="flex justify-between items-center px-4 py-3 border-b ">
                    <span className="text-lg font-semibold  p-2 rounded">
                        <img src={imageProvider.logo} className='h-12 w-20 rounded-lg' alt="" />
                    </span>
                    <Button type="text" className="text-xl" onClick={onClose}>
                        <IoClose className="text-2xl" />
                    </Button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-3 px-4 py-5 ">
                    <HashLink
                        smooth to='/'
                        onClick={onClose}
                        className={`py-2 text-lg font-medium transition-all ${activeSection === '/' ? 'text-primary' : ''}`}>
                        Home
                    </HashLink>
                    

                    <HashLink
                        onClick={onClose}
                        smooth to={'/free-courses'} className={`py-2 text-lg font-medium transition-all ${(activeSection === '/free-courses' || isCoursesRoute) ? 'text-primary' : ''}`}>
                        Free Courses
                    </HashLink>

                    <HashLink
                        onClick={onClose}
                        smooth to={'/all-jobs'} className={`py-2 text-lg font-medium transition-all ${(activeSection === '/all-jobs' || isJobsRoute) ? 'text-primary' : ''}`}>
                        Jobs
                    </HashLink>
                    <HashLink
                        onClick={onClose}
                        smooth to={'/rates-invoices'} className={`py-2 text-lg font-medium transition-all ${activeSection === '/rates-invoices' ? 'text-primary' : ''}`}>
                        Rates/Invoices
                    </HashLink>
                    <HashLink
                        onClick={onClose}
                            smooth to={'/blog'} className={`py-2 text-lg font-medium transition-all ${activeSection === 'blogs' ? 'text-primary' : ''}`}>
                        Blog
                    </HashLink>


                </nav>






            </Drawer>
        </>
    );
};

export default MobileNavbar;
