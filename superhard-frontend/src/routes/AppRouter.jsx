import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../components/pages/Home';
import Login from '../components/pages/Login';
import Header from '../components/Header';
import ShoppingCart from '../components/pages/ShoppingCart';
import ProductDetails from '../components/pages/ProductDetails';
import Footer from '../components/Footer';
import Register from '../components/pages/Register';
import ForgotPassword from '../components/pages/ForgotPassword';


export default function AppRouter({user, setUser}) {
  return (
    <Router>
      <Header user={user} setUser={setUser}/>


        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/shopping-cart' element={<ShoppingCart />} />
            <Route path='/product/:id' element={<ProductDetails />} />
            <Route path='/login' element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route  path='/forgot' element= {<ForgotPassword/>}/>
        </Routes>

       <Footer />
    </Router>
  )
}

