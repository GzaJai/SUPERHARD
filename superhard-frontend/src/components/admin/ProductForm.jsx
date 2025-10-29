import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    marca: "",
    nombre: "",
    precio: "",
    categoria: "",
    socket: "",
    ddr: "",
    disponible: true,
    stock: "",
    image: "",
    description: "",
  });

  const categorias = [
    "Procesadores", "Motherboards" , "Placas de video", "Memorias RAM", "Periféricos",
    "Gabinetes", "Componentes", "Accesorios", "Portátiles", "Monitores",
  ];

  const socket = [
    "LGA 1200", "LGA 1700", "AM4", "AM5",
  ];

  const ddr = [
    "DDR4", "DDR5",
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
    const { name, value } = e.target;

    // Creamos una copia actualizada del producto
    const updatedProducto = { ...producto, [name]: value };

    // ✅ Lógica de dependencia: Si cambia el socket, actualiza el DDR
    if (name === "socket") {
      switch (value) {
        case "AM5":
        case "LGA 1700":
          updatedProducto.ddr = "DDR5";
          break;
        case "AM4":
        case "LGA 1200":
          updatedProducto.ddr = "DDR4";
          break;
        default:
          updatedProducto.ddr = ""; // Si no hay socket, se limpia el DDR
          break;
      }
    }

    setProducto(updatedProducto);
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
          name="marca"
          placeholder="Marca"
          value={producto.marca}
          onChange={handleChange}
          className="p-2 rounded text-white bg-neutral-800"
        />


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
        {/* Campos condicionales */}
        {(producto.categoria === "Procesadores" || producto.categoria === "Placas madre" || producto.categoria === "Memorias RAM") && (
          <select
            name="socket"
            value={producto.socket}
            onChange={handleChange}
            className="p-2 rounded text-white bg-neutral-800"
          >
            <option value="">--Selecciona Socket--</option>
            {socket.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}

        {producto.categoria === "Memorias RAM" && (
          <select
            name="ddr"
            value={producto.ddr}
            onChange={handleChange}
            className="p-2 rounded text-white bg-neutral-800"
          >
            <option value="">--Selecciona DDR--</option>
            {ddr.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}


        {/* Select para disponible */}
        <select
          name="disponible"
          value={producto.disponible}
          onChange={(e) =>
            setProducto({ ...producto, disponible: e.target.value === "true" })
          }
          className="p-2 rounded text-white bg-neutral-800"
        >
          <option value={true}>Disponible</option>
          <option value={false}>No Disponible</option>
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
