// src/components/Header.jsx
import React, { useState } from "react";

export default function Header() {
  const [search, setSearch] = useState("");
  const categories = ["Procesadores", "Placas de video", "Memorias RAM", "Periféricos", "Gabinetes", "Notebooks"];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscar:", search);
  };

  return (
    <header className="w-full border-b border-gray-300 p-4 bg-black-50">
      {/* --- Fila superior: logo, buscador, botones --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        
        {/* Logo */}
        <div>
          <h1 className="text-yellow-500 cursor-pointer font-bold text-2xl">
            SUPERHARD
          </h1>
        </div>

        {/* Buscador */}
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar productos..."
            className="flex-1 border border-gray-400 rounded-l p-2 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
          >
            🔍
          </button>
        </form>

        {/* Botones */}
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded hover:bg-orange-500">
            Iniciar sesión
          </button>
          <button className="px-3 py-1 border rounded hover:bg-orange-500">
            Carrito (0)
          </button>
        </div>
      </div>

      {/* --- Fila de categorías debajo del buscador --- */}
      <nav className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            className="border px-3 py-1 rounded hover:bg-orange-500"
          >
            {c}
          </button>
        ))}
        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          Arma tu PC
        </button>
      </nav>
    </header>
  );
}
