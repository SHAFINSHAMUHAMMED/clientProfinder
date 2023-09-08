import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import Chat from "../../component/chat/chat"
import SideBar from '../../component/professionals/sidebar/sidebar'
import ProNavbar from '../../component/professionals/navBar/proNavbar'

function chat() {
  const proId = useSelector((store) => store.professional.proId);
    return (
        <div className="flex w-screen flex-col md:flex-row bg-gray-400">
            <SideBar/>
            <main className="main p-3 pt-0 w-full  h-full">
              <ProNavbar />
              <Chat  userType='pro' senderId={proId}/>
            </main>
        </div>
      )
}

export default chat