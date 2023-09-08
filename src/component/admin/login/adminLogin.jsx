import React, { useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import AdminAxiosInterceptor from "../../../Axios/adminAxios";
import { adminLogin, adminName } from "../../../Redux/adminState";

function AdminLogin() {
  const nameref = useRef();
  const passwordref = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminAxios = AdminAxiosInterceptor();
  const LoginFormSubmit = (e) => {
    e.preventDefault();
    const setTokenCookie = (token) => {
      const expiryDate = new Date();
      const expirationMinutes = 60; //expiration time in minutes
      expiryDate.setTime(expiryDate.getTime() + expirationMinutes * 60 * 1000);
      Cookies.set("token", token, { expires: expiryDate });
    };
    const generateError = (err) =>
      toast.error(err, { position: "bottom-center" });

    const email = nameref.current.value;
    const rpassword = passwordref.current.value;
    adminAxios
      .post("/login", { email, rpassword })
      .then((res) => {
        if (res.data.status == false) {
          generateError(res.data.message);
        } else {
          const token = res.data.adminSignUp.token;
          console.log(token);
          const name = res.data.adminSignUp.name;
          setTokenCookie(token);
          dispatch(adminLogin({ token: token }));
          dispatch(adminName({ name: name }));
          navigate("/admin/");
        }
      })
      .catch((error) => {
        generateError("An error occurred. Please try again.");
        console.error(error);
      });
  };

  return (
    <div className="font-sans ">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="relative min-h-screen flex flex-col sm:justify-center items-center bg-slate-800 ">
        <div className="relative sm:max-w-sm w-full">
          {/* <div className="card bg-blue-600 shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6"></div> */}
          {/* <div className="card bg-red-400 shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6"></div> */}

          <div className="relative w-full rounded-3xl backdrop-blur px-6 py-10 bg-gray-100 shadow-md">
            <label
              htmlFor=""
              className="block mt-3 text-sm text-gray-700 text-center font-semibold"
            >
              <div className="flex mt-7 items-center text-center">
                <hr className="border-gray-300 border-1 w-full rounded-md" />
                <label className="block font-medium text-sm text-gray-600 w-full">
                  Admin Login
                </label>
                <hr className="border-gray-300 border-1 w-full rounded-md" />
              </div>
            </label>
            <form
              method="#"
              action="#"
              onSubmit={LoginFormSubmit}
              className="mt-10"
            >
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  ref={nameref}
                  className="mt-1 block w-full border text-center bg-gray-200 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                />
              </div>

              <div className="mt-6">
                <input
                  ref={passwordref}
                  type="password"
                  placeholder="Enter Your password"
                  className="mt-3 block w-full border text-center bg-gray-200 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                />
              </div>

              {/* <div className="mt-7 flex"> */}
              {/* <label htmlFor="remember_me" className="inline-flex items-center w-full cursor-pointer">
                  <input
                    id="remember_me"
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    name="remember"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Recuerdame
                  </span>
                </label> */}
              {/* 
                <div className="w-full text-right">
                  <a className="underline text-sm text-gray-600 hover:text-gray-900" href="#">
                    ¿Olvidó su contraseña?
                  </a>
                </div>
              </div> */}

              <div className="mt-6">
                <button className="bg-blue-600 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">
                  Login
                </button>
              </div>

              {/* <div className="flex mt-4 justify-center w-full">
                <button
                  onClick={()=>{navigate('/proffesional/otplogin')}} className="mr-5 bg-blue-600 border-none px-4 py-2 rounded-xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105"
                >
                  OTP Login
                </button>

                <button
                  className="bg-red-500 border-none px-4 py-2 rounded-xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105"
                >
                  Google
                </button>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
