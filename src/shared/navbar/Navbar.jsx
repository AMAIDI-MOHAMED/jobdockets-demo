import { imageProvider } from '@/imageProvider/ImageProvider'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';


const Navbar = () => {
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const isCoursesRoute = location.pathname === '/free-courses' || location.pathname.startsWith('/courses');
  const isJobsRoute = location.pathname === '/all-jobs' || location.pathname.startsWith('/jobs');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      let currentSection = '';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        // Adjust these offsets as needed 
        const scrollPosition = window.scrollY + (window.innerHeight / 3);

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = section.id;
        }
      });
      setActiveSection(currentSection);
    };

    // Run once on mount to set initial active section 
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  const scrollWithOffset = (element) => {
    const yCoordinate = element.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -100;
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
  }

  // console.log(location)
  return (
    <div>
      <div className="bg-dark section-padding-x py-6 flex items-center justify-between">
        <Link to={'/'}>
          <div className="flex items-center gap-2">
            <img src={imageProvider.logo} className='w-16 h-14 rounded' alt="" />
            <h1 className='text-2xl font-bold '>Jobdockets</h1>
          </div>
        </Link>
        <div className="">
          <ul className='flex items-center gap-4 xlg:gap-8 text-lg'>
            {/* <HashLink
              smooth
              to={'#home'}
              scroll={scrollWithOffset}
              className={`${location.hash === '#home' ? 'text-[#03A9F4]' : 'text-gray-400'}`}
            >
              Home
            </HashLink>
            <HashLink
              smooth
              to={'#exchange'}
              scroll={scrollWithOffset}
              className={`${location.hash === '#exchange' ? 'text-[#03A9F4]' : 'text-gray-400'}`}
            >
              Exchange
            </HashLink>
            <HashLink
              smooth
              to={'#service'}
              scroll={scrollWithOffset}
              className={`${location.hash === '#service' ? 'text-[#03A9F4]' : 'text-gray-400'}`}
            >
              Service
            </HashLink>
            <HashLink
              smooth
              to={'#invoiceGenerator'}
              scroll={scrollWithOffset}
              className={`${location.hash === '#invoiceGenerator' ? 'text-[#03A9F4]' : 'text-gray-400'}`}
            >
              Invoice Generator
            </HashLink>
            <HashLink
              smooth
              to={'#liveRates'}
              scroll={scrollWithOffset}
              className={`${location.hash === '#liveRates' ? 'text-[#03A9F4]' : 'text-gray-400'}`}
            >
              Live Rates
            </HashLink> */}

            <NavLink
              to={'/'}
              className={`${location.pathname === '/' ? 'text-[#03A9F4]' : 'text-gray-400'}`}
            >
              Home
            </NavLink>

            <NavLink
              to={'/free-courses'}
              className={`${isCoursesRoute ? 'text-[#03A9F4]' : 'text-gray-400'}`}
            >
              Free Courses
            </NavLink>

            <NavLink
              to={'/all-jobs'}
              className={`${isJobsRoute ? 'text-[#03A9F4]' : 'text-gray-400'}`}
            >
              Jobs
            </NavLink>

            <NavLink
              to={'/rates-invoices'}
              className={`${location.pathname === '/rates-invoices' ? 'text-[#03A9F4]' : 'text-gray-400'}`}
            >
              Rates/Invoices
            </NavLink>
            <NavLink
              to={'/blog'}
              className={`${location.pathname === '/blog' ? 'text-[#03A9F4]' : 'text-gray-400'}`}
            >
              Blog
            </NavLink>


          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
