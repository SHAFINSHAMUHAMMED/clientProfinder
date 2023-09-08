import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import VerifyMail from "../pages/Professionals/proVerifyMail";
import Register from "../pages/Professionals/RegisterPro";
import Login from "../pages/Professionals/prologin";
import OtpLogin from "../pages/Professionals/otpLogin";
import ProHome from "../pages/Professionals/proHome";
import Bookings from "../pages/Professionals/bookings";
import Profile from "../pages/Professionals/proProfile";
import Chat from "../pages/Professionals/chat"
import Wallet from "../pages/Professionals/wallet";

function professionals() {
  const IsAuth = useSelector((state) => state.user);

  return (
    <div>
      <Routes>
        <Route path="/" element={<ProHome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loginOtp" element={<OtpLogin />} />
        <Route path="/verifyMail/:id" element={<VerifyMail />} />
        <Route path="/jobs" element={<Bookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/wallet" element={<Wallet/>}/>

      </Routes>
    </div>
  );
}

export default professionals;
