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
  // La API podría devolver directamente un array o un objeto con metadatos: { data: [...], total, page, limit }
  const res = await request(path);
  return res;
}

export async function getProductoById(id) {
  return request(`/productos/${id}`);
}

export async function getCategorias() {
  // intentamos un endpoint /categorias; si no existe o la respuesta tiene otra forma,
  // normalizamos a un array de strings y si todo falla extraemos desde productos
  try {
    const res = await request('/categorias');
    // Normalizar formatos comunes
    if (Array.isArray(res)) {
      return res.map(String);
    }
    if (res && typeof res === 'object') {
      // algunas APIs devuelven { data: [...]} o { categories: [...] }
      if (Array.isArray(res.data)) return res.data.map(String);
      if (Array.isArray(res.categories)) return res.categories.map(String);
      // si es un objeto con keys como { 'Proc': 10, ... } devolvemos las keys
      const keys = Object.keys(res).filter(k => res[k] != null && typeof res[k] !== 'object');
      if (keys.length) return keys.map(String);
    }

    // fallback: extraer categorías desde productos
    const prods = await getProductos();
    if (Array.isArray(prods)) {
      return Array.from(new Set(prods.map(p => p.categoria).filter(Boolean))).map(String);
    }

    // si aún así no hay nada, devolver array vacío
    return [];
  } catch (e) {
    // si el request('/categorias') falló, intentamos fallback seguro
    try {
      const prods = await getProductos();
      if (Array.isArray(prods)) {
        return Array.from(new Set(prods.map(p => p.categoria).filter(Boolean))).map(String);
      }
    } catch (err) {
      // no podemos recuperar categorías
      throw new Error('No se pudieron obtener las categorías: ' + (err.message || e.message));
    }
    return [];
  }
}

export default { getProductos, getProductoById, getCategorias };
