import React, { useEffect } from 'react';

const Switch = () => {
    useEffect(() => {
        document.documentElement.classList.remove('light');
    }, []);

    const toggleTheme = (e) => {
        if (e.target.checked) {
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.remove('light');
        }
    };

    return (
        <label className="relative  inline-flex items-center cursor-pointer rounded-full">
            <input type="checkbox" className="sr-only peer" onChange={toggleTheme} />
            {/* switch circle */}
            <div className="group border border-[#62626C] peer ring-0 bg-[#343645] rounded-full outline-none duration-300 after:duration-300 w-14 h-7 shadow-[0_0_10px_rgba(168,85,247,0.6)] peer-checked:shadow-none peer-checked:bg-gray-300 peer-checked:border-white peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:bg-[#626575] after:outline-none after:h-[22px] after:w-[22px] after:top-[3px] after:left-[3px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-7 peer-checked:after:bg-[#fff] peer-hover:after:scale-95">

                {/* Moon icon — visible in dark mode (right side) */}
                <svg className="absolute text-white/30 top-[3px] right-[3px] w-[22px] h-[22px]"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" fillRule="evenodd" clipRule="evenodd"
                        d="M12.5 3a9 9 0 0 0 0 18c2.27 0 4.343-.84 5.927-2.227C14.177 17.827 11 14.035 11 9.5c0-2.487.956-4.75 2.519-6.443A9.107 9.107 0 0 0 12.5 3Zm-11 9c0-6.075 4.925-11 11-11 1.214 0 2.384.197 3.478.561a1 1 0 0 1 .254 1.771A7.5 7.5 0 0 0 20.5 17a1.001 1.001 0 0 1 .8 1.6c-2.005 2.67-5.2 4.4-8.8 4.4-6.075 0-11-4.925-11-11Z" />
                </svg>

                {/* Sun icon — visible in light mode (left side) */}
                <svg className="absolute top-[3px] left-[3px] w-[22px] h-[22px]"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#ffbf66"
                        d="M7 12c0 2.8 2.2 5 5 5s5-2.2 5-5-2.2-5-5-5-5 2.2-5 5zm5-3c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm1-4V3c0-.6-.4-1-1-1s-1 .4-1 1v2c0 .6.4 1 1 1s1-.4 1-1zm6.1-.1c-.4-.4-1-.4-1.4 0l-1.4 1.4c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l1.4-1.4c.4-.3.4-1 0-1.4zM21 11h-2c-.6 0-1 .4-1 1s.4 1 1 1h2c.6 0 1-.4 1-1s-.4-1-1-1zm-3.3 5.2c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l1.4 1.4c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4l-1.4-1.4zM11 19v2c0 .6.4 1 1 1s1-.4 1-1v-2c0-.6-.4-1-1-1s-1 .4-1 1zm-6.1.1c.2.2.5.3.7.3s.5-.1.7-.3l1.4-1.4c.4-.4.4-1 0-1.4s-1-.4-1.4 0l-1.4 1.4c-.4.3-.4 1 0 1.4zM2 12c0 .6.4 1 1 1h2c.6 0 1-.4 1-1s-.4-1-1-1H3c-.6 0-1 .4-1 1zm4.3-7.1c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l1.4 1.4c.2.3.5.4.8.4s.5-.1.7-.3c.4-.4.4-1 0-1.4L6.3 4.9z" />
                </svg>

            </div>
        </label>
    );
}

export default Switch;
