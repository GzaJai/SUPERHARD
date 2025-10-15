import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0);

  // 🔹 Recalcular cantidad total de unidades en el carrito
  useEffect(() => {
    const totalUnidades = cart.reduce((acc, item) => acc + item.cantidad, 0);
    setCartQuantity(totalUnidades);
  }, [cart]);

  // 🔹 Agregar producto con cantidad personalizada
  const addToCart = (product, cantidad = 1) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        // Si ya existe, aumenta la cantidad
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        // Si no existe, lo agrega con la cantidad deseada
        return [...prevCart, { ...product, cantidad }];
      }
    });
  };

  const removeFromCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (!existingProduct) return prevCart;

      if (existingProduct.cantidad === 1) {
        return prevCart.filter((item) => item.id !== product.id);
      } else {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        );
      }
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, cartQuantity, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
