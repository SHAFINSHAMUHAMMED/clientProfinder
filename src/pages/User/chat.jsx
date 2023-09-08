import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import NavBar from '../../component/user/navbar/navbar'
import Footer from '../../component/user/footer/footer'
import Chat from '../../component/chat/chat'
function chat() { 
 const userid = useSelector((state) => state.user.Id);
  return (
    <div>
      <NavBar/>
      <Chat userType='user' senderId={userid}/>
      <Footer/>
    </div>
  )
}

export default chat
