import React from 'react'
import Profile from "../../component/professionals/proProfile/proProfile"
import SideBar from '../../component/professionals/sidebar/sidebar'
import ProNavbar from '../../component/professionals/navBar/proNavbar'
export default function proProfile() {
  return (
    <div className="flex w-screen flex-col md:flex-row bg-gray-400">
        <SideBar/>
        <main className="main p-3 pt-0 w-full  h-full">
          <ProNavbar />
          <Profile/>
        </main>
    </div>
  )
}
