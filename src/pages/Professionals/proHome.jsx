import React from 'react'
import Home from "../../component/professionals/home/proHome"
import SideBar from '../../component/professionals/sidebar/sidebar'
import ProNavbar from '../../component/professionals/navBar/proNavbar'
export default function proHome() {
  return (
    <div className="flex w-screen flex-col md:flex-row bg-gray-400">
        <SideBar/>
        <main className="main p-3 pt-0 w-full  h-full">
          <ProNavbar />
          <Home/>
        </main>
    </div>
  )
}
