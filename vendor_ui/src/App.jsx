import React from 'react'
import './App.css'
import LandingPage from './DashBoard/component/pages/LandingPage'
import { Route,Routes } from 'react-router-dom'
import NotFound from './DashBoard/component/NotFounf'

function App() {
  return (
    <div>
        <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/*" element={<NotFound/>}/>
        </Routes>
    </div>
  )
}

export default App