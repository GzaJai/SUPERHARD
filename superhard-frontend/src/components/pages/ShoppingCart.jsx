import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../../context/CartContext";

const ShoppingCart = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const toNumber = (precio) => {
    if (typeof precio === "number") return precio;
    return Number(precio.toString().replace(/[^0-9.-]+/g, ""));
  };

  const handleBuy = () => {
    if (cart.length === 0) return;
    // Guardamos el carrito en localStorage para que BuyPage lo pueda leer
    localStorage.setItem("cartItems", JSON.stringify(cart));
    navigate("/buy"); // Redirigimos al checkout
  };

  return (
    <div className="bg-[#494949] min-h-screen pt-[1rem]">
      <div className="flex items-center justify-center gap-[1rem] mb-4">
        <h2 className="font-bold text-white text-3xl">Mi carrito</h2>
      </div>

      <div className="flex flex-col w-11/12 mx-auto bg-[#646464] rounded-lg gap-4 p-4">
        {cart.length === 0 && <p className="text-white">Tu carrito está vacío</p>}

        {cart.map((product) => (
          <div key={product.id} className="flex justify-between items-center bg-[#5A5A5A] rounded-lg p-4">
            <img
              src={product.image}
              className="w-[8rem] h-auto rounded-xl"
              alt={product.nombre}
            />
            <div className="flex flex-col gap-2 text-white flex-1 px-4">
              <p className="font-semibold">{product.nombre}</p>
              <p>
                <span className="font-bold">${toNumber(product.precio)}</span> x unidad
              </p>

              <div className="flex bg-white text-black rounded-lg justify-between items-center w-32">
                <button
                  onClick={() => removeFromCart(product)}
                  className="px-2 py-1 font-black bg-[#EEDA00] rounded-l-lg"
                >
                  -
                </button>
                <p className="font-bold px-2">{product.cantidad}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="px-2 py-1 font-black bg-[#EEDA00] rounded-r-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex w-1/4 justify-center text-white font-bold">
              ${toNumber(product.precio) * product.cantidad}
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="text-white mt-4 p-4 text-right">
          <p>Total: ${cart.reduce((acc, item) => acc + toNumber(item.precio) * item.cantidad, 0)}</p>
          <button
            onClick={handleBuy}
            className="bg-[#EEDA00] text-black font-bold py-2 px-4 rounded-lg mt-2 hover:bg-yellow-400"
          >
            Comprar ahora
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
