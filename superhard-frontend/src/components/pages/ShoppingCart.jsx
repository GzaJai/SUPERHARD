import { useContext } from "react";
import CartContext from "../../context/CartContext";

const ShoppingCart = () => {
  const { cart, addToCart, removeFromCart, deleteFromCart, clearCart } =
    useContext(CartContext);

  const parsePrice = (price) => {
    if (!price) return 0;
    const cleaned = price.toString().replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const formatNumber = (num) => {
    const fixed = parsePrice(num).toFixed(3);
    const parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
  };

  const total = cart.reduce(
    (acc, item) => acc + parsePrice(item.precio) * item.cantidad,
    0
  );

  return (
    <div className="bg-[#494949] min-h-screen pt-[2rem] pb-[6rem] flex flex-col md:flex-row gap-6 px-6">
      {/* Contenedor de carrito */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col w-full max-w-4xl mx-auto bg-[#646464] rounded-2xl gap-6 p-6 shadow-md">
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center bg-[#2F2F2F] text-white p-10 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-3">🛒 No hay productos en el carrito</h3>
              <p className="text-gray-300">Agrega productos para comenzar tu compra.</p>
            </div>
          )}

          {cart.length > 0 &&
            cart.map((product) => {
              const price = parsePrice(product.precio);
              const subtotal = price * product.cantidad;

              return (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row justify-between items-center bg-[#555555] rounded-xl shadow-lg p-5 gap-6 hover:bg-[#5d5d5d] transition-all duration-200"
                >
                  {/* Imagen */}
                  <div className="flex-shrink-0">
                    <img
                      src={product.img}
                      alt={product.nombre}
                      className="w-[9rem] h-[9rem] object-contain rounded-xl bg-white p-3 shadow-md"
                    />
                  </div>

                  {/* Info + contador */}
                  <div className="flex flex-col text-white font-medium flex-1 gap-3">
                    <p className="text-lg font-semibold">{product.nombre}</p>
                    <p className="text-sm opacity-90">
                      <span className="font-bold">${formatNumber(price)}</span> x unidad
                    </p>
                    <div className="flex bg-white text-black rounded-lg w-fit items-center">
                      <button
                        onClick={() => removeFromCart(product)}
                        className="px-4 py-1 font-black bg-[#EEDA00] rounded-l-lg cursor-pointer hover:opacity-90"
                      >
                        -
                      </button>
                      <p className="px-4">{product.cantidad}</p>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-4 py-1 font-black bg-[#EEDA00] rounded-r-lg cursor-pointer hover:opacity-90"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Botón eliminar */}
                  <div className="flex flex-col items-center justify-center gap-3">
                    <button
                      onClick={() => deleteFromCart(product)}
                      className="cursor-pointer hover:opacity-80"
                      title="Eliminar producto"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#EEDA00"
                        viewBox="0 0 24 24"
                        width="28"
                        height="28"
                      >
                        <path d="M3 6h18v2H3V6zm2 3h14l-1.5 12.5a1 1 0 0 1-1 .5H7a1 1 0 0 1-1-.5L4 9zm5 2v8h2v-8H9zm4 0v8h2v-8h-2z" />
                      </svg>
                    </button>
                  </div>

                  {/* Precio subtotal */}
                  <div className="flex flex-col items-center justify-center gap-3">
                    <p className="font-bold text-lg text-white bg-[#2F2F2F] px-4 py-2 rounded-lg shadow-inner">
                      ${formatNumber(subtotal)}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Total y comprar fijo a la derecha */}
      {cart.length > 0 && (
        <div className="hidden md:flex flex-col sticky top-[7rem] w-[300px] h-fit self-start">
          <div className="flex flex-col justify-between bg-[#555555] rounded-xl p-5 shadow-lg gap-4">
            <div className="text-white font-bold text-xl">
              Total: ${formatNumber(total)}
            </div>
            <button
              onClick={clearCart}
              className="bg-[#EEDA00] text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:opacity-90 cursor-pointer transition-all duration-200"
            >
              Comprar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShoppingCart;
