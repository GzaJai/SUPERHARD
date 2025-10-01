import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../components/pages/Home';
import Login from '../components/pages/Login';
import Header from '../components/Header';
import ProductDetails from '../components/pages/ProductDetails';


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Header />}>
          <Route path='/' element={<Home />} />
          <Route path='/product/:id' element={<ProductDetails />} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  )
}

export default AppRouter