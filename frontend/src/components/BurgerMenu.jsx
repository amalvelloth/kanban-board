import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SlGraph } from "react-icons/sl";
import { FaTasks } from "react-icons/fa";
import { CgGym } from "react-icons/cg";
import { IoMdSettings } from "react-icons/io";
import { PiSignOutBold } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../utils'


function BurgerMenu() {

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    const navigate = useNavigate();


    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(prevState => !prevState);
    };

    return (
        <>
            <label
                className="w-10 h-8 lg:hidden absolute z-50 left-3 cursor-pointer flex items-center justify-center"
                onClick={toggleMenu}
                aria-expanded={isOpen}
                aria-label="Toggle Navigation"
            >
                <div className="w-12 h-12 cursor-pointer flex flex-col items-center justify-center">
                    <input className="hidden peer" type="checkbox" checked={isOpen} onChange={toggleMenu} />
                    <div
                        className={`w-[70%] h-[2px] bg-white rounded-sm transition-all duration-300 origin-left translate-y-[0.5rem] ${isOpen ? '-rotate-45' : ''
                            }`}
                    ></div>
                    <div
                        className={`w-[70%] h-[2px] bg-white rounded-md transition-all duration-300 origin-center ${isOpen ? 'hidden' : ''
                            }`}
                    ></div>
                    <div
                        className={`w-[70%] h-[2px] bg-white rounded-md transition-all duration-300 origin-left -translate-y-[0.5rem] ${isOpen ? 'rotate-45' : ''
                            }`}
                    ></div>
                </div>
            </label>


            {/* Menu */}
            <div
                className={`absolute lg:hidden h-screen flex items-center top-0 -left-0  bg-[#000] z-10 transition-transform duration-500 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <ul className='flex flex-col items-start justify-center h-full '>

                    <NavLink
                        to="/dashboard"
                        className="w-full text-lg font-bold text-white"
                        onClick={() => setIsOpen(false)}
                        activeClassName="underline"
                    >
                        <li className='w-full py-4 px-6 flex items-center'>
                            <SlGraph className='me-8' />

                            Dashboard
                        </li>
                    </NavLink>


                    <NavLink
                        to="/taskcontrol"
                        className="w-full text-lg font-bold text-white"
                        onClick={() => setIsOpen(false)}
                        activeClassName="underline"
                    >
                        <li className='w-full py-4 px-6 flex items-center'>
                            <FaTasks className='me-8' />
                            Task Control
                        </li>
                    </NavLink>

                    <NavLink
                        to="/workoutprograms"
                        className="w-full text-lg font-bold text-white"
                        onClick={() => setIsOpen(false)}
                        activeClassName="underline"
                    >
                        <li className='w-full py-4 px-6 flex items-center'>
                            <CgGym className='me-8' />
                            Workout Programs
                        </li>
                    </NavLink>


                    <NavLink
                        to="/settings"
                        className="w-full text-lg font-bold text-white"
                        onClick={() => setIsOpen(false)}
                        activeClassName="underline"
                    >
                        <li className='w-full py-4 px-6 flex items-center'>
                            <IoMdSettings className='me-8' />
                            Settings
                        </li>
                    </NavLink>

                    <NavLink
                        to="/login"
                        className="w-full text-lg font-bold text-white"
                        activeClassName="underline"
                    >
                        <li onClick={(e) => {
                                handleLogout(e);
                                setIsOpen(false);
                            }}
                            className='w-full py-4 px-6 flex items-center text-red-500'>
                            <PiSignOutBold className='me-8' />
                            Sign Out
                        </li>
                    </NavLink>


                </ul>
            </div >
        </>

    );
}

export default BurgerMenu;
