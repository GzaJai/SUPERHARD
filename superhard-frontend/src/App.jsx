import React, { use, useEffect } from "react";
import Header from "./components/Header";
import Carousel from "./components/Carousel";
import "./index.css";
import "./App.css";
import AppRouter from "./routes/AppRouter";
import { CartProvider } from "./context/CartContext";

export default function App() {
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

  return (
<<<<<<< HEAD
    <CartProvider>
      <AppRouter />
    </CartProvider>
=======
    <AppRouter user={user} setUser={setUser}/>
>>>>>>> main
  );
}


