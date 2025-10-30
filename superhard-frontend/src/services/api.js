const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`API error ${res.status}: ${text}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function getProductos({ page, limit, categoria } = {}) {
  // Construir query params si se recibe paginación o filtro
  const params = new URLSearchParams();
  if (page != null) params.append('page', String(page));
  if (limit != null) params.append('limit', String(limit));
  if (categoria) params.append('categoria', String(categoria));

  const path = params.toString() ? `/productos?${params.toString()}` : '/productos';
  const res = await request(path);
  return res;
}

export async function getProductoById(id) {
  return request(`/productos/${id}`);
}

// ✅ NUEVO: Obtener productos por categoría (endpoint específico)
export async function getProductosPorCategoria(categoria) {
  return request(`/productos/categoria/${encodeURIComponent(categoria)}`);
}

// ✅ NUEVO: Buscar productos
export async function buscarProductos(query) {
  return request(`/productos/buscar?q=${encodeURIComponent(query)}`);
}

export async function getCategorias() {
  try {
    const res = await request('/categorias');
    // Normalizar formatos comunes
    if (Array.isArray(res)) {
      return res.map(String);
    }
    if (res && typeof res === 'object') {
      if (Array.isArray(res.data)) return res.data.map(String);
      if (Array.isArray(res.categories)) return res.categories.map(String);
      const keys = Object.keys(res).filter(k => res[k] != null && typeof res[k] !== 'object');
      if (keys.length) return keys.map(String);
    }

    // fallback: extraer categorías desde productos
    const prods = await getProductos();
    if (Array.isArray(prods)) {
      return Array.from(new Set(prods.map(p => p.categoria).filter(Boolean))).map(String);
    }

    return [];
  } catch (e) {
    // si el request('/categorias') falló, intentamos fallback seguro
    try {
      const prods = await getProductos();
      if (Array.isArray(prods)) {
        return Array.from(new Set(prods.map(p => p.categoria).filter(Boolean))).map(String);
      }
    } catch (err) {
      throw new Error('No se pudieron obtener las categorías: ' + (err.message || e.message));
    }
    return [];
  }
}

// ✅ ACTUALIZADO: Exportar todas las funciones
export default { 
  getProductos, 
  getProductoById, 
  getProductosPorCategoria, 
  buscarProductos, 
  getCategorias 
};