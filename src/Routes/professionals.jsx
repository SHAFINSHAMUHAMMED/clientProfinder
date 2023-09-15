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
import Error from "../component/errorpage/error404"
import Error500 from "../component/errorpage/error500"

function professionals() {
  const IsAuth = useSelector((state) => state.professional);
  return (
    <div>
      <Routes>
        <Route path="/" element={<ProHome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={IsAuth.Token?<ProHome/>:<Login />} />
        <Route path="/loginOtp" element={<OtpLogin />} />
        <Route path="/verifyMail/:id" element={<VerifyMail />} />
        <Route path="/jobs" element={IsAuth.Token?<Bookings/>:<Login />} />
        <Route path="/profile" element={IsAuth.Token?<Profile/>:<Login />} />
        <Route path="/chat" element={IsAuth.Token?<Chat/>:<Login />} />
        <Route path="/wallet" element={IsAuth.Token?<Wallet/>:<Login />}/>
        <Route path="/serverError" element={<Error500 role={'pro'}/>}/>
        <Route path="/*" element={<Error role={'pro'}/>}/>

      </Routes>
    </div>
  );
}

export default professionals;
