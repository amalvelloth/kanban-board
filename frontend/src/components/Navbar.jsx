import React from 'react'
import { useLocation } from 'react-router-dom'
import BurgerMenu from './BurgerMenu'

function Navbar({ className }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/login';


  return (
    <nav className={`h-16 flex items-center justify-center w-full absolute z-10 ${className}`}>
      { !isHomePage && <BurgerMenu/> }
      <a href="/" class="flex gap-2">
        <h1 className='!text-xl text-white font-semibold max-md:text-2xl z-50'>KANBAN</h1>
        <h1 className='!text-xl text-white font-light max-md:text-2xl z-50'>BOARD</h1>
      </a>
    </nav>
  )
}

export default Navbar