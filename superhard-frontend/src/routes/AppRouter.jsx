import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../components/pages/Home';
import Login from '../components/pages/Login';
import ShoppingCart from '../components/pages/ShoppingCart';
import ProductDetails from '../components/pages/ProductDetails';
import Register from '../components/pages/Register';
import ForgotPassword from '../components/pages/ForgotPassword';
import BuyPage from '../components/pages/BuyPage';
import OrderSummary from '../components/pages/OrderSummary';
import Products from "../components/pages/Products";
import AdminLayout from "../components/admin/AdminLayout";
import ProductList from "../components/admin/ProductList";
import ProductForm from "../components/admin/ProductForm";
import UserList from "../components/admin/UserList";
import PublicLayout from "../layouts/PublicLayout";
import SalesList from "../components/admin/SalesList";
import BuildPC from "../components/pages/BuildPC";
import FAQ from "../components/pages/FAQ";
import Sucursales from "../components/pages/Sucursales";
import Contact from "../components/pages/Contact";
import TrabajaConNosotros from "../components/pages/TrabajaConNosotros";

export default function AppRouter({ user, setUser }) {
  return (
    <Router>
          <Routes>
            <Route element={<PublicLayout user={user} setUser={setUser} />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/shopping-cart" element={<ShoppingCart />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />
              <Route path='/forgot' element={<ForgotPassword />} />
              <Route path='/buy' element={<BuyPage />} />
              <Route path='/order-summary' element={<OrderSummary />} />
              <Route path="/build-pc" element={<BuildPC />} />
              <Route path="/faq" element={<FAQ />} />
              <Route  path="/sucursales" element={<Sucursales/>} />
              <Route path="/contact" element={<Contact/>} />
              <Route path="/trabajo" element={<TrabajaConNosotros/>} />
            </Route>
            
            {/* Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="products" element={<ProductList />} />
              <Route path="add" element={<ProductForm />} />
              <Route path="edit/:id" element={<ProductForm/>} />
              <Route path="users" element={<UserList />} />
              <Route path="sales" element={<SalesList />} />

            </Route>
          </Routes>
    </Router>
  );
}
