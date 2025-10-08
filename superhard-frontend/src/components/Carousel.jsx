import React, { useState } from "react";
import { productos } from "../data/products";
import { Link } from "react-router-dom";

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? productos.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === productos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#3E3E3E] text-white py-6 px-6 rounded-lg mt-10 mx-auto max-w-7xl shadow-md">
      {/* Título */}
      <h2 className="text-2xl font-bold text-[#EEDA00] mb-5 text-center">
        ¡Más vendidos!
      </h2>

      <div className="relative flex items-center justify-center">
        {/* Botón izquierdo */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-4 bg-[#EEDA00] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg hover:opacity-80 transition cursor-pointer"
        >
          ◀
        </button>

        {/* Contenedor del carrusel */}
        <div className="flex gap-4 overflow-hidden px-4 py-2 scroll-smooth">
          {productos.map((p) => (
            <div
              key={p.id}
              className="min-w-[180px] max-w-[180px] bg-[#2F2F2F] rounded-lg p-3 flex flex-col justify-center items-center flex-shrink-0 shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-300"
            >
              <img
                src={p.img}
                alt={p.nombre}
                className="w-full h-32 object-contain mb-2"
              />
              <h3 className="text-sm font-semibold mb-1 text-center">{p.nombre}</h3>
              <p className="text-[#EEDA00] font-bold text-sm mb-1 text-center">
                {p.precio}
              </p>
              <p className="text-xs text-gray-300 mb-2 text-center">
                ¡Mismo precio en 6 cuotas fijas!
              </p>
              <Link
                to={`/product/${p.id}`}
                className="block text-center bg-[#EEDA00] text-black font-semibold px-2 py-1 rounded-md hover:opacity-90 transition text-sm"
              >
                Ver Producto
              </Link>
            </div>

          ))}
        </div>

        {/* Botón derecho */}
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 bg-[#EEDA00] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg hover:opacity-80 transition cursor-pointer"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

export default Carousel;
