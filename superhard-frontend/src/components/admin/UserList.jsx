// src/components/admin/UsuarioList.jsx
import React, { useEffect, useState } from "react";

export default function UsuarioList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/usuarios");
        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) {
    return <p className="text-white">Cargando usuarios...</p>;
  }

  return (
    <div className="p-6 bg-neutral-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>
      <table className="min-w-full bg-neutral-800 rounded-lg overflow-hidden">
        <thead className="bg-neutral-700">
          <tr className="border-b border-gray-700">
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Nombre</th>
            <th className="py-2 px-4 text-left">Apellido</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Teléfono</th>
            <th className="py-2 px-4 text-left">Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="border-b border-neutral-700">
              <td className="py-2 px-4">{usuario.id}</td>
              <td className="py-2 px-4">{usuario.nombre}</td>
              <td className="py-2 px-4">{usuario.apellido}</td>
              <td className="py-2 px-4">{usuario.email}</td>
              <td className="py-2 px-4">{usuario.telefono}</td>
              <td className="py-2 px-4">{usuario.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
