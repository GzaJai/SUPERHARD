import React, { useState } from "react";
import { productos } from "../data/products";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cantidad de productos visibles a la vez (deseada)
  const itemsPerView = 4;

  // Ajuste para cuando haya menos productos que itemsPerView
  const visibleCount = Math.min(itemsPerView, productos.length);

  // Índice máximo que podemos mostrar (no negativo)
  const maxIndex = Math.max(0, productos.length - visibleCount);

  const prevSlide = () => {
    if (maxIndex === 0) return; // nada que mover
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    if (maxIndex === 0) return; // nada que mover
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#3E3E3E] text-white py-6 px-6 mt-10 mb-10 mx-auto min-w-screen max-w-7xl shadow-[0_0_4px_rgba(0,0,0,0.9)]">
      {/* Título */}
      <h2 className="text-2xl font-bold text-[#EEDA00] mb-5 text-center">
        ¡Más vendidos!
      </h2>

      <div className="relative flex items-center justify-center">
        {/* Botón izquierdo */}
        <button
          onClick={prevSlide}
          disabled={maxIndex === 0}
          className={`absolute left-4 top-1/2 -translate-y-1/2 bg-[#585858] text-white w-14 h-14 items-center justify-center rounded-full hover:bg-[#505050] shadow-lg transition-all duration-300 cursor-pointer z-10 hidden md:flex ${
            maxIndex === 0 ? "opacity-40 cursor-not-allowed hover:bg-[#585858]" : ""
          }`}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Contenedor del carrusel */}
        <div className=" overflow-x-auto whitespace-nowrap w-full"  style={{scrollbarWidth: "none", msOverflowStyle: "none"}}>
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              // Cada paso se desplaza (100 / visibleCount)%
              transform: `translateX(-${currentIndex * (110 / visibleCount)}%)`,
              // ancho total del contenedor (productos.length * ancho item)
              width: `${(productos.length * 25) / visibleCount}%`,
            }}
          >
            {productos.map((p) => (
              <div
                key={p.id}
                className="p-2"
                style={{
                  // cada item ocupa 1/visibleCount del viewport
                  flex: `0 0 ${150 / visibleCount}%`,
                }}
              >
                <div className="bg-[#2F2F2F] rounded-lg p-3 flex flex-col justify-center items-center shadow hover:shadow-lg hover:scale-[1.01] transition-transform duration-300">
                  <img
                    src={p.img}
                    alt={p.nombre}
                    className="w-full h-32 object-contain mb-2"
                  />
                  <h3 className="text-sm font-semibold mb-1 text-center">
                    {p.nombre}
                  </h3>
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
              </div>
            ))}
          </div>
        </div>

        {/* Botón derecho */}
        <button
          onClick={nextSlide}
          disabled={maxIndex === 0}
          className={`absolute right-4 top-1/2 -translate-y-1/2 bg-[#585858] text-white w-14 h-14 items-center justify-center rounded-full hover:bg-[#505050] shadow-lg transition-all duration-300 cursor-pointer z-10 hidden md:flex ${
            maxIndex === 0 ? "opacity-40 cursor-not-allowed hover:bg-[#585858]" : ""
          }`}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}

export default Carousel;