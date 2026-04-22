import React from 'react'
import { useLocation } from 'react-router-dom'
import BurgerMenu from './BurgerMenu'
import Logo from '../assets/kanban-board-logo.png'

function Navbar({ className }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/login';


  return (
    <nav className={`h-16 font-rmneue flex items-center justify-center w-full absolute z-10 ${className}`}>
      {!isHomePage && <BurgerMenu />}
      <a href="/" class="flex items-center gap-2">
        <img src={Logo} className='h-6 w-6 md:w-8 md:h-8 me-2 z-50' alt="" />
        <h1 className='text-xs font-carving text-[#b3bdf9] font-semibold md:text-lg z-50'>KANBAN</h1>
      </a>
    </nav>
  )
}

export default Navbar