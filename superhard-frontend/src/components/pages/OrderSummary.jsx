import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const OrderSummary = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("orderSummary"));
    if (savedOrder) setOrder(savedOrder);
  }, []);

  const handleBackHome = () => {
    // 🧹 Borrar toda la información anterior
    localStorage.removeItem("orderSummary");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cartTotal");

    // Redirigir al inicio
    navigate("/");
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#494949]">
        <p>No hay información de compra disponible.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#494949] text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-[#EEDA00] mb-6">
        Resumen de tu compra
      </h1>

      <div className="bg-[#353535] rounded-xl shadow-lg p-6 w-full md:w-2/3">
        <h2 className="text-2xl font-semibold mb-4">Datos del comprador</h2>
        <p>
          <strong>Nombre:</strong> {order.contact.firstName}{" "}
          {order.contact.lastName}
        </p>
        <p>
          <strong>Correo electrónico:</strong> {order.contact.email}
        </p>
        <p>
          <strong>Dirección:</strong> {order.contact.address},{" "}
          {order.contact.city}, {order.contact.province}
        </p>
        <p>
          <strong>Código Postal:</strong> {order.contact.postal}
        </p>
        <p>
          <strong>Fecha:</strong> {order.date}
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Productos</h2>
        {order.cartItems.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center bg-[#2b2b2b] p-3 rounded-lg mb-2"
          >
            <div className="flex items-center gap-3">
              <img
                src={p.img}
                alt={p.nombre}
                className="w-16 h-16 object-contain bg-white rounded-xl p-2"
              />
              <span>{p.nombre}</span>
            </div>
            <span className="font-bold">
              {p.precio} x {p.cantidad}
            </span>
          </div>
        ))}

        <div className="flex justify-between mt-4 border-t border-gray-500 pt-4 text-xl font-bold">
          <span>Total:</span>
          <span>${order.total.toFixed(3)}</span>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleBackHome}
            className="bg-[#EEDA00] text-black px-6 py-3 rounded-xl font-bold hover:opacity-90 transition hover: cursor-pointer"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
