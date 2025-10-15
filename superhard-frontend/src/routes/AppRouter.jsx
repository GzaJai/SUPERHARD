import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/pages/Home";
import Products from "../components/pages/Products";
import Login from "../components/pages/Login";
import ShoppingCart from "../components/pages/ShoppingCart";
import ProductDetails from "../components/pages/ProductDetails";
import AdminLayout from "../components/admin/AdminLayout";
import ProductList from "../components/admin/ProductList";
import ProductForm from "../components/admin/ProductForm";
import UserList from "../components/admin/UserList";
import PublicLayout from "../layouts/PublicLayout";

export default function AppRouter({ user, setUser }) {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-neutral-900 text-white">

        {/* Contenido principal */}
        <main className="flex-grow">
          <Routes>
            <Route element={<PublicLayout user={user} setUser={setUser} />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/shopping-cart" element={<ShoppingCart />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
            </Route>
            {/* Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="products" element={<ProductList />} />
              <Route path="add" element={<ProductForm />} />
              <Route path="edit/:id" element={<ProductForm/>} />
              <Route path="users" element={<UserList />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}
