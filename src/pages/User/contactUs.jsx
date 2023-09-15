import React from 'react'
import NavBar from '../../component/user/navbar/navbar'
import Footer from '../../component/user/footer/footer'

function contactUs() {
  return (
    <>   <NavBar/>
    <div className='p-5 sm:p-24'>
      <h1 className='text-center text-4xl font-semibold text-blue-700'>Contact Us</h1>
      <div className='sm:w-1/2 m-auto'>

      <img src="/contactus.png" alt=""/>
      </div>
      <div className='sm:flex gap-10 text-center justify-center'>
        <div>
            <h2 className='text-xl text-blue-600 font-semibold font-mono'>contact</h2>
            <h2 className='font-normal text-blue-700'>profinder@pro.com</h2>
            <h2 className='font-normal text-blue-700'>7899877899</h2>
        </div>
        <div>
            <h2 className='text-xl text-blue-600 font-semibold font-mono mt-4 sm:mt-0'>Based In</h2>
            <h2 className='font-normal text-blue-700'>Kakkancheri</h2>
            <h2 className='font-normal text-blue-700'>Malappuram,Kerala</h2>
        </div>
        <div className='flex justify-center gap-3 items-center mt-4 sm:mt-0'>
  <a href="https://www.facebook.com">
    <img src="/icons/Facebook.png" alt="Facebook" className='w-6 h-6 sm:w-8 sm:h-8' />
  </a>
  <a href="https://www.instagram.com">
    <img src="/icons/Instagram.png" alt="Instagram" className='w-6 h-6 sm:w-8 sm:h-8'/>
  </a>
  <a href="https://twitter.com">
    <img src="/icons/Twitter.png" alt="Twitter" className='w-6 h-6 sm:w-8 sm:h-8' />
  </a>
</div>

      </div>
    </div>
    <Footer/>
    </> 
  )
}

export default contactUs
