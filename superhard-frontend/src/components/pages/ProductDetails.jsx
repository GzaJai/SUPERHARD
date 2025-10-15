import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { productos } from '../../data/products';
import CartContext from '../../context/CartContext';
import SpecsSeccion from "../SpecsSeccion";

const ProductDetails = () => {
  const [cantidad, setCantidad] = useState(1);
  const [product, setProduct] = useState();
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const increase = () => setCantidad(prev => prev + 1);
  const decrease = () => {
    if (cantidad > 1) setCantidad(prev => prev - 1);
  };

  useEffect(() => {
    setProduct(productos.find(p => p.id == id));
  }, [id]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#494949] text-white">
      {product && (
        <div className="flex flex-col md:flex-row bg-[#313131] shadow-[0_0_10px_rgba(0,0,0,0.7)] mt-20 mb-20 p-8 w-[85%] max-w-5xl h-[600px] shadow-2xl gap-10">

          {/* Imagen del producto */}
          <div className="flex justify-center items-center w-full md:w-5/6 h-full">
            <img
              src={product.img}
              alt="Producto"
              className="rounded-xl object-contain w-full h-full max-h-[500px]"
            />
          </div>

          {/* Información del producto */}
          <div className="flex flex-col justify-between w-full md:w-1/2 h-full py-4">
            <div>
              <h2 className="text-4xl font-bold text-[#EEDA00]">
                {product.nombre}
              </h2>
              <p className="text-2xl font-semibold mt-2">{product.precio}</p>
              <p className="text-sm text-gray-300 mt-3">🚚 Envíos a todo el país</p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Controles de cantidad */}
              <div className="flex items-center bg-[#2F2F2F] rounded-md w-full min-w-full max-w-xs">
                <button
                  onClick={decrease}
                  className="flex-1 bg-[#EEDA00] text-black font-bold py-2 rounded-l-md hover:opacity-80 transition cursor-pointer"
                >
                  -
                </button>

                <input
                  type="text"
                  value={cantidad}
                  readOnly
                  className="flex-[2] text-center bg-white text-black font-semibold outline-none border-none select-none py-2 hover: cursor-pointer"
                />

                <button
                  onClick={increase}
                  className="flex-1 bg-[#EEDA00] text-black font-bold py-2 rounded-r-md hover:opacity-80 transition cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Botones */}
              <button className="flex-1 bg-[#EEDA00] text-black font-bold py-2 px-4 rounded-lg hover:opacity-90 transition cursor-pointer">
                Comprar
              </button>

              <button
                onClick={() => addToCart(product, cantidad)}
                className="flex-1 bg-[#EEDA00] text-black font-bold py-2 px-4 rounded-lg hover:opacity-90 transition cursor-pointer"
              >
                Agregar al carrito
              </button>

            </div>
          </div>
        </div>
      )}
      <SpecsSeccion productId={parseInt(id)} />;
    </div>
  );
};

export default ProductDetails;
