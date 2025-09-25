import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../components/pages/Home';
import Login from '../components/pages/Login';


const AppRouter = () => {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
        </Routes>
    </Router>
  )
}

export default AppRouter