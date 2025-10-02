import React, { useState } from "react";
import { productos } from "../data/products";


import "./Carousel.css";
import { Link } from "react-router-dom";

export default function Carousel() {

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? productos.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === productos.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">¡Más vendidos!</h2>

      <div className="carousel">
        <button className="carousel-btn left" onClick={prevSlide}>
          ◀
        </button>

       <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
  {productos.map((p) => (
    <div
        key={p.id}
        className="min-w-[220px] max-w-[220px] bg-[#1a1a1a] text-white p-4 rounded-lg flex-shrink-0 shadow-md"
>

      <img
        src={p.img}
        alt={p.nombre}
        className="w-full h-40 object-contain mb-2"
      />
      <h3 className="text-sm font-bold">{p.nombre}</h3>
      <p className="text-yellow-400 font-bold">{p.precio}</p>
      <p className="text-xs text-gray-300">Mismo precio en 6 cuotas fijas!</p>
      <Link to={'product/' + p.id} className="mt-2 bg-yellow-400 text-black px-3 py-1 rounded font-bold hover:bg-yellow-500">
        Ver Producto
      </Link>
    </div>
  ))}
</div>


        <button className="carousel-btn right" onClick={nextSlide}>
          ▶
        </button>
      </div>
    </div>
  );
}
