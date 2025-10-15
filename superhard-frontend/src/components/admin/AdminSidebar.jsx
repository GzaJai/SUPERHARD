// src/components/admin/AdminSidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-neutral-800 text-white h-screen p-5 flex flex-col sticky top-0">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/admin/products" className="hover:bg-neutral-700 px-3 py-2 rounded">📦 Productos</Link>
        <Link to="/admin/add" className="hover:bg-neutral-700 px-3 py-2 rounded">➕ Agregar Producto</Link>
        <Link to="/admin/users" className="hover:bg-neutral-700 px-3 py-2 rounded">👥 Usuarios</Link>
      </nav>
    </div>
  );
}
