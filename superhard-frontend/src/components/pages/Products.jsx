import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../ProductCard';
import { getCategorias, getProductos, getProductosPorCategoria, buscarProductos } from '../../services/api';
import Pagination from '../Pagination';

export default function Products() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 0, totalPages: 1 });
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '0', 10);
  const selected = searchParams.get('categoria') || null;
  const searchQuery = searchParams.get('search') || null;

  // Cargar categorías
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const cats = await getCategorias();
        if (!mounted) return;
        setCategorias(cats || []);
      } catch (err) {
        console.error('Error cargando categorías', err);
      } finally {
        // El loading se setea a false en el useEffect de productos
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  // Cargar productos con paginación
  useEffect(() => {
    let mounted = true;
    const loadProductos = async () => {
      try {
        setLoading(true);
        let response;
        const pageOptions = { page: currentPage, limit: 12 };

        if (searchQuery) {
          // Si hay búsqueda, llamar al endpoint de búsqueda
          response = await buscarProductos(searchQuery, pageOptions);
        } else if (selected) {
          // Si hay categoría seleccionada
          response = await getProductosPorCategoria(selected, pageOptions);
        } else {
          // Cargar todos los productos
          response = await getProductos(pageOptions);
        }

        if (!mounted) return;
        setProductos(response.content || []);
        setPagination({
          currentPage: response.number,
          totalPages: response.totalPages,
        });
      } catch (err) {
        console.error('Error cargando productos', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProductos();
    return () => (mounted = false);
  }, [searchQuery, selected, currentPage]);

  const filtered = productos.filter((p) => p.disponible);

  const selectCategory = (cat) => {
    if (!cat) {
      searchParams.delete('categoria');
      searchParams.delete('search');
      searchParams.set('page', '0'); // Reset page
      setSearchParams(searchParams);
      return;
    }
    searchParams.delete('search');
    searchParams.set('categoria', cat);
    searchParams.set('page', '0'); // Reset page
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage) => {
    searchParams.set('page', String(newPage));
    setSearchParams(searchParams);
  };

  if (loading) return <p className="text-white p-6">Cargando productos...</p>;

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Menú de categorías para móvil (visible solo en pantallas pequeñas) */}
        <div className="md:hidden mb-6">
          <h2 className="text-2xl font-bold mb-4">Categorías</h2>
          <select 
            onChange={(e) => selectCategory(e.target.value || null)} 
            value={selected || ''}
            className="w-full p-3 rounded text-white bg-neutral-800 border border-neutral-700"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna del menú lateral (sticky) */}
          <aside className="hidden md:block md:col-span-1">
            <div className="sticky top-28">
              <div className="bg-neutral-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Categorías</h3>
                <ul className="flex flex-col gap-2">
                  <li>
                    <button
                      onClick={() => selectCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${!selected && !searchQuery ? 'bg-yellow-400 text-black' : 'hover:bg-neutral-700'}`}
                    >
                      Todas
                    </button>
                  </li>
                  {categorias.map(cat => (
                    <li key={cat}>
                      <button
                        onClick={() => selectCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded transition-colors ${selected === cat ? 'bg-yellow-400 text-black' : 'hover:bg-neutral-700'}`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Columna de productos */}
          <section className="col-span-1 md:col-span-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(p => {
                  const tieneDescuento = p.descuento && p.descuento > 0;
                  const precioFinal = tieneDescuento ? p.precio * (1 - p.descuento / 100) : p.precio;
                  return (
                    <ProductCard key={p.id} id={p.id} img={p.image} title={p.nombre} price={precioFinal} oldPrice={tieneDescuento ? p.precio : null} />
                  );
                })}
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
