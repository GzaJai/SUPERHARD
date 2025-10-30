import React, { useState, useEffect } from "react";
import api from "../services/api";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductosDestacados = async () => {
      try {
        setLoading(true);
        const todosLosProductos = await api.getProductos();

        // Filtramos productos disponibles, que NO estén en oferta y tomamos los primeros 8
        const destacados = todosLosProductos
          .filter((p) => p.disponible && (!p.descuento || p.descuento <= 0))
          .slice(0, 8);

        setProductos(destacados);
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductosDestacados();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-white">Cargando productos...</div>;
  }

  if (productos.length === 0) {
    return null; // No mostrar nada si no hay productos que cumplan la condición
  }

  return (
    <div className="py-8 px-6 mt-10 mb-10 mx-auto w-full max-w-7xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Productos Destacados
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productos.map((p) => {
            const tieneDescuento = p.descuento && p.descuento > 0;
            const precioFinal = tieneDescuento ? p.precio * (1 - p.descuento / 100) : p.precio;

            return (
              <ProductCard
                key={p.id}
                id={p.id}
                img={p.image}
                title={p.nombre}
                price={precioFinal}
                oldPrice={tieneDescuento ? p.precio : null}
              />
            );
        })}
      </div>
    </div>
  );
};

export default FeaturedProducts;