import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { productos } from '../../data/products';
import CartContext from '../../context/CartContext';
import Footer from '../Footer';

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
    setProduct(productos.find(p => p.id == id))
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#494949] text-white">
      {product &&
        <div className="flex flex-col md:flex-row bg-[#313131] rounded-[15px] mt-20 mb-20 p-6 w-3/4 max-w-5xl shadow-lg gap-8">

          {/* Imagen del producto */}
          <div className="flex justify-center items-center w-full md:w-1/2">
            <img
              src={product.img}
              alt="Producto"
              className="rounded-xl object-cover w-full max-w-[400px]"
            />
          </div>

          {/* Información del producto */}
          <div className="flex flex-col w-full md:w-1/2 gap-4">
            <h2 className="text-3xl font-bold text-[#EEDA00]">
              {product.nombre}
            </h2>
            <p className="text-2xl font-semibold">{product.precio}</p>

            <p className="text-sm text-gray-300">🚚 Envíos a todo el país</p>

            <div className="flex flex-col items-rigth gap-3">

              <div className="flex items-center bg-[#2F2F2F] rounded-md w-full">
                {/* Botón - */}
                <button
                  onClick={decrease}
                  className="flex-[1] bg-[#EEDA00] text-black font-bold py-2 rounded-l-md cursor-pointer hover:opacity-80 transition"
                >
                  -
                </button>

                {/* Cantidad */}
                <input
                  type="text"
                  value={cantidad}
                  readOnly
                  className="flex-[3] text-center bg-white text-black font-semibold outline-none border-none cursor-pointer select-none py-2"
                />

                {/* Botón + */}
                <button
                  onClick={increase}
                  className="flex-[1] bg-[#EEDA00] text-black font-bold py-2 rounded-r-md cursor-pointer hover:opacity-80 transition"
                >
                  +
                </button>
              </div>


              {/* Boton de comprar */}
              <button className="bg-[#EEDA00] text-black font-bold py-2 px-4 rounded-lg hover:cursor-pointer opacity-90 transition">
                Comprar
              </button>

              {/* Botón Agregar al Carrito */}
              <button className="bg-[#EEDA00] text-black font-bold py-2 px-4 rounded-lg hover:cursor-pointer opacity-90 transition"
                onClick={() => addToCart(product,cantidad)}
              >
                Agregar al carrito
              </button>

              {/* Tabs */}
              <div className="mt-6">
                <div className="flex">
                  <button className="w-full font-semibold border-b-2 border-[#EEDA00] text-[#EEDA00]" >
                    Especificaciones
                  </button>
                </div>
              </div>

              {product.specs && (
                <ul className="list-disc list-inside text-white">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <li key={key}>
                      <span className="font-regular">
                        {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                      </span>{" "}
                      {value}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      }
    </div>

      
  )
}

export default ProductDetails