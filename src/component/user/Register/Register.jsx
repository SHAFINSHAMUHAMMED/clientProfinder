import React, { useState, useRef } from "react";
import userAxiosInstance from "../../../Axios/userAxios";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";

function UserRegister() {
  const Nameref = useRef();
  const Emailref = useRef();
  const Phoneref = useRef();
  const Passwordref = useRef();

  const navigate = useNavigate();
  const setErrMsg = (err) => toast.error(err, { position: "bottom-center" });
  const setSucMsg = (ok) => toast.success(ok, { position: "bottom-center" });
  const userAxios = userAxiosInstance();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signUpForm = async (event) => {
    event.preventDefault();
    const name = Nameref.current.value;
    const email = Emailref.current.value;
    const phone = Phoneref.current.value;
    const password = Passwordref.current.value;

    // Validation
    if (!name || name.trim().length < 4) {
      setErrMsg("Enter Valid Name.");
      return;
    }

    if (!email || email.trim().length < 5) {
      setErrMsg("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrMsg("Invalid email format.");
      return;
    }

    if (!phone || !/^\d{10}$/.test(phone.toString().trim())) {
      setErrMsg("Phone must be a 10-digit number.");
      return;
    }

    if (!password || password.toString().trim().length < 6) {
      setErrMsg("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const response = await userAxios.post("/register", {
        name,
        email,
        phone,
        password,
      });

      if (response.data.status) {
        setSucMsg(response.data.message);
        navigate("/login", {
          state: { successMessage: response.data.message },
        });
      } else {
        setErrMsg(response.data.message);
      }
    } catch (error) {
      console.error("Error registering:", error);
      setErrMsg("An error occurred while registering.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="h-3/5 w-3/5 md:flex">
        <Toaster position="top-center" reverseOrder={false}></Toaster>
        <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
          <form method="POST" onSubmit={signUpForm} className="bg-white">
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
              Hey there!
            </h1>
            <p className="text-sm font-normal text-gray-600 mb-7">
              Create Your Account Now
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
                ref={Nameref}
                type="text"
                name="Name"
                id=""
                placeholder="Your Name"
              />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="1em"
                height="1em"
                style={{ fill: "gray" }}
              >
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
              </svg>
              <input
                className="pl-2 outline-none border-none"
                ref={Emailref}
                type="text"
                name="email"
                id=""
                placeholder="Your Email"
              />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg
                aria-hidden="true"
                focusable="false"
                className="icon "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="1em"
                height="1em"
                style={{ transform: "rotate(90deg)", fill: "gray" }}
              >
                <path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z" />
              </svg>
              <input
                className="pl-2 outline-none border-none"
                ref={Phoneref}
                type="text"
                name="phone"
                id=""
                placeholder="Your Phone Number"
              />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
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
                ref={Passwordref}
                type="password"
                name="password"
                id=""
                placeholder="Enter Your Password"
              />
            </div>
            <button
              type="submit"
              name="Signup"
              className=" w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2 flex justify-center"
              disabled={loading} // Disable the button while loading
            >
              {loading ? (
                <CgSpinner
                  size={20}
                  className="animate-spin flex justify-center"
                /> // Show spinner if loading
              ) : (
                "Register"
              )}
            </button>
            <Link
              to={"/login"}
              className="text-sm ml-2 hover:text-blue-500 cursor-pointer"
            >
              I am Already A Member
            </Link>
          </form>
        </div>
        <div
          style={{ backgroundRepeat: "" }}
          className={`relative overflow-hidden md:flex w-1/2 bg-[url('/register/background.png')] bg-repeat-round  justify-around items-center hidden`}
        >
          {/* Text inside  */}
        </div>
      </div>
    </div>
  );
}
export default UserRegister;
