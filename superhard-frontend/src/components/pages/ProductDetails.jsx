import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CartContext from "../../context/CartContext";
import { Truck, PackageCheck, Minus, Plus, ShoppingCart } from "lucide-react";

const ProductDetails = () => {
  const [cantidad, setCantidad] = useState(1);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const increase = () => {
    if (product?.stock && cantidad < product.stock) setCantidad(prev => prev + 1);
    else if (!product?.stock) setCantidad(prev => prev + 1);
  };
  const decrease = () => cantidad > 1 && setCantidad(prev => prev - 1);

  useEffect(() => {
    // Scroll to top on component mount or when id changes
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/productos/${id}`);
        if (!res.ok) throw new Error(`Producto no encontrado (ID: ${id})`);
        const data = await res.json();

        // Normalizamos nombres por si vienen distintos desde backend
        const normalized = {
          ...data,
          image: data.image || data.img,
          description: data.description || data.descripcion,
        };

        setProduct(normalized);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    if (product.stock === 0) return;

    // Prepara el producto para la página de compra
    const itemToBuy = [{ ...product, cantidad }];
    localStorage.setItem("cartItems", JSON.stringify(itemToBuy));

    navigate("/buy");
  };

  if (!product && !error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Cargando producto...
      </div>
    );
  }

  if (!product && error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Error al cargar el producto. Verifica que el servidor esté corriendo y que el producto exista.
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-[#494949] text-white p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start bg-[#313131] rounded-2xl mt-20 mb-20 p-6 md:p-8 w-full max-w-6xl shadow-2xl gap-8">
          {/* Imagen */}
          <div className="flex justify-center items-center w-full lg:w-1/2 bg-[#2b2b2b] p-4 rounded-xl shadow-inner">
            <img
              src={product.image}
              alt={product.nombre}
              className="rounded-xl object-contain w-full max-w-sm h-auto bg-white p-2"
            />
          </div>

          {/* Información */}
          <div className="flex flex-col w-full lg:w-1/2 gap-5">
            {/* Encabezado: Nombre, Categoría y Stock */}
            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
                {product.categoria && (
                  <span className="bg-[#494949] text-[#EEDA00] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <PackageCheck size={14} /> {product.categoria}
                  </span>
                )}
                {product.stock > 0 ? (
                  <span className="text-green-400 text-sm font-medium">✓ En Stock</span>
                ) : (
                  <span className="text-red-400 text-sm font-medium">✗ Agotado</span>
                )}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#EEDA00]">{product.nombre}</h2>
            </div>

            {/* Precio con lógica de descuento */}
            <div className="flex items-end gap-4">
              {product.descuento && product.descuento > 0 ? (
                <>
                  <p className="text-4xl font-extrabold text-green-400">
                    ${(product.precio * (1 - product.descuento / 100)).toFixed(2)}
                  </p>
                  <p className="text-2xl font-bold text-gray-500 line-through">
                    ${parseFloat(product.precio).toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-4xl font-extrabold">${parseFloat(product.precio).toFixed(2)}</p>
              )}
            </div>

            {/* Envío */}
            <div className="flex items-center gap-2 text-sm text-gray-300 bg-[#2b2b2b] p-3 rounded-lg">
              <Truck size={20} className="text-[#EEDA00]" />
              <span>Envíos a todo el país</span>
            </div>

            {/* Acciones: Cantidad y Botones */}
            <div className="flex flex-col gap-4 mt-4">
              {/* Cantidad */}
              <div className="flex items-center gap-4">
                <label className="font-semibold">Cantidad:</label>
                <div className="flex items-center bg-[#2F2F2F] rounded-lg">
                  <button
                    onClick={decrease}
                    disabled={cantidad <= 1}
                    className="text-black font-bold p-3 rounded-l-lg bg-[#EEDA00] hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="text"
                    value={cantidad}
                    readOnly
                    className="w-14 text-center bg-white text-black font-semibold outline-none border-none select-none py-2"
                  />
                  <button
                    onClick={increase}
                    disabled={product.stock > 0 && cantidad >= product.stock}
                    className="text-black font-bold p-3 rounded-r-lg bg-[#EEDA00] hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  className="flex-1 bg-[#EEDA00] text-black font-bold py-3 px-6 rounded-lg hover:opacity-90 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.stock === 0}
                  onClick={handleBuyNow}
                >
                  Comprar ahora
                </button>
                <button
                  className="flex-1 bg-[#494949] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#5a5a5a] transition border border-gray-600 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => addToCart(product, cantidad)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart size={20} />
                  Agregar al carrito
                </button>
              </div>
            </div>

            {/* Descripción */}
            <div className="mt-4 border-t border-gray-700 pt-4">
              <h3 className="font-semibold text-lg text-[#EEDA00] mb-2">Descripción</h3>
              <p className="whitespace-pre-line text-gray-300 text-sm leading-relaxed">
                {product.description || "No hay descripción disponible para este producto."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;