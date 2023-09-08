import React from 'react'
import NavBar from '../../component/user/navbar/navbar'
import ConfirmBooking from '../../component/user/bookingConfirm/confirmBooking'
import Footer from '../../component/user/footer/footer'

function bookingConfirm() {
  return (
    <div>
      <NavBar/>
      <ConfirmBooking/>
      <Footer/>
    </div>
  )
}

export default bookingConfirm
