import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import professionalsAxiosInterceptor from "../../../Axios/professionalsAxios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import OtpInput from "otp-input-react";
import React, { useState, useRef } from "react";
import "react-phone-input-2/lib/style.css";
import { auth } from "../../../../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

function confirmationOtp({
  phone,
  bookingId,
  update,
  count,
  otps,
  Toast,
}) {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);  //////
  const [Token, setToken] = useState(null);
  const [Name, setName] = useState(null);
  const professionalsAxios = professionalsAxiosInterceptor();
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
            // Add an additional check to ensure the signup process is not already in progress
            if (!isSigningInRef.current) {
              setLoading(true);
              await sendOtp(); // Wait for onSignup to finish before clearing recaptchaVerifier
              recaptchaVerifierRef.current = null;
            }
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  async function sendOtp() {
    window.recaptchaVerifier = null; // Reset recaptchaVerifier
    setLoading(true);
    onCaptchVerify();

    const appVerifier = recaptchaVerifierRef.current;

    const formatPh = "+91" + phone;
    console.log(formatPh);
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
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Too Many Requests");
      setLoading(false);
    } finally {
      isSigningInRef.current = false; // Reset signing in the API call is finished
    }
  }

  const  onOTPVerify = async ()=> {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        if (res.user && res.user.accessToken) {
          //otp success then
          const workUpdate = await professionalsAxios.patch("/workCompleted", {
            bookingId,
          });
          if (workUpdate.status) {
            update(count + 1);
            otps(false);
            Toast.fire({
              icon: "success",
              title: "Success",
            });
          }
        } else {
          const message = "Something went wrong";
          toast.error(message);
        }
      })
      .catch((err) => {
        const message = "Invalid OTP";
        toast.error(message);
        setLoading(false);
        console.log(err);
      });
  }

  return (
    <div class="flex flex-col md:flex-row items-center justify-center h-screen m-">
      <div class="w-2/3 sm:w-3/4 md:w-3/5 lg:w-2/5">
        <section class=" flex items-center justify-center h-full">
          <div>
            <Toaster toastOptions={{ duration: 4000 }} />
            <div id="recaptcha-container"></div>
            <div class="w-96 h-96  bg-gray-300 flex flex-col gap-4 items-center rounded-lg p-4 m-10 md:m-10">
              <div class="mt-5">
                <img src="/loginpage/logo2.png" alt="Your Image" />
              </div>
              {showOTP ? (
                <>
                  <div class="bg-white text-blue-700 w-fit mx-auto p-4 rounded-full">
                    <BsFillShieldLockFill size={30} />
                  </div>
                  <label
                    htmlFor="otp"
                    class="font-bold text-xl text-white text-center"
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
                    class="opt-container ml-5 bg"
                    style={{
                      fontSize: "18px",
                      color: "blue",
                    }}
                  />
                  <button
                    onClick={onOTPVerify}
                    class="bg-blue-700 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                  >
                    {loading && (
                      <CgSpinner size={20} class="mt-1 animate-spin" />
                    )}
                    <span>Verify OTP</span>
                  </button>
                </>
              ) : (
                <>
                  <div class="bg-white text-yellow-500 w-fit mx-auto p-4 rounded-full">
                    <BsTelephoneFill size={30} />
                  </div>
                  <label
                    htmlFor=""
                    class="font-bold text-xl text-white text-center"
                  >
                    Verify user's phone number
                  </label>
                  <div class="relative">
                    <label
                      htmlFor="phone"
                      class="text-lg text-gray-700 mb-2"
                    ></label>
                    <div class="relative">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={phone}
                        className="w-full p-2 border rounded-lg text-lg text-blue-700"
                        style={{ paddingLeft: "50px" }}
                      />

                      <span
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-600"
                        style={{ zIndex: "1" }}
                      >
                        +91
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={sendOtp}
                    class="bg-blue-800 w-1/2 flex gap-1 justify-center py-2.5 text-white rounded"
                  >
                    {loading && (
                      <CgSpinner size={20} class="mt-1 animate-spin" />
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

export default confirmationOtp;
