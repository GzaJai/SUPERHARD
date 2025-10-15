import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    stock: "",
    image: "",
    description: "",
  });

  const categorias = [
    "Procesadores", "Placas de video", "Memorias RAM", "Periféricos",
    "Gabinetes", "Componentes", "Accesorios", "Portátiles", "Monitores",
  ];

  useEffect(() => {
    if (!id) return; // Crear nuevo producto
    const fetchProducto = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/productos/${id}`);
        const data = await res.json();
        setProducto(data);
      } catch (err) {
        console.error("Error al cargar producto:", err);
      }
    };
    fetchProducto();
  }, [id]);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = id ? "PUT" : "POST";
    const url = id 
      ? `http://localhost:8080/api/productos/${id}` 
      : "http://localhost:8080/api/productos";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });
      navigate("/admin/products");
    } catch (err) {
      console.error("Error guardando producto:", err);
    }
  };
  return (
    <div className="p-8 bg-neutral-900 min-h-screen text-white">
      <h2 className="text-2xl mb-4 text-white">Agregar Producto</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-1/2">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={producto.nombre}
          onChange={handleChange}
          className="p-2 rounded text-white bg-neutral-800"
        />

        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={producto.precio}
          onChange={handleChange}
          className="p-2 rounded text-white bg-neutral-800"
        />

        {/* Select para categoría */}
        <select
          name="categoria"
          value={producto.categoria}
          onChange={handleChange}
          className="p-2 rounded text-white bg-neutral-800"
        >
          <option value="">--Selecciona Categoría--</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={producto.stock}
          onChange={handleChange}
          className="p-2 rounded text-white bg-neutral-800"
        />

        <input
          type="text"
          name="image"
          placeholder="URL de imagen"
          value={producto.image}
          onChange={handleChange}
          className="p-2 rounded text-white bg-neutral-800"
        />

        <textarea
          name="description"
          placeholder="Descripción"
          value={producto.description}
          onChange={handleChange}
          className="p-2 rounded text-white bg-neutral-800"
        
        />

        <button
          type="submit"
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 text-white"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
