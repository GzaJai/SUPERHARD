import React from "react";
import Header from "./components/Header";
import Carousel from "./components/Carousel";
import "./index.css";
import "./App.css";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-neutral-900 text-white">
      <Header />
      <main className="flex-1 p-5">
        <Carousel />

        <h2>Contenido principal de la página</h2>
      </main>
    </div>
  );
}


