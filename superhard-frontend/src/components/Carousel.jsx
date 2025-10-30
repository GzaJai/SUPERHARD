import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";

function Carousel() {
  const [productosEnOferta, setProductosEnOferta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        setLoading(true);
        const todosLosProductos = await api.getProductos();
        // Filtramos solo los productos con descuento y que estén disponibles
        const ofertas = todosLosProductos.filter(
          (p) => p.descuento > 0 && p.disponible
        );
        setProductosEnOferta(ofertas);
      } catch (error) {
        console.error("Error al cargar las ofertas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfertas();
  }, []);

  const itemsPerView = 4; // Productos visibles a la vez

  // Ajuste para cuando haya menos productos que itemsPerView
  const visibleCount = Math.min(itemsPerView, productosEnOferta.length);

  // Índice máximo que podemos mostrar (no negativo)
  const maxIndex = Math.max(0, productosEnOferta.length - visibleCount);

  const prevSlide = () => {
    if (maxIndex === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    if (maxIndex === 0) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-white">Cargando ofertas...</div>
    );
  }

  if (productosEnOferta.length === 0) {
    return null; // No mostrar el carrusel si no hay ofertas
  }

  return (
    <div className="bg-neutral-800 text-white py-8 px-6 mt-10 mb-10 mx-auto w-full max-w-7xl shadow-lg rounded-2xl">
      {/* Título */}
      <h2 className="text-2xl font-bold text-[#EEDA00] mb-5 text-center">
        ¡Ofertas Imperdibles!
      </h2>

      <div className="relative flex items-center justify-center">
        {/* Botón izquierdo */}
        <button
          onClick={prevSlide}
           disabled={!visibleCount || maxIndex === 0}
           className={`absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 text-white w-12 h-12 items-center justify-center rounded-full hover:bg-black/60 shadow-lg transition-all duration-300 cursor-pointer z-10 hidden md:flex ${
            !visibleCount || maxIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
          }`}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Contenedor del carrusel */}
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
          >
            {productosEnOferta.map((p) => {
              const precioFinal = p.precio * (1 - p.descuento / 100);
              return (
                <div key={p.id} className="p-2" style={{ flex: `0 0 ${100 / visibleCount}%` }}>
                  <div className="bg-neutral-700 rounded-lg p-4 flex flex-col items-center shadow-md hover:shadow-yellow-400/20 hover:scale-[1.02] transition-all duration-300 h-full">
                    <img
                      src={p.image}
                      alt={p.nombre}
                      className="w-full h-32 object-contain mb-3 rounded-md bg-white p-1"
                    />
                    <h3 className="text-sm font-semibold text-center text-white line-clamp-2 flex-grow">
                      {p.nombre}
                    </h3>
                    <div className="flex flex-col items-center my-2">
                      <p className="text-gray-400 line-through text-xs">
                        ${parseFloat(p.precio).toFixed(2)}
                      </p>
                      <p className="text-green-400 font-bold text-lg">
                        ${precioFinal.toFixed(2)}
                      </p>
                    </div>
                    <Link
                      to={`/product/${p.id}`}
                      className="block text-center bg-[#EEDA00] text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-colors text-sm w-full mt-auto"
                    >
                      Ver Oferta
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón derecho */}
        <button
          onClick={nextSlide}
           disabled={!visibleCount || maxIndex === 0}
           className={`absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 text-white w-12 h-12 items-center justify-center rounded-full hover:bg-black/60 shadow-lg transition-all duration-300 cursor-pointer z-10 hidden md:flex ${
            !visibleCount || maxIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
          }`}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}

export default Carousel;