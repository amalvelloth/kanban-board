import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { handleSuccess } from '../utils';

function Logout({ setIsOpen }) {

     const navigate = useNavigate();
     const location = useLocation();

     if(location.pathname === '/login') return null;

    const handleLogout = async () => {
      handleSuccess("Logout successful");
      localStorage.removeItem("token")
      localStorage.removeItem("loggedInUser")
      navigate("/login");

      try {
        await fetch("https://fitplus-api.vercel.app/auth/logout", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
        });

        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        navigate("/login");

      } catch (error) {
        console.error("logout error:", error)
      }
    };


  return (
    <>
    {/* <button className='text-red-500 px-4 border border-red-500 bg-red-300/20 rounded-full' to="/login" onClick={(e) => {
    }}>
        Logout
    </button> */}
    <button className='glass-effect-1 bg-[#473a3a] !shadow-[0_0_10px_rgba(239,68,68,0.6)] [.light_&]:!shadow-none [.light_&]:bg-red-300/20 [.light_&]:border [.light_&]:border-red-500 font-rmneue text-red-500 px-4 rounded-full'
     onClick={handleLogout}>
        Logout
    </button>
    </>
  )
}

export default Logout
