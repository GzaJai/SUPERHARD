import React, { useState } from "react";
import Ryzen3 from "../assets/images/Ryzen-3-5300G.jpg";
import Ryzen5 from "../assets/images/Ryzen-5-5600GT.jpg";
import Rysen5 from "../assets/images/Ryzen-5-5600X.jpg";
import Rysen7 from "../assets/images/Ryzen-7-5800X.jpg";
import Rysen9 from "../assets/images/Ryzen-9-5900X.jpg";


import "./Carousel.css";

export default function Carousel() {
  // Productos de ejemplo
  const productos = [
    {
      id: 1,
      nombre: "Micro AMD Ryzen 5 5600GT 4.6 Ghz AM4",
      precio: "$134.999",
      img: Ryzen5, 
    },
    {
      id: 2,
      nombre: "Micro AMD Ryzen 7 5800X 4.7 Ghz AM4",
      precio: "$199.999",
      img: Rysen7, 
    },
    {
      id: 3,
      nombre: "Micro AMD Ryzen 9 5900X 4.8 Ghz AM4",
      precio: "$249.999",
      img: Rysen9,
    },
    {
      id: 4,
      nombre: "Micro AMD Ryzen 5 5600X 4.6 Ghz AM4",
      precio: "$139.999",
      img: Rysen5,
    },
    {
      id: 5,
      nombre: "Micro AMD Ryzen 3 5300G 4.4 Ghz AM4",
      precio: "$109.999",
      img: Ryzen3,
    },
  ];

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
      <button className="mt-2 bg-yellow-400 text-black px-3 py-1 rounded font-bold hover:bg-yellow-500">
        Ver Producto
      </button>
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
