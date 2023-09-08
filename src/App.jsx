import {React } from 'react'
import {BrowserRouter as Router,Routes,Route}from 'react-router-dom'
import UserRoute from './Routes/user'
import ProfessionalsRoute from './Routes/professionals'
import AdminRoute from './Routes/admin'
import './App.css'
function App() {

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/*' element={<UserRoute />}/>
          <Route path='/professional/*' element={<ProfessionalsRoute/>}/>
          <Route path='/admin/*' element={<AdminRoute/>}/>

          
        </Routes>
      </Router>

    </div>
  )
}

export default App
