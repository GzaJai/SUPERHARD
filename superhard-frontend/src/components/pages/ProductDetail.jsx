import React from "react";
import { Link } from "react-router-dom";

const ProductDetail = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-neutral-900 text-white">
      <h1>Detalle del producto</h1>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}

export default ProductDetail;