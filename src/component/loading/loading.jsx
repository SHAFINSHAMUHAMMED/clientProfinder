import React from 'react'
import FadeLoader from "react-spinners/FadeLoader";

function loading() {
  return (
    <div className="flex items-center justify-center h-screen">
          <FadeLoader color="#242ae8" />
        </div>
  )
}

export default loading
