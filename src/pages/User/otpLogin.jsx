import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import userAxiosInteceptor from "../../Axios/userAxios";
import { useDispatch } from "react-redux";
import { userLogin, userName } from "../../Redux/userState";
import { useNavigate, Link } from "react-router-dom";

import OtpInput from "otp-input-react";
import React, { useState, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../../../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

function otpLogin() {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [Token, setToken] = useState(null);
  const [Name, setName] = useState(null);
  const userAxios = userAxiosInteceptor()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSigningInRef = useRef(false);
  const recaptchaVerifierRef = useRef(null);

  function onCaptchVerify() {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: async (response) => {
            if (!isSigningInRef.current) {
              setLoading(true);
              await onSignup(); // Wait for onSignup to finish before clearing recaptchaVerifier
              recaptchaVerifierRef.current = null;
            }
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }
  const checkPhone = async (phone) => {
    const res = await userAxios.post("/userPhone", { phone });
    return res.data;
  };
  async function onSignup() {
    window.recaptchaVerifier = null; // Reset recaptchaVerifier
    setLoading(true);
    onCaptchVerify();

    const appVerifier = recaptchaVerifierRef.current;

    const formatPh = "+91" + ph;
    if (ph.length !== 10) {
      toast.error("Phone number must be 10 digits long.");
      setLoading(false);
      return;
    }
    const findUser = await checkPhone(ph);
    if (findUser.status) {
      try {
        isSigningInRef.current = true;
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          formatPh,
          appVerifier
        );
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        setToken(findUser.token);
        setName(findUser.name);
        toast.success("OTP sent successfully!");
      } catch (error) {
        console.log(error.code);
        toast.error(error.code);
        setLoading(false);
      } finally {
        isSigningInRef.current = false; // Reset signing in the API call is finished
      }
    } else {
      toast.error(findUser.message);
      setLoading(false);
    }
  }
  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        if (res.user && res.user.accessToken) {
          setLoading(false);
          dispatch(userLogin({ token: Token }));
          dispatch(userName({ username: Name }));
          navigate("/");
        } else {
          const message = "Something went wrong";
          toast.error(message);
        }
      })
      .catch((err) => {
        const message = err.code || "Invalid OTP";
        toast.error(message);
        setLoading(false);
      });
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen m-">
      <div className="w-2/3 sm:w-3/4 md:w-2/5 mr-2 lg:w-2/5">
        <img src="/bg.png" alt="Your Image" />
      </div>
      <div className="w-2/3 sm:w-3/4 md:w-3/5 lg:w-2/5">
        <section className=" flex items-center justify-center h-full">
          <div>
            <Toaster toastOptions={{ duration: 4000 }} />
            <div id="recaptcha-container"></div>
            <div className="w-96 h-96  bg-gray-300 flex flex-col gap-4 items-center rounded-lg p-4 m-10 md:m-10">
              <div className="mt-5">
                <img src="/loginpage/logo2.png" alt="Your Image" />
              </div>
              {showOTP ? (
                <>
                  <div className="bg-white text-blue-700 w-fit mx-auto p-4 rounded-full">
                    <BsFillShieldLockFill size={30} />
                  </div>
                  <label
                    htmlFor="otp"
                    className="font-bold text-xl text-white text-center"
                  >
                    Enter your OTP
                  </label>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    OTPLength={6}
                    otpType="number"
                    disabled={false}
                    autoFocus
                    className="opt-container ml-5 bg"
                    style={{
                      fontSize: "18px",
                      color: "blue",
                    }}
                  />
                  <button
                    onClick={onOTPVerify}
                    className="bg-blue-700 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                  >
                    {loading && (
                      <CgSpinner size={20} className="mt-1 animate-spin" />
                    )}
                    <span>Verify OTP</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-white text-yellow-500 w-fit mx-auto p-4 rounded-full">
                    <BsTelephoneFill size={30} />
                  </div>
                  <label
                    htmlFor=""
                    className="font-bold text-xl text-white text-center"
                  >
                    Verify your phone number
                  </label>
                  <div className="relative">
                    <label
                      htmlFor="phone"
                      className="text-lg text-gray-700 mb-2"
                    ></label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={ph}
                        onChange={(e) => {
                          const input = e.target.value.replace(/\D/g, ""); // Remove all non-numeric characters
                          setPh(input);
                        }}
                        className="w-full p-2 border rounded-lg text-lg text-blue-700"
                        style={{ paddingLeft: "50px" }}
                        placeholder="Enter phone number"
                        maxLength={10}
                        pattern="[0-9]*"
                      />
                      <span
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-600"
                        style={{ zIndex: "1" }}
                      >
                        +91
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onSignup}
                    className="bg-blue-800 w-1/2 flex gap-1 justify-center py-2.5 text-white rounded"
                  >
                    {loading && (
                      <CgSpinner size={20} className="mt-1 animate-spin" />
                    )}
                    <span>Send OTP</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default otpLogin;
