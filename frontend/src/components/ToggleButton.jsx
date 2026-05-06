import React, { useEffect } from 'react';
import { handleThemeToast } from '../utils';
import Moon from '../assets/icons/moon.svg'
import Sun from '../assets/icons/sun.svg'

const Switch = () => {
    useEffect(() => {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    }, []);

    const toggleTheme = (e) => {
        if (e.target.checked) {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
            handleThemeToast("Light mode enabled");
        } else {
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            handleThemeToast("Dark mode enabled");
        }
    };

    return (
        <label className="relative glass-effect-1 inline-flex items-center cursor-pointer rounded-full">
            <input type="checkbox" className="sr-only peer" onChange={toggleTheme} />
            {/* switch circle */}
            <div className="group peer relative ring-0 bg-[#343645] rounded-full outline-none duration-300 w-14 h-7 shadow-[0_0_10px_rgba(168,85,247,0.6)] peer-checked:shadow-[0_0_10px_rgba(255,255,255,10)] peer-checked:bg-gray-200 peer-checked:border-white peer-focus:outline-none before:content-[''] before:absolute before:rounded-full before:bg-[#626575]/70 before:blur-lg before:h-[20px] before:w-[20px] before:top-0 before:bottom-0 before:m-auto before:left-[4px] before:transition-transform before:duration-300 peer-checked:before:translate-x-7 peer-checked:before:bg-white/80 after:content-[''] after:rounded-full after:absolute after:bg-[#626575] after:outline-none after:h-[20px] after:w-[20px] after:top-0 after:bottom-0 after:m-auto after:left-[4px] after:flex after:justify-center after:items-center after:duration-300 peer-checked:after:translate-x-7 peer-checked:after:bg-[#fff]">

                <img src={Moon} className='select-none pointer-events-none absolute text-white/30 top-0 bottom-0 m-auto right-1 w-[20px] h-[20px]' alt="" />
                <img src={Sun} className='select-none pointer-events-none absolute top-0 bottom-0 m-auto left-1 w-[20px] h-[20px]' alt="" />
                
            </div>
        </label>
    );
}

export default Switch;
