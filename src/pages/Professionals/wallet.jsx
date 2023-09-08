import React from 'react'
import Wallet from '../../component/wallet/wallet'
import SideBar from '../../component/professionals/sidebar/sidebar'
import ProNavbar from '../../component/professionals/navBar/proNavbar'

export default function wallet() {
  return (
    <div className="flex w-screen flex-col md:flex-row bg-gray-400">
       <SideBar/>
       <main className="main p-3 pt-0 w-full  h-full">
          <ProNavbar />
          <Wallet role={'pro'}/>
         </main>
    </div>
  )
}