import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { handleError, handleSuccess } from "../utils";
import DotGrid from "../components/DotGrid";
import Element1 from "../assets/element-1.svg";
import Element2 from "../assets/element-2.svg";
import darkModeHeroClip from "../assets/dark_hero_video.mp4";
import lightModeHeroClip from "../assets/white_hero_video.mp4";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import closeIcon from "../assets/icons/cross_icon.png"
import closeIconLight from "../assets/icons/cross_icon_light.svg"
import kb_features_1 from "../assets/kb_features_1.png"
import kb_features_2 from "../assets/kb_features_2.png"
import kb_features_3 from "../assets/kb_features_3.png"

function Login() {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [isLightMode, setIsLightMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const featureCards = [
    { id: 1, tag: "Action", title: "Drag & Drop Tasks", image: kb_features_1, tagColor: "text-purple-300/80" },
    { id: 2, tag: "Theme", title: "Light & Dark Mode", image: kb_features_2, tagColor: "text-blue-300/80" },
    { id: 3, tag: "Actions", title: "Drag to Delete", image: kb_features_3, tagColor: "text-indigo-300/80" }
  ];

  // Refs for controlling the background videos & carousel
  const darkVideoRef = useRef(null);
  const lightVideoRef = useRef(null);
  const lightVideoBlurRef = useRef(null);
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Refs for moving focus between inputs
  const loginPasswordRef = useRef(null);
  const registerEmailRef = useRef(null);
  const registerPasswordRef = useRef(null);

  // Play video from the start when theme changes
  useEffect(() => {
    if (isLightMode) {
      if (lightVideoRef.current) {
        lightVideoRef.current.currentTime = 0;
        lightVideoRef.current.play().catch(e => console.error(e));
      }
      if (lightVideoBlurRef.current) {
        lightVideoBlurRef.current.currentTime = 0;
        lightVideoBlurRef.current.play().catch(e => console.error(e));
      }
    } else {
      if (darkVideoRef.current) {
        darkVideoRef.current.currentTime = 0;
        darkVideoRef.current.play().catch(e => console.error(e));
      }
    }
  }, [isLightMode]);

  useEffect(() => {
    // Set initial state
    setIsLightMode(document.documentElement.classList.contains("light"));

    // Observe changes to the HTML class attribute to sync with ToggleButton
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsLightMode(document.documentElement.classList.contains("light"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openForgotModal = () => {
    closeLoginModal();
    setIsForgotModalOpen(true);
  };
  const closeForgotModal = () => setIsForgotModalOpen(false);

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      return handleError("Email is required");
    }
    try {
      setForgotLoading(true);
      const url = "https://fitplus-api.vercel.app/auth/forgot-password";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const result = await response.json();
      setForgotLoading(false);
      if (result.success) {
        handleSuccess(result.message || "Reset link generated!");
        closeForgotModal();
      } else {
        handleError(result.message || "Failed to process request");
      }
    } catch (err) {
      setForgotLoading(false);
      handleError("Server connection error");
    }
  };


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
      <section className="login-page flex w-full font-rmneue h-screen relative overflow-hidden bg-black">
        <DotGrid />
        <div className="relative flex-col p-8 w-full h-screen max-md:p-2 z-[2]">
          <div className="absolute right-1.5 top-20 -rotate-90 origin-bottom-right whitespace-nowrap">
            <div className="relative select-none opacity-80 text-6xl sm:text-7xl font-light">
              <h2 className="bg-gradient-to-r from-black to-[#999999] bg-clip-text text-transparent transition-opacity duration-0 ease-linear delay-300 [.light_&]:opacity-0">
                KANBAN BOARD
              </h2>
              <h2 className="absolute top-0 left-0 w-full h-full [-webkit-text-stroke:1px_#bc90e3] text-white/10 opacity-0 transition-opacity duration-0 ease-linear delay-300 [.light_&]:opacity-100">
                KANBAN BOARD
              </h2>
            </div>
          </div>
          <img src={Element1} className="select-none pointer-events-none w-[150px] md:w-[250px] mt-16 md:mt-0 animate-float aspect-square grayscale !z-[100] [.light_&]:invert transition-all duration-0 ease-linear delay-300" alt="Jogging" />
          <img src={Element2} className="select-none pointer-events-none w-[130px] md:w-[190px] mt-16 max-sm:-me-[20px] md:mt-0 animate-wiggle aspect-square grayscale !z-[100] absolute right-0 [.light_&]:invert transition-all duration-0 ease-linear delay-300" alt="Jogging" />
          <div className="wrapper pt-20 absolute inset-0 m-auto flex h-fit w-full max-w-5xl flex-col items-start md:items-center justify-center px-2">
            <p className="flex select-none items-center justify-center gap-2 md:gap-3 text-[10px] md:text-[14px] mb-4 md:mb-12 font-medium text-[#bc90e3]">
              <span>PLAN</span>
              <span className="h-[3px] md:h-1 w-[3px] md:w-1 rounded-full bg-[#bc90e3]" aria-hidden="true" />
              <span>EXECUTE</span>
              <span className="h-[3px] md:h-1 w-[3px] md:w-1 rounded-full bg-[#bc90e3]" aria-hidden="true" />
              <span>REPEAT</span>
            </p>
            <div className="relative mx-0 md:mx-auto w-3/4">
              <h1 className="font-medium text-start md:text-center font-rmneue text-7xl max-md:text-3xl max-md:text-[calc(40px+0.5vw)] ">
                <span className="select-none bg-gradient-to-b from-white to-[#c084fc] bg-clip-text text-transparent transition-opacity duration-0 ease-linear delay-300 [.light_&]:opacity-0">Visualize</span> <span className="select-none bg-gradient-to-b from-white to-[#c084fc] bg-clip-text text-transparent transition-opacity duration-0 ease-linear delay-300 [.light_&]:opacity-0">Your</span> <span className="select-none bg-gradient-to-b from-white to-[#c084fc] bg-clip-text text-transparent transition-opacity duration-0 ease-linear delay-300 [.light_&]:opacity-0">Progress</span>
              </h1>
              <h1 className="absolute top-0 left-0 w-full h-full font-medium text-start md:text-center font-rmneue text-7xl max-md:text-3xl max-md:text-[calc(40px+0.5vw)] text-[#7B6CD0] opacity-0 transition-opacity duration-0 ease-linear delay-300 [.light_&]:opacity-100 pointer-events-none">
                <span className="select-none">Visualize</span> <span className="select-none ">Your</span> <span className="select-none">Progress</span>
              </h1>
            </div>
            <p className="text-[#f8f8f8] w-3/4 select-none opacity-80 font-light font-rmneue text-start md:text-center mt-2 [.light_&]:text-[#4A4560] transition-all duration-0 ease-linear delay-300">Organize tasks, track progress, and stay focused with a visual workflow.</p>
            <div className="buttons flex gap-2 sm:gap-4 justify-center">
              <button
                onClick={openLoginModal}
                className="select-none rounded-3xl my-5 py-2 sm:px-10 max-sm:px-4 font-normal transition-all duration-0 ease-linear delay-300 text-white glass-effect-1 [.light_&]:bg-[#7B6CD0]"
              >
                Login
              </button>
              <button
                onClick={openRegisterModal}
                className="select-none rounded-3xl my-5 py-2 sm:px-10 max-sm:px-4 font-normal transition-all duration-0 ease-linear delay-300 text-white glass-effect-1 [.light_&]:bg-white [.light_&]:text-[#7B6CD0]"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Video Background Layer */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          {/* Dark Mode Video - Hidden in light mode */}
          <video
            ref={darkVideoRef}
            className="absolute inset-0 object-cover h-full w-full opacity-100 transition-opacity duration-500 delay-300 [.light_&]:opacity-0"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={darkModeHeroClip} type="video/mp4" />
          </video>

          {/* Light mode video */}
          <video
            ref={lightVideoRef}
            className="absolute inset-0 object-cover h-full w-full opacity-0 duration-500 delay-300 [.light_&]:opacity-100 blur-sm scale-[120%]"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={lightModeHeroClip} type="video/mp4" />
          </video>


        </div>
      </section>

      {/* 100% Height Black Section Below Hero */}
      <section className="w-full min-h-screen bg-black text-white p-8 md:p-16 flex flex-col justify-start items-start relative z-10 font-rmneue border-t border-white/10">
        <h2 className="text-4xl sm:text-5xl md:text-5xl font-normal text-white text-left tracking-tight">
          Get started with Kanban Board
        </h2>

        {/* Desktop 3-Grid View */}
        <div className="hidden md:grid grid-cols-3 gap-8 w-full mt-10">
          {/* Card 1 */}
          <div className="glass-effect-1 relative min-h-[420px] rounded-[32px] border border-white/15 overflow-hidden flex flex-col justify-between p-6 sm:p-8 bg-white/5 backdrop-blur-xl">
            {/* Full Card Blurred Background Image Layer */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-2xl scale-125 opacity-70 pointer-events-none"
              style={{ backgroundImage: `url(${kb_features_1})` }}
            />
            {/* Subtle Dark Vignette & Gradient for crisp text at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 z-0 pointer-events-none" />

            {/* Floating Smaller Uncropped Image Preview */}
            <div className="relative z-10 w-full flex justify-center items-center pt-4 pb-6">
              <div className="w-[90%] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/30">
                <img src={kb_features_1} alt="Drag & Drop Tasks" className="w-full h-auto block" />
              </div>
            </div>

            {/* Bottom Text Content */}
            <div className="relative z-10 text-left mt-auto">
              <p className="text-xs uppercase tracking-wider text-purple-300/80 font-medium mb-1">Action</p>
              <h3 className="text-2xl font-semibold text-white tracking-tight">Drag & Drop Tasks</h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-effect-1 relative min-h-[420px] rounded-[32px] border border-white/15 overflow-hidden flex flex-col justify-between p-6 sm:p-8 bg-white/5 backdrop-blur-xl">
            <div
              className="absolute inset-0 bg-cover bg-center blur-2xl scale-125 opacity-70 pointer-events-none"
              style={{ backgroundImage: `url(${kb_features_2})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 z-0 pointer-events-none" />

            <div className="relative z-10 w-full flex justify-center items-center pt-4 pb-6">
              <div className="w-[90%] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/30">
                <img src={kb_features_2} alt="Light & Dark Mode" className="w-full h-auto block" />
              </div>
            </div>

            <div className="relative z-10 text-left mt-auto">
              <p className="text-xs uppercase tracking-wider text-blue-300/80 font-medium mb-1">Theme</p>
              <h3 className="text-2xl font-semibold text-white tracking-tight">Light & Dark Mode</h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-effect-1 relative min-h-[420px] rounded-[32px] border border-white/15 overflow-hidden flex flex-col justify-between p-6 sm:p-8 bg-white/5 backdrop-blur-xl">
            <div
              className="absolute inset-0 bg-cover bg-center blur-2xl scale-125 opacity-70 pointer-events-none"
              style={{ backgroundImage: `url(${kb_features_3})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 z-0 pointer-events-none" />

            <div className="relative z-10 w-full flex justify-center items-center pt-4 pb-6">
              <div className="w-[90%] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/30">
                <img src={kb_features_3} alt="Drag to Delete" className="w-full h-auto block" />
              </div>
            </div>

            <div className="relative z-10 text-left mt-auto">
              <p className="text-xs uppercase tracking-wider text-indigo-300/80 font-medium mb-1">Actions</p>
              <h3 className="text-2xl font-semibold text-white tracking-tight">Drag to Delete</h3>
            </div>
          </div>
        </div>

        {/* Mobile Carousel View (Smooth sliding + Touch Swipe support) */}
        <div className="flex md:hidden flex-col items-center w-full mt-8">
          {/* Scrollable Container with Snap points */}
          <div
            ref={carouselRef}
            className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {featureCards.map((card) => (
              <div
                key={card.id}
                className="snap-center shrink-0 w-full glass-effect-1 relative min-h-[380px] rounded-[32px] border border-white/15 overflow-hidden flex flex-col justify-between p-6 bg-white/5 backdrop-blur-xl"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center blur-2xl scale-125 opacity-70 pointer-events-none"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 z-0 pointer-events-none" />

                <div className="relative z-10 w-full flex justify-center items-center pt-2 pb-4">
                  <div className="w-[95%] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/30">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-auto block"
                    />
                  </div>
                </div>

                <div className="relative z-10 text-left mt-auto">
                  <p className={`text-xs uppercase tracking-wider ${card.tagColor} font-medium mb-1`}>
                    {card.tag}
                  </p>
                  <h3 className="text-xl font-semibold text-white tracking-tight">
                    {card.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => scrollCarousel("prev")}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/50 hover:bg-white/10 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => scrollCarousel("next")}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/50 hover:bg-white/10 active:scale-95 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>


      {/* Modal for Login */}
      <Modal
        isOpen={isLoginModalOpen}
        onRequestClose={closeLoginModal}
        contentLabel="Login Modal"
        className={` ${!isLightMode ? 'glass-effect-1' : 'bg-[#f5eeff]'} select-none modal-content z-[9999] w-full max-sm:w-4/5 max-w-md p-6 backdrop-blur-2xl rounded-2xl w-fit`}
        overlayClassName="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] transition-colors duration-300 ease-in-out"
      >
        <h2 className="select-none font-semibold text-xl text-center text-white [.light_&]:text-black">Login</h2>
        <button
          onClick={closeLoginModal}
          className="select-none close-button absolute top-0 right-0 p-6 text-red-500"
        >
          <img src={closeIcon} className="w-8 h-8 pointer-events-none [.light_&]:hidden" alt="" />
          <img src={closeIconLight} className="w-8 h-8 pointer-events-none hidden [.light_&]:block" alt="" />
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                loginPasswordRef.current?.focus();
              }
            }}
            className="placeholder-gray-400 [.light_&]:placeholder-violet-300 p-2 px-4 focus:outline-none focus:border-b-[#fff]/50 [.light_&]:focus:border-b-[#7B6CD0] border-0 border-b [.light_&]:border-[#c7a9f0] text-white [.light_&]:text-black [.light_&]:text-black border-gray-300/10 rounded"
          />
          <div className="relative flex items-center">
            <input
              ref={loginPasswordRef}
              type={showLoginPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={loginInfo.password}
              onChange={handleLoginChange}
              className="placeholder-gray-400 [.light_&]:placeholder-violet-300 w-full p-2 px-4 pr-10 focus:outline-none focus:border-b-[#fff]/50 [.light_&]:focus:border-b-[#7B6CD0] border-0 border-b [.light_&]:border-[#c7a9f0] text-white [.light_&]:text-black border-gray-300/10 bg-transparent rounded"
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              className="absolute right-2 text-white/50 hover:text-white [.light_&]:text-[#B2A5F4] hover:[.light_&]:text-[#927ff3] transition-colors"
            >
              {showLoginPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loginLoading}
            className="py-2 text-sm font-semibold select-none bg-gradient-to-r from-[#A7C1EA] to-[#3A7BD5] [.light_&]:from-[#9B8BF0] [.light_&]:to-[#B2A5F4] text-[#144a97] [.light_&]:text-white rounded flex items-center justify-center"
          >
            {loginLoading ? (
              <>
                <span className="inline-block m-auto w-4 h-4 border-2 border-[#144a97] border-t-transparent rounded-full animate-spin" />
              </>
            ) : ("LOGIN")}
          </button>
        </form>
        <button
          type="button"
          onClick={openForgotModal}
          className="text-[#C4B5FD] text-sm block mx-auto mt-4 hover:text-white transition duration-300"
        >
          Forgot Password
        </button>

      </Modal>

      {/* Modal for Forgot Password */}
      <Modal
        isOpen={isForgotModalOpen}
        onRequestClose={closeForgotModal}
        contentLabel="Forgot Password Modal"
        className={`${!isLightMode ? 'glass-effect-1' : 'bg-[#F5EEFF]'} select-none modal-content z-[9999] w-full max-sm:w-4/5 max-w-md p-6 backdrop-blur-2xl rounded-2xl top-0 right-0`}
        overlayClassName="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[9998] transition-colors duration-300 ease-in-out"
      >
        <h2 className="select-none font-semibold text-xl text-center text-white [.light_&]:text-black">Forgot Password</h2>
        <p className="text-xs text-center text-neutral-400 mt-1 mb-4">Enter your email address to receive a password reset link.</p>
        <button
          onClick={closeForgotModal}
          className="select-none close-button absolute top-0 right-0 p-6 text-red-500"
        >
          <img src={closeIcon} className="w-8 h-8 pointer-events-none [.light_&]:hidden" alt="" />
          <img src={closeIconLight} className="w-8 h-8 pointer-events-none hidden [.light_&]:block" alt="" />
        </button>

        <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            className="p-2 text-sm bg-black/10 [.light_&]:bg-white border border-white/20 [.light_&]:border-purple-300 rounded text-white [.light_&]:text-black focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={forgotLoading}
            className="py-2 text-sm font-semibold select-none bg-gradient-to-r from-[#A7C1EA] to-[#3A7BD5] [.light_&]:from-[#9B8BF0] [.light_&]:to-[#B2A5F4] text-[#144a97] [.light_&]:text-white rounded flex items-center justify-center"
          >
            {forgotLoading ? (
              <span className="inline-block m-auto w-4 h-4 border-2 border-[#144a97] border-t-transparent rounded-full animate-spin" />
            ) : ("SEND RESET LINK")}
          </button>
        </form>
      </Modal>


      {/* Modal for Register */}
      <Modal
        isOpen={isRegisterModalOpen}
        onRequestClose={closeRegisterModal}
        contentLabel="Register Modal"
        className={`${!isLightMode ? 'glass-effect-1' : 'bg-[#F5EEFF]'} select-none modal-content z-[9999] w-full max-sm:w-4/5 max-w-md p-6 backdrop-blur-2xl rounded-2xl top-0 right-0`}
        overlayClassName="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[9998] transition-colors duration-300 ease-in-out"
      >
        <h2 className="select-none font-semibold select- text-xl text-center text-white [.light_&]:text-black">Create Account</h2>
        <button
          onClick={closeRegisterModal}
          className="select-none close-button absolute top-0 right-0 p-6 text-red-500"
        >
          <img src={closeIcon} className="w-8 h-8 pointer-events-none [.light_&]:hidden" alt="" />
          <img src={closeIconLight} className="w-8 h-8 pointer-events-none hidden [.light_&]:block" alt="" />
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                registerEmailRef.current?.focus();
              }
            }}
            className="select-none p-2 px-4 focus:outline-none focus:border-b-[#fff]/50 [.light_&]:placeholder-violet-300 border-0 border-b [.light_&]:border-[#c7a9f0] text-white [.light_&]:text-black border-gray-300/10 rounded"
          />
          <input
            ref={registerEmailRef}
            type="email"
            name="email"
            placeholder="Enter Email"
            value={signupInfo.email}
            onChange={handleRegisterChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                registerPasswordRef.current?.focus();
              }
            }}
            className="select-none p-2 px-4 focus:outline-none focus:border-b-[#fff]/50 [.light_&]:placeholder-violet-300 border-0 border-b [.light_&]:border-[#c7a9f0] text-white [.light_&]:text-black border-gray-300/10 rounded"
          />
          <div className="relative flex items-center">
            <input
              ref={registerPasswordRef}
              type={showSignupPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={signupInfo.password}
              onChange={handleRegisterChange}
              className="select-none w-full p-2 px-4 pr-10 focus:outline-none focus:border-b-[#fff]/50 [.light_&]:placeholder-violet-300 border-0 border-b [.light_&]:border-[#c7a9f0] text-white [.light_&]:text-black border-gray-300/10 bg-transparent rounded"
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
            className="py-2 text-sm font-semibold select-none bg-gradient-to-r from-[#A7C1EA] to-[#3A7BD5] [.light_&]:from-[#9B8BF0] [.light_&]:to-[#B2A5F4] text-[#144a97] [.light_&]:text-white rounded flex items-center justify-center"
          >
            {registerLoading ? (
              <>
                <span className="inline-block m-auto w-4 h-4 border-2 border-[#144a97] border-t-transparent rounded-full animate-spin" />
              </>
            ) : ("SIGNUP")}
          </button>
        </form>
      </Modal>
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
