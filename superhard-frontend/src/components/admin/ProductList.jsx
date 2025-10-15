// src/components/admin/ProductList.jsx
import React, { useEffect, useState } from "react";

export default function ProductList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await fetch(`http://localhost:8080/api/productos/${id}`, { method: "DELETE" });
      setProductos(productos.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar producto:", err);
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
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => eliminarProducto(p.id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                  <button className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600">
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
