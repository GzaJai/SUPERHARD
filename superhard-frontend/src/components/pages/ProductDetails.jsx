import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import CartContext from "../../context/CartContext";

const ProductDetails = () => {
  const [cantidad, setCantidad] = useState(1);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const increase = () => {
    if (product?.stock && cantidad < product.stock) setCantidad(prev => prev + 1);
    else if (!product?.stock) setCantidad(prev => prev + 1);
  };
  const decrease = () => cantidad > 1 && setCantidad(prev => prev - 1);

  useEffect(() => {
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
      <div className="flex justify-center items-center min-h-screen bg-[#494949] text-white">
        <div className="flex flex-col md:flex-row bg-[#313131] rounded-[15px] mt-20 mb-20 p-6 w-3/4 max-w-5xl shadow-lg gap-8">
          {/* Imagen */}
          <div className="flex justify-center items-center w-full md:w-1/2">
            <img
              src={product.image}
              alt={product.nombre}
              className="rounded-xl object-contain w-full max-w-[400px] bg-neutral-700"
            />
          </div>

          {/* Información */}
          <div className="flex flex-col w-full md:w-1/2 gap-4">
            <h2 className="text-3xl font-bold text-[#EEDA00]">{product.nombre}</h2>
            <p className="text-2xl font-semibold">${product.precio}</p>
            <p className="text-sm text-gray-300">🚚 Envíos a todo el país</p>

            <div className="flex flex-col gap-3">
              {/* Cantidad */}
              <div className="flex items-center bg-[#2F2F2F] rounded-md w-full">
                <button
                  onClick={decrease}
                  className="flex-[1] bg-[#EEDA00] text-black font-bold py-2 rounded-l-md hover:opacity-80 transition"
                >
                  -
                </button>
                <input
                  type="text"
                  value={cantidad}
                  readOnly
                  className="flex-[3] text-center bg-white text-black font-semibold outline-none border-none select-none py-2"
                />
                <button
                  onClick={increase}
                  className="flex-[1] bg-[#EEDA00] text-black font-bold py-2 rounded-r-md hover:opacity-80 transition"
                >
                  +
                </button>
              </div>

              {/* Botones */}
              <button className="bg-[#EEDA00] text-black font-bold py-2 px-4 rounded-lg hover:opacity-90 transition">
                Comprar
              </button>
              <button
                className="bg-[#EEDA00] text-black font-bold py-2 px-4 rounded-lg hover:opacity-90 transition"
                onClick={() => addToCart(product, cantidad)}
              >
                Agregar al carrito
              </button>

              {/* Descripción */}
              <div className="mt-6">
                <h3 className="font-semibold text-[#EEDA00] mb-2">Descripción</h3>
                <p className="whitespace-pre-line text-gray-300">
                  {product.description}
                </p>

              </div>


              {/* Categoría*/}
              {product.categoria && <p className="text-gray-400 mt-4">Categoría: {product.categoria}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
