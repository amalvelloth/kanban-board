import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { handleError, handleSuccess } from "../utils";
import DotGrid from "../components/DotGrid";
import Element1 from "../assets/element-1.svg";
import Element2 from "../assets/element-2.svg";
import darkModeHeroClip from "../assets/dark_hero_video.mp4";
import lightModeHeroClip from "../assets/white_hero_video.mp4";
import { Eye, EyeOff } from "lucide-react";
import closeIcon from "../assets/icons/cross_icon.png"

function Login() {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };

  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email and password are required.");
    }
    try {
      setLoginLoading(true);
      const url = `https://fitplus-api.vercel.app/auth/login`;
      console.log("Sending login request to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log("Login status:", response.status);
      console.log("Login response:", result);

      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => {
          navigate("/taskcontrol");
        }, 1000);
      } else if (error) {
        handleError(error?.details?.[0]?.message || "Unknown error occurred.");
      } else {
        handleError(message);
      }
    } catch (err) {
      console.error("Login error:", err);
      handleError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError("name, email and password are required");
    }
    try {
      setRegisterLoading(true);
      const url = `https://fitplus-api.vercel.app/auth/signup`;
      console.log("Sending signup request to:", url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      const result = await response.json();
      console.log("Signup status:", response.status);
      console.log("Signup response:", result);
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details?.[0]?.message;
        handleError(details || message || "Signup failed.");
      } else if (!success) {
        handleError(message || "Signup failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      handleError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <>
      <section className="flex w-full font-rmneue h-screen relative overflow-hidden bg-black">
        <DotGrid />
        <div className="relative flex-col p-8 w-full h-screen max-md:p-2 z-[2]">
          <div className="absolute right-1.5 top-20 -rotate-90 origin-bottom-right whitespace-nowrap">
            <h2 className="select-none opacity-80 bg-gradient-to-r from-black to-[#999999] bg-clip-text text-transparent text-6xl sm:text-7xl font-bold">KANBAN BOARD</h2>
          </div>
          <img src={Element1} className="select-none pointer-events-none w-[150px] md:w-[250px] mt-16 md:mt-0 animate-float aspect-square grayscale !z-[100]" alt="Jogging" />
          <img src={Element2} className="select-none pointer-events-none w-[130px] md:w-[190px] mt-16 max-sm:-me-[20px] md:mt-0 animate-wiggle aspect-square grayscale !z-[100] absolute right-0" alt="Jogging" />
          <div className="wrapper pt-20 absolute inset-0 m-auto flex h-fit w-full max-w-5xl flex-col items-start md:items-center justify-center px-2">
            <p className="flex select-none items-center justify-center gap-2 md:gap-3 text-[10px] md:text-[14px] mb-4 md:mb-12 font-medium text-[#bc90e3]">
              <span>PLAN</span>
              <span className="h-[3px] md:h-1 w-[3px] md:w-1 rounded-full bg-[#bc90e3]" aria-hidden="true" />
              <span>EXECUTE</span>
              <span className="h-[3px] md:h-1 w-[3px] md:w-1 rounded-full bg-[#bc90e3]" aria-hidden="true" />
              <span>REPEAT</span>
            </p>
            <h1 className="bg-gradient-to-b from-white to-[#c084fc] bg-clip-text text-transparent font-medium text-start md:text-center mx-0 md:mx-auto font-rmneue w-3/4 text-7xl max-md:text-3xl max-md:text-[calc(40px+0.5vw)]">
              <span className="select-none bg-gradient-to-b from-white to-[#c084fc] bg-clip-text text-transparent">Visualize</span> <span className="select-none bg-gradient-to-b from-white to-[#c084fc] bg-clip-text text-transparent">Your</span> <span className="select-none bg-gradient-to-b from-white to-[#c084fc] bg-clip-text text-transparent">Progress</span>
            </h1>
            <p className="!text-[#f8f8f8] select-none opacity-80 font-light font-rmneue text-start md:text-center mt-2">Organize tasks, track progress, and stay focused with a visual workflow.</p>
            <div className="buttons flex gap-2 sm:gap-4 justify-center">
              <button
                onClick={openLoginModal}
                className="select-none rounded-3xl glass-effect-1 my-5 text-white py-2 sm:px-10 max-sm:px-4 font-normal"
              >
                Login
              </button>
              <button
                onClick={openRegisterModal}
                className="select-none rounded-3xl glass-effect-1 my-5 text-white py-2 sm:px-10 max-sm:px-4 font-normal"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>



        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          {/* Dark mode video */}
          {/* Dark Mode Video - Hidden in light mode */}
          <video className="object-cover h-full w-full opacity-100 [.light_&]:hidden"
            autoPlay
            muted
            loop
            playsInline
          >
      

          {/* Light mode video */}
          <video 
            className="object-cover h-full w-full opacity-100 hidden [.light_&]:block"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={lightModeHeroClip} type="video/mp4" />
          </video>      <source src={darkModeHeroClip} type="video/mp4" />
          </video>

          {/* Light Mode Video - Hidden by default, block in light mode */}
          <video
            className="object-cover h-full w-full opacity-100 hidden [.light_&]:block blur-sm scale-[120%]"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={lightModeHeroClip} type="video/mp4" />
          </video>
        </div>



        {/* Modal for Login */}
        <Modal
          isOpen={isLoginModalOpen}
          onRequestClose={closeLoginModal}
          contentLabel="Login Modal"
          className="glass-effect-1 modal-content z-[9999] w-full max-sm:w-4/5 max-w-md p-6 backdrop-blur-2xl rounded-2xl w-fit"
          overlayClassName="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] transition-colors duration-300 ease-in-out"
        >
          <h2 className="select-none font-semibold text-xl text-center text-white">Login</h2>
          <button
            onClick={closeLoginModal}
            className="select-none close-button absolute top-0 right-0 p-6 text-red-500"
          >
            <img src={closeIcon} className="w-8 h-8 pointer-events-none" alt="" />
          </button>
          <form
            onSubmit={handleLoginSubmit}
            className="flex flex-col gap-4 mt-4"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginInfo.email}
              onFocus={(e) => e.target.setSelectionRange(0, 0)}
              onChange={handleLoginChange}
              className="p-2 px-4 focus:outline-none focus:border-b-[#fff]/50 border-0 border-b text-white border-gray-300/10 rounded"
            />
            <div className="relative flex items-center">
              <input
                type={showLoginPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={loginInfo.password}
                onChange={handleLoginChange}
                className="w-full p-2 px-4 pr-10 focus:outline-none focus:border-b-[#fff]/50 border-0 border-b text-white border-gray-300/10 bg-transparent rounded"
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute right-2 text-white/50 hover:text-white transition-colors"
              >
                {showLoginPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="py-2 text-sm font-semibold select-none bg-gradient-to-r from-[#A7C1EA] to-[#3A7BD5] text-[#144a97] rounded flex items-center justify-center"
            >
              {loginLoading ? (
                <>
                  <span className="inline-block m-auto w-4 h-4 border-2 border-[#144a97] border-t-transparent rounded-full animate-spin" />
                </>
              ) : ("LOGIN")}
            </button>
          </form>
        </Modal>

        {/* Modal for Register */}
        <Modal
          isOpen={isRegisterModalOpen}
          onRequestClose={closeRegisterModal}
          contentLabel="Register Modal"
          className="glass-effect-1 modal-content z-[9999] w-full max-sm:w-4/5 max-w-md p-6 backdrop-blur-2xl rounded-2xl top-0 right-0"
          overlayClassName="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[9998] transition-colors duration-300 ease-in-out"
        >
          <h2 className="select-none font-semibold select- text-xl text-center text-white">Sign Up</h2>
          <button
            onClick={closeRegisterModal}
            className="select-none close-button absolute top-0 right-0 p-6 text-red-500"
          >
            <img src={closeIcon} className="w-8 h-8 hidden" alt="" />
          </button>
          <form
            onSubmit={handleRegisterSubmit}
            className="flex flex-col gap-4 mt-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={signupInfo.name}
              onChange={handleRegisterChange}
              className="p-2 px-4 focus:outline-none focus:border-b-[#fff]/50 border-0 border-b text-white border-gray-300/10 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={signupInfo.email}
              onChange={handleRegisterChange}
              className="p-2 px-4 focus:outline-none focus:border-b-[#fff]/50 border-0 border-b text-white border-gray-300/10 rounded"
            />
            <div className="relative flex items-center">
              <input
                type={showSignupPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={signupInfo.password}
                onChange={handleRegisterChange}
                className="w-full p-2 px-4 pr-10 focus:outline-none focus:border-b-[#fff]/50 border-0 border-b text-white border-gray-300/10 bg-transparent rounded"
              />
              <button
                type="button"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
                className="absolute right-2 text-white/50 hover:text-white transition-colors"
              >
                {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={registerLoading}
              className="py-2 text-sm font-semibold select-none bg-gradient-to-r from-[#A7C1EA] to-[#3A7BD5] text-[#144a97] rounded flex items-center justify-center"
            >
              {registerLoading ? (
                <>
                  <span className="inline-block m-auto w-4 h-4 border-2 border-[#144a97] border-t-transparent rounded-full animate-spin" />
                </>
              ) : ("SIGNUP")}
            </button>
          </form>
        </Modal>


      </section>
      {/* <ToastContainer
        position="top-center"
        autoClose={false}
        closeOnClick
        theme="colored"
      /> */}
    </>
  );
}

export default Login;
