import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/pages/Home";
import Login from "../components/pages/Login";
import Header from "../components/Header";
import ShoppingCart from "../components/pages/ShoppingCart";
import ProductDetails from "../components/pages/ProductDetails";

// Importamos el panel admin
import AdminLayout from "../components/admin/AdminLayout";
import ProductList from "../components/admin/ProductList";
import ProductForm from "../components/admin/ProductForm";
import UserList from "../components/admin/UserList";

export default function AppRouter({ user, setUser }) {
  return (
    <Router>
      <Routes>
        {/* Rutas principales del sitio */}
        <Route element={<Header user={user} setUser={setUser} />}>
          <Route path="/" element={<Home />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Route>

        {/* Login */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Rutas del panel de administración */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="products" element={<ProductList />} />
          <Route path="add" element={<ProductForm />} />
          <Route path="users" element={<UserList />} /> 
        </Route>
      </Routes>
    </Router>
  );
}


