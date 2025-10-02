import React from "react";
import Header from "./components/Header";
import Carousel from "./components/Carousel";
import "./index.css";
import "./App.css";
import AppRouter from "./routes/AppRouter";
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <AppRouter />
    </CartProvider>
  );
}


