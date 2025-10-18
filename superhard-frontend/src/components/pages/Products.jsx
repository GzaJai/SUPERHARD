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

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([api.getProductos(), api.getCategorias()]);
        if (!mounted) return;
        setProductos(prods || []);
        setCategorias(cats || []);
      } catch (err) {
        console.error('Error cargando productos/categorías', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, []);

  const filtered = selected ? productos.filter(p => p.categoria === selected) : productos;

  const selectCategory = (cat) => {
    if (!cat) {
      searchParams.delete('categoria');
      setSearchParams(searchParams);
      return;
    }
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
              className={`w-full text-left px-3 py-2 rounded ${!selected ? 'bg-yellow-400 text-black' : 'hover:bg-neutral-700'}`}
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
        <h2 className="text-2xl font-bold mb-4">Productos {selected ? `- ${selected}` : ''}</h2>
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
      </section>
    </div>
  );
}
