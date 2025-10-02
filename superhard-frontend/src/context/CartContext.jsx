import { createContext, useState } from "react"

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prev) => [...prev, product]);
    };

    const removeFromCart = () => {
        setCart((prev) => prev.filter(item => item.id !== id));
    };
    
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
    </CartContext.Provider>
  )
}

export default CartContext