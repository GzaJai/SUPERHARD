import { createContext, useState, useEffect } from "react"

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [cartQuantity, setCartQuantity] = useState(0);

    useEffect(() => {
        setCartQuantity(cart.length)
    }, [cart])

    const addToCart = (product) => {
        setCart((prev) => [...prev, product]);
    };
    
    const removeFromCart = () => {
        setCart((prev) => prev.filter(item => item.id !== id));
    };
    
    return (
        <CartContext.Provider value={{ cart, cartQuantity, addToCart, removeFromCart}}>
            {children}
    </CartContext.Provider>
  )
}

export default CartContext