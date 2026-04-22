import React from 'react'
import { NavLink } from 'react-router-dom'
import { VscGraphLine } from "react-icons/vsc";
import { FaTasks } from "react-icons/fa";
import { CgGym } from "react-icons/cg";
import { IoMdSettings } from "react-icons/io";
import { PiSignOutBold } from "react-icons/pi";
import Login from '../pages/Login';



function DesktopMenu() {


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');

        setTimeout(() => {
            Navigate("/login");
        }, 1000);
    }

    return (
        <div
            className={`max-lg:hidden h-screen min-w-fit flex items-center top-0 -left-0 z-[9999] bg-[#000] transition-transform duration-500 translate-x-0'
                    }`}
        >
            <ul className='flex flex-col items-start justify-center h-full'>

                <NavLink to="/dashboard" className="w-full text-lg font-bold" activeClassName="underline">
                    <li className='w-full py-4 px-12 flex items-center hover:bg-neutral-900 text-white hover:text-white'>
                        <VscGraphLine className='me-8'/>
                        Dashboard
                    </li>
                </NavLink>

                <NavLink to="/taskcontrol" className="w-full text-lg font-bold" activeClassName="underline">
                    <li className='w-full py-4 px-12 flex items-center hover:bg-neutral-900 text-white hover:text-white'>
                        <FaTasks className='me-8'/>
                        Task Control
                    </li>
                </NavLink>

                <NavLink to="/workoutprograms" className="w-full text-lg font-bold" activeClassName="underline">
                    <li className='w-full py-4 px-12 flex items-center hover:bg-neutral-900 text-white hover:text-white'>
                        <CgGym className='me-8'/>
                        Workout Programs
                    </li>
                </NavLink>

                <NavLink to="/settings" className="w-full text-lg font-bold" activeClassName="underline">
                    <li className='w-full py-4 px-12 flex items-center hover:bg-neutral-900 text-white hover:text-white'>
                    <IoMdSettings className='me-8'/>
                        Settings
                    </li>
                </NavLink>

                <NavLink to="/login" onClick={handleLogout} className="w-full text-lg font-bold" activeClassName="underline">
                    <li className='w-full py-4 px-12 flex items-center hover:bg-neutral-900 text-red-400 hover:text-red-700'>
                    <PiSignOutBold className='me-8'/>
                        Sign Out
                    </li>
                </NavLink>

            </ul>
        </div >
    )
}

export default DesktopMenu
