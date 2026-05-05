import React from 'react'
import { useLocation } from 'react-router-dom'
import BurgerMenu from './BurgerMenu'
import Logo from '../assets/kanban-board-logo.png'
import darkmodeIcon from '../assets/icons/dark_mode.svg'
import ToggleButton from '../../../frontend/src/components/ToggleButton'
import LogOut from './Logout'

function Navbar({ className }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/login';


  return (
    <nav className={`login-navbar mt-0 rounded-xl md:mt-4 [.light_&]:!bg-white [.light_&]:rounded-none h-16 w-full md:w-3xl md:mx-auto md:left-0 md:right-0 !fixed px-4 flex items-center justify-between z-50 ${className}`}>
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
