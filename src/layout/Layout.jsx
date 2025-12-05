import Footer from "@/shared/footer/Footer"
import MobileNavbar from "@/shared/navbar/MobileNavbar"
import Navbar from "@/shared/navbar/Navbar"
import Lenis from "lenis"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"


const Layout = () => {

  // useEffect(() => {
  //   const lenis = new Lenis({
  //     duration: 0.6,
  //     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  //     smooth: true
  //   });

  //   function raf(time) {
  //     lenis.raf(time);
  //     requestAnimationFrame(raf);
  //   }
  //   requestAnimationFrame(raf);

  //   return () => {
  //     lenis.destroy();
  //   }
  // }, [])

  return (
    <div className="">
      <div className="sticky top-0 left-0 w-full bg-white z-50 shadow-md hidden xmd:block">
        <Navbar />
      </div>

      <div className="sticky top-0 left-0 w-full bg-white z-50  xmd:border xmd:hidden">
        <MobileNavbar />
      </div>

      <Outlet />
      <Footer />
    </div>

  )
}

export default Layout