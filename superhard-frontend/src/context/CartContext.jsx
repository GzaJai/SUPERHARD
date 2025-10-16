import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [cartQuantity, setCartQuantity] = useState(0);

  // 🔹 Cargar carrito desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // 🔹 Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    const totalUnidades = cart.reduce((acc, item) => acc + item.cantidad, 0);
    setCartQuantity(totalUnidades);
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

    // 🔹 Limpiar carrito completo
  const clearCart = () => {
    setCart([]);
  };


  // 🔹 Agregar producto al carrito
  const addToCart = (product, cantidad = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prevCart, { ...product, cantidad }];
    });
  };

  // 🔹 Quitar producto del carrito
  const removeFromCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (!existing) return prevCart;

      if (existing.cantidad === 1) {
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
    <CartContext.Provider value={{ cart, cartQuantity, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
