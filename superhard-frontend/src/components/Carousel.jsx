import React, { useState } from "react";
import { productos } from "../data/products";
import { Link } from "react-router-dom";

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 3;

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? productos.length - visibleCount : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + visibleCount >= productos.length ? 0 : prev + 1
    );
  };

  const visibleProducts = productos.slice(
    currentIndex,
    currentIndex + visibleCount
  );

  const itemsToShow =
    visibleProducts.length < visibleCount
      ? [
          ...visibleProducts,
          ...productos.slice(0, visibleCount - visibleProducts.length),
        ]
      : visibleProducts;

  return (
    <section className="bg-[#3E3E3E] text-white py-10 px-8 rounded-lg mt-10 mb-24 mx-auto max-w-7xl shadow-lg relative overflow-x-hidden">
      <h2 className="text-2xl font-bold text-[#EEDA00] mb-6 text-center">
        ¡Más vendidos!
      </h2>

      <div className="relative flex items-center justify-center overflow-hidden">
        {/* Botón izquierdo */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#585858] text-white text-3xl w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#292929] shadow-md transition-all duration-300 z-10"
        >
          ‹
        </button>

        {/* Contenedor de productos */}
        <div className="flex gap-6 px-10 py-3">
          {itemsToShow.map((p) => (
            <div
              key={p.id}
              className="min-w-[200px] bg-[#2F2F2F] rounded-lg p-4 flex flex-col justify-center items-center shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-300"
            >
              <img
                src={p.img}
                alt={p.nombre}
                className="w-full h-36 object-contain mb-2"
              />
              <h3 className="text-sm font-semibold mb-1 text-center">{p.nombre}</h3>
              <p className="text-[#EEDA00] font-bold text-sm mb-1 text-center">{p.precio}</p>
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
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#585858] text-white text-3xl w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#292929] shadow-md transition-all duration-300 z-10"
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default Carousel;
