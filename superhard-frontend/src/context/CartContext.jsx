import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    const totalUnidades = cart.reduce((acc, item) => acc + item.cantidad, 0);
    setCartQuantity(totalUnidades);
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, cantidad = 1) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        return [...prevCart, { ...product, cantidad }];
      }
    });
  };

  // 🔹 Nunca permitir que la cantidad sea menor a 1
  const removeFromCart = (product) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === product.id
          ? { ...item, cantidad: Math.max(item.cantidad - 1, 1) }
          : item
      )
    );
  };

  const deleteFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
  };

  // 🔹 Vaciar todo el carrito al comprar
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartQuantity,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
