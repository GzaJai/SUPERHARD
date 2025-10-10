import { useContext } from "react";
import CartContext from "../../context/CartContext";
import { toInt } from "../../utils/FormatUtils";

const ShoppingCart = () => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  return (
    <div className="bg-[#494949] w-dvw h-dvh pt-[1rem]">
      {/* Título */}
      <div className="flex items-center justify-center gap-[1rem] mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={64}
          height={64}
          fill={"#FFFFFF"}
          viewBox="0 0 24 24"
        >
          <path d="M10.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M17.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M8.82 15.77c.31.75 1.04 1.23 1.85 1.23h6.18c.79 0 1.51-.47 1.83-1.2l3.24-7.4c.14-.31.11-.67-.08-.95A1 1 0 0 0 21 7H7.33L5.92 3.62C5.76 3.25 5.4 3 5 3H2v2h2.33z"></path>
        </svg>
        <h2 className="font-bold text-white text-3xl">Mi carrito</h2>
      </div>

      <div className="flex flex-col w-11/12 mx-auto bg-[#646464] rounded-lg gap-4 p-4 shadow-md">
        {/* Si no hay productos */}
        {(!cart || cart.length === 0) && (
          <div className="flex flex-col items-center justify-center text-center bg-[#2F2F2F] text-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-2">🛒 No hay productos en el carrito</h3>
            <p className="text-gray-300">Agrega productos para comenzar tu compra.</p>
          </div>
        )}

        {/* Si hay productos */}
        {cart && cart.length > 0 &&
          cart.map((product) => (
            <div key={product.id} className="flex justify-between items-center bg-[#555555] rounded-lg shadow p-3">
              <img
                src={product.img}
                alt={product.nombre}
                className="p-[1rem] w-[8rem] h-auto rounded-xl bg-white"
              />
              <div className="flex flex-col font-semibold text-white gap-3">
                <p>{product.nombre}</p>
                <p>
                  <span className="font-bold">{product.precio}</span> x unidad
                </p>
                <div className="flex bg-white text-black rounded-lg justify-between items-center">
                  <button
                    onClick={() => removeFromCart(product)}
                    className="px-3 py-1 font-black bg-[#EEDA00] cursor-pointer rounded-l-lg hover:opacity-90"
                  >
                    -
                  </button>
                  <p className="px-3">{product.cantidad}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-3 py-1 font-black bg-[#EEDA00] cursor-pointer rounded-r-lg hover:opacity-90"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex w-1/4 items-center justify-center text-center">
                <p className="font-bold text-white text-lg">
                  ${toInt(product.precio) * product.cantidad}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShoppingCart;
