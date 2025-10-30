import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../../context/CartContext";

const ShoppingCart = () => {
  const { cart, addToCart, removeFromCart, deleteFromCart, clearCart } =
    useContext(CartContext);
  const navigate = useNavigate();

  // ✅ Formateo de precios
  const formatPrice = (num) =>
    num.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });

  // ✅ Precio final con descuento
  const getFinalPrice = (item) => {
    const price = Number(item.precio) || 0;
    return item.descuento > 0 ? price * (1 - item.descuento / 100) : price;
  };

  // ✅ Total del carrito
  const total = cart.reduce(
    (acc, item) => acc + getFinalPrice(item) * item.cantidad,
    0
  );

  // ✅ Compra
  const handleBuy = () => {
    if (cart.length === 0) return;
    localStorage.setItem("cartItems", JSON.stringify(cart));
    clearCart();
    navigate("/buy");
  };

  // ✅ No baja de 1
  const handleRemove = (product) => {
    if (product.cantidad > 1) {
      removeFromCart(product);
    }
  };

  // ✅ Eliminar producto completo
  const handleDelete = (productId) => {
    deleteFromCart(productId);
  };
  

  return (
    <div className="bg-[#494949] min-h-screen pt-[2rem] pb-[6rem] flex flex-col md:flex-row gap-6 px-6">
      {/* Contenedor principal */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col w-full max-w-4xl mx-auto bg-[#646464] rounded-2xl gap-6 p-6 shadow-md">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center bg-[#2F2F2F] text-white p-10 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-3">
                🛒 No hay productos en el carrito
              </h3>
              <p className="text-gray-300">
                Agrega productos para comenzar tu compra.
              </p>
            </div>
          ) : (
            cart.map((product) => {
              const finalPrice = getFinalPrice(product);
              const subtotal = finalPrice * product.cantidad;

              return (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row justify-between items-center bg-[#555555] rounded-xl shadow-lg p-5 gap-6 hover:bg-[#5d5d5d] transition-all duration-200"
                >
                  {/* Imagen */}
                  <div className="flex-shrink-0">
                    <img
                      src={product.img || product.image}
                      alt={product.nombre}
                      className="w-[9rem] h-[9rem] object-contain rounded-xl bg-white p-3 shadow-md"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col text-white font-medium flex-1 gap-3">
                    <p className="text-lg font-semibold">{product.nombre}</p>
                    <p className="text-sm opacity-90">
                      {product.descuento > 0 ? (
                        <>
                          <span className="font-bold text-green-400">
                            {formatPrice(finalPrice)}
                          </span>
                          <span className="line-through text-gray-400 ml-2">
                            {formatPrice(product.precio)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold">
                          {formatPrice(finalPrice)}
                        </span>
                      )}
                      {" x unidad"}
                    </p>

                    {/* Contador */}
                    <div className="flex bg-white text-black rounded-lg w-fit items-center relative">
                      {/* Botón restar */}
                      <button
                        onClick={() => handleRemove(product)}
                        disabled={product.cantidad === 1}
                        className={`relative px-4 py-1 font-black rounded-l-lg transition-all duration-200 flex items-center justify-center ${
                          product.cantidad === 1
                            ? "bg-[#bfb200] cursor-not-allowed"
                            : "bg-[#EEDA00] hover:opacity-90 cursor-pointer"
                        }`}
                      >
                        <span className="z-10">-</span>

                        {/* Ícono prohibido al hover */}
                        {product.cantidad === 1 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                            className="absolute w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <line x1="5" y1="19" x2="19" y2="5" />
                          </svg>
                        )}
                      </button>

                      {/* Cantidad */}
                      <p className="px-4">{product.cantidad}</p>

                      {/* Botón sumar */}
                      <button
                        onClick={() => addToCart(product)}
                        className="px-4 py-1 font-black bg-[#EEDA00] rounded-r-lg cursor-pointer hover:opacity-90"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Botón eliminar producto */}
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
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

                  {/* Subtotal */}
                  <div className="font-bold text-lg text-white bg-[#2F2F2F] px-4 py-2 rounded-lg shadow-inner">
                    {formatPrice(subtotal)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Total y botones */}
      {cart.length > 0 && (
        <>
          {/* Desktop */}
          <div className="hidden md:flex flex-col sticky top-[7rem] w-[300px] h-fit self-start">
            <div className="flex flex-col justify-between bg-[#555555] rounded-xl p-5 shadow-lg gap-4">
              <div className="text-white font-bold text-xl">
                Total: {formatPrice(total)}
              </div>
              <button
                onClick={handleBuy}
                className="bg-[#EEDA00] text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:opacity-90 cursor-pointer transition-all duration-200"
              >
                Comprar
              </button>
              <button
                onClick={clearCart}
                className="text-white text-sm underline hover:text-gray-300 mt-2"
              >
                Vaciar carrito
              </button>
            </div>
          </div>

          {/* Móvil */}
          <div className="md:hidden fixed bottom-0 left-0 w-full px-4 pb-4 bg-transparent">
            <div className="flex justify-between bg-[#555555] rounded-xl p-4 shadow-lg">
              <div className="text-white font-bold text-lg">
                Total: {formatPrice(total)}
              </div>
              <button
                onClick={handleBuy}
                className="bg-[#EEDA00] text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:opacity-90 cursor-pointer transition-all duration-200"
              >
                Comprar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
