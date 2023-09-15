import React, { useState, useRef } from "react";
import userAxiosInstance from "../../../Axios/userAxios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogin, userName, userId } from "../../../Redux/userState";
import { Toaster, toast } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { decodeJwt } from "jose";
import Cookies from "js-cookie";
import ForgetOtp from "../../forgetMail/forgetmail"
function login() {
  const userNameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userAxios = userAxiosInstance()
  const setErrMsg = (err) => toast.error(err, { position: "bottom-center" });
  const setSucMsg = (ok) => toast.success(ok, { position: "bottom-center" });
  const [forgetPopup, setforgetPopup] = useState(false)
  const successMessage = location.state?.successMessage || "";
  const setTokenCookie = (token) => {
    const expiryDate = new Date();
    const expirationMinutes = 48; //expiration time in minutes
    expiryDate.setTime(expiryDate.getTime() + expirationMinutes * 60 * 1000);
    Cookies.set("token", token, { expires: expiryDate });
  };
  const LoginWithGoogle = (payload) => {
    userAxios.post("/loginGoogle", { payload }).then((res) => {
      const result = res.data.userSignUp;
      if (result.Status) {
        const token = result.token;
        const user = result.name;
        const id = result.id;
        setTokenCookie(token);
        dispatch(userLogin({ token: token }));
        dispatch(userName({ username: user }));
        dispatch(userId({ id: id }));
        navigate("/");
      } else {
        const message = result.message;
        setErrMsg(message);
      }
    });
  };
    const forgotPopup = ()=>{
      setforgetPopup(true)
    }
  const Loginform = (e) => {
    e.preventDefault();
    const email = userNameRef.current.value;
    const password = passwordRef.current.value;
    userAxios.post("/login", { email, password }).then((res) => {
      const result = res.data.userSignUp;
      if (result.Status) {
        const token = result.token;
        const user = result.name;
        const id = result.id;
        setTokenCookie(token);
        dispatch(userLogin({ token: token }));
        dispatch(userName({ username: user }));
        dispatch(userId({ id: id }));
        navigate("/");
      } else {
        const message = result.message;
        setErrMsg(message);
      }
    });
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="h-3/5 w-3/5 md:flex">
        <div
          style={{ backgroundRepeat: "" }}
          className={`relative overflow-hidden md:flex w-1/2 bg-[url('/bg.png')] mr-5 bg-repeat-round  justify-around items-center hidden`}
        >
          {/* Text inside  */}
          {/* <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
		<div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
		<div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
		<div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div> */}
        </div>
        <div className="flex md:w-1/2 justify-center ml-5 py-10 items-center bg-white">
          <form method="POST" onSubmit={Loginform} className="bg-white">
            <div>
              <h3 className="text-green-700 text-sm sm:text-lg font-semibold mb-5">
                {successMessage}
              </h3>
            </div>

            <h1 className="text-gray-800 font-bold text-2xl mb-1">
              Hello Again!
            </h1>
            <p className="text-sm font-normal text-gray-600 mb-7">
              Welcome Back
            </p>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                className="pl-2 outline-none border-none"
                ref={userNameRef}
                type="text"
                name="userName"
                id=""
                placeholder="User Name"
              />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                className="pl-2 outline-none border-none"
                ref={passwordRef}
                type="password"
                name=""
                id=""
                placeholder="Password"
              />
            </div>
            <button
              type="submit"
              name="signin"
              className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl mb-1 text-white font-semibold"
            >
              Login
            </button>
            <div onClick={forgotPopup} className="mb-2 text-right">
              Forgot Password
            </div>
            <div className="mb-2 text-right">
            <button
              type="button" // Change to "button" type
              onClick={() => navigate("/loginOtp")} // Navigate to /loginOtp on click
              className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl mb-1 text-white font-semibold"

            >
              OTP Login
            </button>
            </div>

            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const { credential } = credentialResponse;
                const payload = credential ? decodeJwt(credential) : undefined;
                if (payload) {
                  LoginWithGoogle(payload);
                }
              }}
              onError={(error) => console.log(error)}
              useOneTap
            />
            <div className="mt-5">
              <Link
                to={"/register"}
                className="text-sm ml-24  hover:text-blue-500 cursor-pointer"
              >
                Create New Acoount
              </Link>
            </div>
          </form>
        </div>
      </div>
      {forgetPopup && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-md">
          <div className="z-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
            <ForgetOtp forgetPopup={setforgetPopup} />
            <button
              onClick={() => setforgetPopup(false)}
              className="absolute top-0 right-0 m-4 text-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default login;
