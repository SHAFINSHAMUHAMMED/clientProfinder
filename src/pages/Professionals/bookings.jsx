import React from 'react'
import Bookings from "../../component/professionals/bookings/booking"
import SideBar from '../../component/professionals/sidebar/sidebar'
import ProNavbar from '../../component/professionals/navBar/proNavbar'
export default function proBookings() {
  return (
    <div className="flex w-screen flex-col md:flex-row bg-gray-400">
        <SideBar/>
        <main className="main p-3 pt-0 w-full  h-full">
          <ProNavbar />
          <Bookings/>
        </main>
    </div>
  )
}
