import React, { useEffect } from 'react';
import { handleThemeToast } from '../utils';
import Moon from '../assets/icons/moon.svg'

const Switch = () => {
    useEffect(() => {
        document.documentElement.classList.remove('light');
document.documentElement.classList.toggle('dark') // <html> tag
    }, []);

    const toggleTheme = (e) => {
        if (e.target.checked) {
            document.documentElement.classList.add('light');
            handleThemeToast("Light mode enabled");
        } else {
            document.documentElement.classList.remove('light');
            handleThemeToast("Dark mode enabled");
        }
    };

    return (
        <label className="relative glass-effect-1 inline-flex items-center cursor-pointer rounded-full">
            <input type="checkbox" className="sr-only peer" onChange={toggleTheme} />
            {/* switch circle */}
            <div className="group peer relative ring-0 bg-[#343645] rounded-full outline-none duration-300 w-14 h-7 shadow-[0_0_10px_rgba(168,85,247,0.6)] peer-checked:shadow-[0_0_10px_rgba(255,255,255,10)] peer-checked:bg-gray-200 peer-checked:border-white peer-focus:outline-none before:content-[''] before:absolute before:rounded-full before:bg-[#626575]/70 before:blur-lg before:h-[20px] before:w-[20px] before:top-0 before:bottom-0 before:m-auto before:left-[4px] before:transition-transform before:duration-300 peer-checked:before:translate-x-7 peer-checked:before:bg-white/80 after:content-[''] after:rounded-full after:absolute after:bg-[#626575] after:outline-none after:h-[20px] after:w-[20px] after:top-0 after:bottom-0 after:m-auto after:left-[4px] after:flex after:justify-center after:items-center after:duration-300 peer-checked:after:translate-x-7 peer-checked:after:bg-[#fff]">

                <img src={Moon} className='absolute text-white/30 top-0 bottom-0 m-auto right-1 w-[20px] h-[20px]' alt="" />

                {/* Sun icon — visible in light mode (left side) */}
                <svg className="absolute top-0 bottom-0 m-auto left-1 w-[20px] h-[20px]"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#ffbf66"
                        d="M7 12c0 2.8 2.2 5 5 5s5-2.2 5-5-2.2-5-5-5-5 2.2-5 5zm5-3c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm1-4V3c0-.6-.4-1-1-1s-1 .4-1 1v2c0 .6.4 1 1 1s1-.4 1-1zm6.1-.1c-.4-.4-1-.4-1.4 0l-1.4 1.4c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l1.4-1.4c.4-.3.4-1 0-1.4zM21 11h-2c-.6 0-1 .4-1 1s.4 1 1 1h2c.6 0 1-.4 1-1s-.4-1-1-1zm-3.3 5.2c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l1.4 1.4c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4l-1.4-1.4zM11 19v2c0 .6.4 1 1 1s1-.4 1-1v-2c0-.6-.4-1-1-1s-1 .4-1 1zm-6.1.1c.2.2.5.3.7.3s.5-.1.7-.3l1.4-1.4c.4-.4.4-1 0-1.4s-1-.4-1.4 0l-1.4 1.4c-.4.3-.4 1 0 1.4zM2 12c0 .6.4 1 1 1h2c.6 0 1-.4 1-1s-.4-1-1-1H3c-.6 0-1 .4-1 1zm4.3-7.1c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l1.4 1.4c.2.3.5.4.8.4s.5-.1.7-.3c.4-.4.4-1 0-1.4L6.3 4.9z" />
                </svg>
            </div>
        </label>
    );
}

export default Switch;
