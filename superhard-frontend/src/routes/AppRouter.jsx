import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../components/pages/Home';
import Login from '../components/pages/Login';
import Header from '../components/Header';
import ShoppingCart from '../components/pages/ShoppingCart';
import ProductDetails from '../components/pages/ProductDetails';
import Footer from '../components/Footer';


const AppRouter = () => {
  return (
    <Router>
      <Header />


    <div className="flex flex-col h-100% w-100%  bflex flex-col min-h-screen bg-[#494949] text-whiteg-neutral-900 text-white">
      <main className="flex-grow">
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/shopping-cart' element={<ShoppingCart />} />
            <Route path='/product/:id' element={<ProductDetails />} />
            <Route path='/login' element={<Login />} />
        </Routes>
      </main>
    </div>

       <Footer />
    </Router>
  )
}

export default AppRouter