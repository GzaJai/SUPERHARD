import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../ProductCard';
import api from '../../services/api';

export default function Products() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const selected = searchParams.get('categoria') || null;
  const searchQuery = searchParams.get('search') || null;

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  // Cargar categorías
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const cats = await api.getCategorias();
        if (!mounted) return;
        setCategorias(cats || []);
      } catch (err) {
        console.error('Error cargando categorías', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  // Cargar productos
  useEffect(() => {
    let mounted = true;
    const loadProductos = async () => {
      try {
        setLoading(true);
        let prods = [];

        if (searchQuery) {
          prods = await api.buscarProductos(searchQuery);
        } else if (selected) {
          prods = await api.getProductosPorCategoria(selected);
        } else {
          prods = await api.getProductos();
        }

        if (!mounted) return;
        setProductos(prods || []);
        setCurrentPage(1); // resetear a la primera página al cambiar filtro
      } catch (err) {
        console.error('Error cargando productos', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadProductos();
    return () => (mounted = false);
  }, [searchQuery, selected]);

  const filtered = productos.filter((p) => p.disponible);

  // Cálculo de paginación
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  const selectCategory = (cat) => {
    if (!cat) {
      searchParams.delete('categoria');
      searchParams.delete('search');
      setSearchParams(searchParams);
      return;
    }
    searchParams.delete('search');
    setSearchParams({ categoria: cat });
  };

  if (loading) return <p className="text-white p-6">Cargando productos...</p>;

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex p-6">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-800 p-4 rounded-lg shadow-lg sticky top-24 h-fit self-start">
        <h3 className="text-xl font-bold mb-4">Categorías</h3>
        <ul className="flex flex-col gap-2">
          <li>
            <button
              onClick={() => selectCategory(null)}
              className={`w-full text-left px-3 py-2 rounded cursor-pointer ${!selected && !searchQuery
                  ? 'bg-[#EEDA00] text-black'
                  : 'hover:bg-neutral-700'
                }`}
            >
              Todas
            </button>
          </li>
          {categorias.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => selectCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded cursor-pointer ${selected === cat
                    ? 'bg-[#EEDA00] text-black'
                    : 'hover:bg-neutral-700'
                  }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Contenido principal */}
      <section className="ml-[2rem]">
        <h2 className="text-2xl font-bold mb-4">
          {searchQuery
            ? `Resultados de búsqueda: "${searchQuery}"`
            : selected
              ? `Productos - ${selected}`
              : 'Todos los productos'}
        </h2>

        {filtered.length === 0 ? (
          <p className="text-gray-400 text-lg">No se encontraron productos</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentProducts.map(p => {
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

            {/* ✅ Paginación: solo mostrar si hay más de 16 productos */}
            {filtered.length > productsPerPage && (
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded cursor-pointer ${currentPage === i + 1 ? 'bg-yellow-400 text-black' : 'bg-neutral-700 hover:bg-neutral-600'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
