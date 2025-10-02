import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../components/pages/Home';
import Login from '../components/pages/Login';
import Header from '../components/Header';


export default function AppRouter({user, setUser}) {
  return (
    <Router>
      <Routes>
        <Route element={<Header user={user} setUser={setUser}/>}>
          <Route path='/' element={<Home />} />
        </Route>


        <Route path='/login' element={<Login setUser={setUser} />} />
      </Routes>
    </Router>
  )
}

