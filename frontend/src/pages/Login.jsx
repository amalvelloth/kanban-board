import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Modal from "react-modal";
import { handleError, handleSuccess } from "../utils";
import Element1 from "../assets/element-1.svg";
import Element2 from "../assets/element-2.svg";
import SvgBgDesktop from "../assets/svg-bg-desktop.svg";
import SvgBgMobile from "../assets/svg-bg-mobile.svg";

function Login() {
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email and password are required.");
    }
    try {
      const url = `https://auth-mern-app-api-silk.vercel.app/auth/login`;
      console.log("Sending login request to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
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
      handleError("An unexpected error occurred. Please try again.");
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
      const url = `https://auth-mern-app-api-silk.vercel.app/auth/signup`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err);
      }
  };

  return (
    <>
      <section className="flex w-full h-screen relative overflow-hidden bg-black">
        <div className="relative flex-col p-8 w-full h-screen max-md:p-2 z-[1]">
          <div className="absolute right-1.5 top-20 -rotate-90 origin-bottom-right whitespace-nowrap">
            <h2 className="opacity-80 bg-gradient-to-r from-black to-[#999999] bg-clip-text text-transparent text-6xl sm:text-7xl font-bold">KANBAN BOARD</h2>
          </div>
          <img src={Element1} className=" w-[190px] md:w-[250px] grayscale" alt="Jogging" />
          <img src={Element2} className=" w-[130px] md:w-[190px] grayscale absolute right-0" alt="Jogging" />
          <div className="text mt-20">
            <h1 className="text-white font-extrabold w-3/4 text-5xl max-md:text-3xl max-md:text-[calc(40px+0.5vw)]">
              Visualize Your Progress
            </h1>
          </div>
          <div className="buttons flex justify-start">
            <button
              onClick={openLoginModal}
              className="rounded-3xl my-5 me-2 border border-white text-white py-2 sm:px-10 max-sm:px-4 font-bold"
            >
              Login
            </button>
            <button
              onClick={openRegisterModal}
              className="rounded-3xl my-5 ms-2 border border-white text-white py-2 sm:px-10 max-sm:px-4 font-bold"
            >
              Sign Up
            </button>
          </div>


        </div>



        <img src={SvgBgDesktop} className="w-full bottom-0 left-0 right-0 absolute z-0 blur-[50px] scale-110" alt="" />
        <img src={SvgBgMobile} className="sm:hidden w-full bottom-0 left-0 right-0 absolute z-0 blur-[30px] scale-110" alt="" />





        {/* Modal for Login */}
        <Modal
          isOpen={isLoginModalOpen}
          onRequestClose={closeLoginModal}
          contentLabel="Login Modal"
          className="modal-content z-[9999] w-full max-sm:w-4/5 max-w-md p-6 bg-white rounded-2xl transform -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2"
          overlayClassName="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
        >
          <h2 className="font-bold text-xl text-center">Login</h2>
          <button
            onClick={closeLoginModal}
            className="close-button absolute top-0 right-0 m-4 text-red-500 hover:text-gray-800"
          >
            Close
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
              onChange={handleLoginChange}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginInfo.password}
              onChange={handleLoginChange}
              className="p-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="py-2 bg-[#474747] text-white rounded"
            >
              Login
            </button>
          </form>
        </Modal>

        {/* Modal for Register */}
        <Modal
  isOpen={isRegisterModalOpen}
  onRequestClose={closeRegisterModal}
  contentLabel="Register Modal"
  className="modal-content z-[9999] w-full max-sm:w-4/5 max-w-md p-6 bg-white rounded-2xl transform -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2"
  overlayClassName="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]"
>
          <h2 className="font-bold text-xl text-center">Sign Up</h2>
          <button
            onClick={closeRegisterModal}
            className="close-button absolute top-0 right-0 m-4 text-red-500 hover:text-gray-800"
          >
            Close
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
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={signupInfo.email}
              onChange={handleRegisterChange}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={signupInfo.password}
              onChange={handleRegisterChange}
              className="p-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="py-2 bg-[#8C8C8C] text-black rounded"
            >
              Sign Up
            </button>
          </form>
        </Modal>
      </section>
      <ToastContainer
        position="top-center"
        autoClose={false}
        closeOnClick
        theme="colored"
      />
    </>
  );
}

export default Login;
