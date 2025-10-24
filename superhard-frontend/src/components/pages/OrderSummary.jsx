import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderSummary = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrder = localStorage.getItem("orderSummary");
    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch (err) {
        console.error("Error al cargar el resumen:", err);
      }
    }
  }, []);

  const handleBackHome = () => {
    // 🧹 Limpiar toda la información
    localStorage.removeItem("orderSummary");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cart");
    localStorage.removeItem("cartTotal");

    // Redirigir al inicio
    navigate("/");
  };

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#494949] p-6">
        <div className="bg-[#353535] rounded-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">No hay información de compra</h2>
          <p className="text-gray-400 mb-6">
            No se encontró ningún resumen de orden. Por favor, realiza una compra primero.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#EEDA00] text-black px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#494949] text-white flex flex-col items-center p-6 py-12">
      {/* Animación de éxito */}
      <div className="mb-8 text-center animate-fade-in">
        <div className="text-7xl mb-4">✅</div>
        <h1 className="text-4xl font-bold text-[#EEDA00] mb-2">
          ¡Compra realizada con éxito!
        </h1>
        <p className="text-gray-300">Gracias por tu compra</p>
      </div>

      <div className="bg-[#353535] rounded-xl shadow-2xl p-8 w-full max-w-4xl">
        {/* Información de pago */}
        {order.paymentId && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-600 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-green-400">✓ Pago confirmado</h3>
            <p className="text-sm text-gray-300">
              <strong>ID de transacción:</strong> {order.paymentId}
            </p>
            <p className="text-sm text-gray-300">
              <strong>Método de pago:</strong> {order.paymentMethod || "Tarjeta"}
            </p>
            <p className="text-sm text-gray-300">
              <strong>Fecha:</strong> {order.date}
            </p>
          </div>
        )}

        {/* Datos del comprador (opcional si existen) */}
        {order.contact && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-[#EEDA00] flex items-center gap-2">
              <span>📋</span> Datos del comprador
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#2b2b2b] p-4 rounded-lg">
              <div>
                <p className="text-gray-400 text-sm">Nombre completo</p>
                <p className="font-semibold">
                  {order.contact.firstName} {order.contact.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Correo electrónico</p>
                <p className="font-semibold">{order.contact.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Dirección</p>
                <p className="font-semibold">
                  {order.contact.address}, {order.contact.city}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Código Postal</p>
                <p className="font-semibold">{order.contact.postal}</p>
              </div>
            </div>
          </div>
        )}

        {/* Productos */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#EEDA00] flex items-center gap-2">
            <span>📦</span> Productos comprados
          </h2>
          <div className="space-y-3">
            {order.cartItems.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center bg-[#2b2b2b] p-4 rounded-lg hover:bg-[#333333] transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={p.image}
                    alt={p.nombre}
                    className="w-20 h-20 object-contain bg-white rounded-lg p-2"
                  />
                  <div>
                    <p className="font-semibold text-lg">{p.nombre}</p>
                    <p className="text-gray-400 text-sm">
                      Cantidad: {p.cantidad} × ${parseFloat(p.precio).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-[#EEDA00]">
                    ${(parseFloat(p.precio) * p.cantidad).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t-2 border-gray-600 pt-6 mb-6">
          <div className="flex justify-between items-center text-2xl font-bold">
            <span>Total pagado:</span>
            <span className="text-[#EEDA00] text-3xl">
              ${order.total.toFixed(2)} ARS
            </span>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
          <p className="text-sm text-gray-300">
            📧 Recibirás un correo electrónico con los detalles de tu compra.
          </p>
          <p className="text-sm text-gray-300 mt-2">
            🚚 El pedido será procesado en las próximas 24-48 horas.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleBackHome}
            className="bg-[#EEDA00] text-black px-8 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg"
          >
            Volver al inicio
          </button>
          <button
            onClick={() => window.print()}
            className="bg-[#2b2b2b] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#333333] transition border border-gray-600"
          >
            🖨️ Imprimir resumen
          </button>
        </div>
      </div>

      {/* Mensaje de agradecimiento */}
      <div className="mt-8 text-center text-gray-400">
        <p>¿Necesitas ayuda? Contáctanos a soporte@tutienda.com</p>
      </div>
    </div>
  );
};

export default OrderSummary;