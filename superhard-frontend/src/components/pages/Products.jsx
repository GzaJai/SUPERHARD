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

  // Cargar productos iniciales y categorías
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

  // Cargar productos según búsqueda o categoría
  useEffect(() => {
    let mounted = true;
    const loadProductos = async () => {
      try {
        setLoading(true);
        let prods = [];

        if (searchQuery) {
          // Si hay búsqueda, llamar al endpoint de búsqueda
          prods = await api.buscarProductos(searchQuery);
        } else if (selected) {
          // Si hay categoría seleccionada
          prods = await api.getProductosPorCategoria(selected);
        } else {
          // Cargar todos los productos
          prods = await api.getProductos();
        }

        if (!mounted) return;
        setProductos(prods || []);
      } catch (err) {
        console.error('Error cargando productos', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProductos();
    return () => (mounted = false);
  }, [searchQuery, selected]);

  const filtered = productos.filter(p => p.disponible);

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
    <div className="min-h-screen p-6 bg-neutral-900 text-white relative">
      
      {/* Menú fijo de categorías */}
      <aside className="fixed top-24 left-6 w-60 bg-neutral-800 p-4 rounded-lg shadow-lg z-10">
        <h3 className="text-xl font-bold mb-4">Categorías</h3>
        <ul className="flex flex-col gap-2">
          <li>
            <button
              onClick={() => selectCategory(null)}
              className={`w-full text-left px-3 py-2 rounded ${!selected && !searchQuery ? 'bg-yellow-400 text-black' : 'hover:bg-neutral-700'}`}
            >
              Todas
            </button>
          </li>
          {categorias.map(cat => (
            <li key={cat}>
              <button
                onClick={() => selectCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded ${selected === cat ? 'bg-yellow-400 text-black' : 'hover:bg-neutral-700'}`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Grid de productos */}
      <section className="ml-[18rem]">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(p => (
              <ProductCard
                key={p.id}
                id={p.id}
                img={p.image}
                title={p.nombre}
                price={typeof p.precio === 'string' ? p.precio.replace(/[^0-9.,]/g,'') : p.precio}
                oldPrice={p.oldPrice}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}