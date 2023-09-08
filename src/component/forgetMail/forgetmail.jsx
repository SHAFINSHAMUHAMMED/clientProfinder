import React, { useState, useEffect } from "react";
import userAxiosInstance from "../../Axios/userAxios";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import Swal from "sweetalert2";

function forgetmail({ forgetPopup }) {
  const userAxios = userAxiosInstance();
  const navigate = useNavigate();
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [showSendOtp, setshowSendOtp] = useState(true);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPass, setnewPass] = useState("");
  const [showVerifyOTP, setShowVerifyOTP] = useState(false);
  const setErrMsg = (err) => toast.error(err, { position: "bottom-center" });

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setnewPass(event.target.value);
  };
  const forgotpass = (e) => {
    e.preventDefault();
    setLoading(true);
    const Email = email;
    if (!Email || Email.trim().length < 5) {
      setErrMsg("Email is required.");
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email.trim())) {
      setErrMsg("Invalid email format.");
      setLoading(false);
      return;
    }
    const otp = otpgen();
    setGeneratedOTP(otp);
    userAxios
      .post("/forgotpassword", { otp, Email })
      .then((res) => {
        if (res.data.status) {
          console.log(res.data);
          setLoading(false);
          setShowVerifyOTP(true);
          setshowSendOtp(false);
        } else {
          setErrMsg(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          console.log("Response Data:", error.response.data);
          setErrMsg(error.response.data.message);
        } else if (error.request) {
          console.log("Request Error:", error.request);
        } else {
          console.log("Error:", error.message);
        }
      });
  };
  function otpgen() {
    const min = 100000;
    const max = 999999;
    const OTP = Math.floor(Math.random() * (max - min + 1)) + min;
    return OTP;
  }
  function onOTPVerify() {
    setLoading(true);
    console.log(newPass);

    if (otp != generatedOTP) {
      setErrMsg("Invalid OTP");
      setLoading(false);
      return;
    }
    if (!newPass || newPass.toString().trim().length < 6) {
      setErrMsg("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }
    userAxios
      .patch("/changepassword", { newPass, email })
      .then((res) => {
        if (res.status) {
          setLoading(false);
          Toast.fire({
            icon: "success",
            title: " Password Updated",
          }).then(() => {
            setShowVerifyOTP(false);
            forgetPopup(false);
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          console.log("Response Data:", error.response.data);
          setErrMsg(error.response.data.message);
        } else if (error.request) {
          console.log("Request Error:", error.request);
        } else {
          console.log("Error:", error.message);
        }
      });
  }
  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      {showSendOtp && (
        <body class="antialiased bg-slate-200">
          <div class="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
            <h1 class="text-4xl font-medium">Reset password</h1>
            <p class="text-slate-500">Fill up the form to reset the password</p>

            <form action="" class="my-10" method="POST" onSubmit={forgotpass}>
              <div class="flex flex-col space-y-5">
                <label for="email">
                  <p class="font-medium text-slate-700 pb-2">Email address</p>
                  <input
                    onChange={handleEmailChange}
                    id="email"
                    name="email"
                    type="text"
                    className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                    placeholder="Enter email address"
                    value={email}
                  />
                </label>
                <button
                  type="submit"
                  class="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <CgSpinner
                      size={20}
                      className="animate-spin flex justify-center"
                    /> // Show spinner if loading
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                        />
                      </svg>

                      <span>Reset password</span>
                    </>
                  )}
                </button>
                <p class="flex">
                  Not registered yet?{" "}
                  <Link
                    to="/register"
                    class="text-indigo-600 text-sm font-medium inline-flex space-x-1 items-center"
                  >
                    Register now{" "}
                  </Link>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mt-1 ms-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </span>
                </p>
              </div>
            </form>
          </div>
        </body>
      )}
      {/* verifyotp */}
      {showVerifyOTP && (
        <div className="bg-gray-300 rounded-lg p-5">
          <label htmlFor="otp" class="font-bold m-auto text-xl text-white">
            Enter your OTP
          </label>
          <OtpInput
            value={otp}
            onChange={setOtp}
            OTPLength={6}
            otpType="number"
            disabled={false}
            autoFocus
            className="opt-container p-10 flex justify-center items-center  rounded-lg"
            style={{
              fontSize: "18px",
              color: "blue",
            }}
          />
          <div class="py-2">
            <span class="px-1 text-sm text-gray-600">New Password</span>
            <input
              value={newPass}
              onChange={handlePassword}
              placeholder=""
              type="text"
              class="text-md block px-3 py-2  rounded-lg w-full 
                bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"
            />
          </div>

          <button
            onClick={onOTPVerify}
            class="bg-blue-600 w-3/4 flex items-center justify-center m-auto py-2.5 mt-10 mb-5 text-white rounded"
          >
            {loading ? (
              <CgSpinner size={20} class="mt-1 animate-spin" />
            ) : (
              <span>Confirm</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default forgetmail;
