import React from 'react'
import LandingPage from './DashBoard/component/pages/LandingPage'
import { Routes, Route } from 'react-router-dom'

// import "./App.css"
// import NavBar from './vendorDashboard/components/NavBar'
import Login from './DashBoard/component/forms/Login'
import NotFound from './DashBoard/component/NotFounf'

const App = () => {
  return (
    <div>
      <Routes>
          <Route path='/' element = {<LandingPage />}/>
          <Route path='/*' element = {<NotFound />} />
      </Routes>
    </div>
  )
}

export default App