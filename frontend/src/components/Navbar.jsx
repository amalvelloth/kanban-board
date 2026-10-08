import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Logo from '../assets/kanban-board-logo.png'
import ToggleButton from '../../../frontend/src/components/ToggleButton'
import LogOut from './Logout'

function Navbar({ className }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show at the top of the page
      if (currentScrollY <= 20) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down -> hide navbar
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> show navbar
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`login-navbar mt-0 rounded-xl md:mt-4 [.light_&]:!bg-white [.light_&]:rounded-[2px] h-16 w-full md:w-3xl md:mx-auto md:left-0 md:right-0 !fixed px-4 flex items-center justify-between z-50 ${isLoginPage ? "transition-all duration-500 delay-300 ease-out" : "transition-all duration-300 ease-out"
        } ${showNavbar
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-24 opacity-0 scale-95 pointer-events-none"
        } ${className}`}
    >
      {/* {<BurgerMenu />} */}
      <a href="/" class="flex items-center gap-3">
        <img src={Logo} className='h-6 w-6 md:w-8 md:h-8 z-50' alt="" />
        <h1 className='text-xs font-carving text-[#b3bdf9] font-semibold md:text-lg z-50'>KANBAN</h1>
      </a>
      {/* <a href="" className="bg-black! border border-white/50 ml-auto px-4 py-2 rounded-xl bg-white text-sm font-medium text-red-400 hover:text-red-700 transition-colors duration-300">
        Logout
      </a> */}
      <div className="flex gap-2">
        <LogOut />
        <ToggleButton />
      </div>
    </nav>

  )
}

export default Navbar
