import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/admin/Adminhome";
import Login from "../pages/admin/login";
import ProList from "../pages/admin/proList";
import UserList from "../pages/admin/userList";
import Category from "../pages/admin/category";
import WithdrawReq from "../pages/admin/withdrawReq";

function admin() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listPro" element={<ProList />} />
        <Route path="/listUser" element={<UserList />} />
        <Route path="/category" element={<Category />} />
        <Route path="/withdrawReq" element={<WithdrawReq/>}/>
      </Routes>
    </div>
  );
}

export default admin;
