import React from 'react'
import UserHome from '../../component/user/home/userHome'
import NavBar  from '../../component/user/navbar/navbar'
import Footer from '../../component/user/footer/footer'

function userHome() {
  
  return (
    <div>
      <NavBar/>
      <UserHome/>
      <Footer/>
    </div>
  )
}

export default userHome
