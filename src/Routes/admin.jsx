import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "../pages/admin/Adminhome";
import Login from "../pages/admin/login";
import ProList from "../pages/admin/proList";
import UserList from "../pages/admin/userList";
import Category from "../pages/admin/category";
import WithdrawReq from "../pages/admin/withdrawReq";
import Transactions from "../pages/admin/transactions"
import Kyc from "../pages/admin/kycVerify"
import Error from "../component/errorpage/error404"
import Error500 from "../component/errorpage/error500"
function admin() {
  const IsAuth = useSelector((state) => state.admin);
  
  return (
    <div>
      <Routes>
        <Route path="/" element={IsAuth.Token ?<Home />:<Login/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/listPro" element={IsAuth.Token ?<ProList />:<Login/>} />
        <Route path="/listUser" element={IsAuth.Token ?<UserList />:<Login/>} />
        <Route path="/category" element={IsAuth.Token ?<Category />:<Login/>} />
        <Route path="/withdrawReq" element={IsAuth.Token ?<WithdrawReq/>:<Login/>}/>
        <Route path="/transactions" element={IsAuth.Token?<Transactions/>: <Login/>}/>
        <Route path="/kycValidation" element={IsAuth.Token?<Kyc/>:<Login/>}/>
        <Route path="/serverError" element={<Error500 role={'admin'}/>}/>
        <Route path="/*" element={<Error role={'admin'}/>}/>

      </Routes>
    </div>
  );
}

export default admin;
