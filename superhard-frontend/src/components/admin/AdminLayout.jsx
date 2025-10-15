// src/components/admin/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-neutral-900">
      <AdminSidebar />
      <div className="flex-1 min-h-screen bg-neutral-900 p-6 overflow-y-auto text-white border-l border-neutral-700">
        <Outlet />
      </div>
    </div>
  );
}
