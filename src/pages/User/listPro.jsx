import React from 'react'
import ListPros from '../../component/user/List/listPros'
import NavBar from '../../component/user/navbar/navbar'
import Footer from '../../component/user/footer/footer'

function listPro() {
  return (
    <div>
      <NavBar/>
      <ListPros/>
      <Footer/>
    </div>
  )
}

export default listPro
