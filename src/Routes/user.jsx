import React,{useEffect} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Userlogin from "../pages/User/userlogin";
import UserHome from "../pages/User/userHome";
import UserRegister from "../pages/User/Register";
import VerifyMail from "../pages/User/verifyMail";
import OtpLogin from "../pages/User/otpLogin";
import Service from "../pages/User/listPro";
import ProProfile from "../pages/User/proProfile";
import ConfirmBooking from "../pages/User/bookingConfirm";
import UserProfile from "../pages/User/userProfile";
import Chat from "../pages/User/chat"
import Wallet from "../pages/User/wallet"
function UserRoutes() {
  const IsAuth = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!IsAuth.Token && !window.location.pathname.includes("/register") && !window.location.pathname.includes("/login")) {
      navigate("/");
    }
  }, [IsAuth.Token, navigate]);

  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={IsAuth.Token ? <UserHome /> : <Userlogin />}
        />
        <Route path="/" element={<UserHome />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/verifyMail/:id" element={<VerifyMail />} />
        <Route path="/loginOtp" element={<OtpLogin />} />
        <Route path="/Services" element={IsAuth.Token?<Service />:<UserHome/>} />
        <Route path="/connect" element={IsAuth.Token?<ProProfile />:<UserHome/>} />
        <Route path="/confirmBooking" element={IsAuth.Token?<ConfirmBooking />:<UserHome/>} />
        <Route path="/profile" element={IsAuth.Token?<UserProfile />:<UserHome/>} />
        <Route path="/chat" element={IsAuth.Token?<Chat userRole="user"/>:<UserHome/>} />
        <Route path="/wallet" element={IsAuth.Token?<Wallet userRole="user" />:<UserHome/>} />

      </Routes>
    </div>
  );
}

export default UserRoutes;
