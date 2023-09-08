import React from 'react'
import Wallet from '../../component/wallet/wallet'
import NavBar from '../../component/user/navbar/navbar'
import Footer from '../../component/user/footer/footer'
function wallet() {
  return (
    <div>
      <NavBar/>
      <Wallet role={'user'}/>
      <Footer/>
    </div>
  )
}

export default wallet
