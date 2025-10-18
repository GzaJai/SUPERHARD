import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function ProductList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/productos");
        const data = await response.json();
        setProductos(data);
      } catch (err) {
        console.error("Error al obtener productos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Cambia la disponibilidad 
  const toggleDisponibilidad = async (id) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const nuevoEstado = !producto.disponible;
    const confirmar = window.confirm(
      `¿Seguro que deseas ${nuevoEstado ? "mostrar" : "ocultar"} este producto?`
    );
    if (!confirmar) return;

    try {
      const actualizado = { ...producto, disponible: nuevoEstado };

      const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actualizado),
      });

      if (!response.ok) throw new Error("Error al actualizar disponibilidad");

      setProductos(prev =>
        prev.map(p => p.id === id ? { ...p, disponible: nuevoEstado } : p)
      );

      alert(`Producto ahora está ${nuevoEstado ? "DISPONIBLE" : "NO DISPONIBLE"}`);
    } catch (err) {
      console.error("Error al cambiar disponibilidad:", err);
      alert("No se pudo cambiar la disponibilidad");
    }
  };

  if (loading) {
    return <p className="text-white p-6">Cargando productos...</p>;
  }

  return (
    <div className="p-6 bg-neutral-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Lista de Productos</h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-neutral-800 rounded-lg overflow-hidden">
          <thead className="bg-neutral-700">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Nombre</th>
              <th className="py-2 px-4 text-left">Precio</th>
              <th className="py-2 px-4 text-left">Categoría</th>
              <th className="py-2 px-4 text-left">Stock</th>
              <th className="py-2 px-4 text-left">Estado</th>
              <th className="py-2 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} className="border-b border-neutral-700 hover:bg-neutral-700">
                <td className="py-2 px-4">{p.id}</td>
                <td className="py-2 px-4">{p.nombre}</td>
                <td className="py-2 px-4">${p.precio}</td>
                <td className="py-2 px-4">{p.categoria}</td>
                <td className="py-2 px-4">{p.stock}</td>
                <td className="py-2 px-4">
                  {p.disponible ? (
                    <span className="text-green-400 font-semibold">Disponible</span>
                  ) : (
                    <span className="text-red-400 font-semibold">No disponible</span>
                  )}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => toggleDisponibilidad(p.id)}
                    className={`px-3 py-1 rounded ${
                      p.disponible
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {p.disponible ? "Ocultar" : "Mostrar como disponible"}
                  </button>

                  <button
                    onClick={() => navigate(`/admin/edit/${p.id}`)}
                    className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
