// src/components/admin/ProductForm.jsx
import React, { useState } from "react";

export default function ProductForm() {
  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    stock: "",
    image: "",
  });

  const categorias = [
    "Procesadores",
    "Placas de video",
    "Memorias RAM",
    "Periféricos",
    "Gabinetes",
    "Componentes",
    "Periféricos",
    "Accesorios",
    "Portátiles",
    "Monitores",
  ];

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8080/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
    alert("Producto agregado correctamente");
    setProducto({
      nombre: "",
      precio: "",
      categoria: "",
      stock: "",
      image: "",
    });
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
