import { createContext, useState, useEffect } from "react"

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [cartQuantity, setCartQuantity] = useState(0);

    useEffect(() => {
        setCartQuantity(cart.length)
    }, [cart])

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingProduct = prevCart.find((item) => item.id == product.id)
            
            if (existingProduct) {
                return prevCart.map(item =>                    
                    item.id == product.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, cantidad: 1 }];
            }
        });        
    };
    
    const removeFromCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.id == product.id)

            if (existingProduct.cantidad == 1) {
                return prevCart.filter(item => item.id !== product.id)
            } else {
                return prevCart.map((item) => 
                    item.id == product.id
                        ? { ...item, cantidad: item.cantidad -1 }
                        : item
                )
            }
        })
    };
    
    return (
        <CartContext.Provider value={{ cart, cartQuantity, addToCart, removeFromCart}}>
            {children}
    </CartContext.Provider>
  )
}

export default CartContext