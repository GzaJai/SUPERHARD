import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const OrderSummary = () => {
  const [order, setOrder] = useState(null);
  const [isMpSuccess, setIsMpSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 1. AÑADIR LA FUNCIÓN PARA GUARDAR LA VENTA
  const saveOrderToDatabase = async (orderData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      console.error("No se pudo guardar la orden de MP: Usuario no logueado.");
      return;
    }

    const venta = {
      usuario: { id: user.id },
      productos: JSON.stringify(orderData.cartItems),
      total: orderData.total,
      metodoPago: orderData.paymentMethod,
      pagoId: orderData.paymentId,
    };

    try {
      await fetch(`${API_URL}/api/ventas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venta),
      });
      console.log("✅ Orden de Mercado Pago guardada en la base de datos.");
    } catch (error) {
      console.error("Error al guardar la orden de MP en la base de datos:", error);
    }
  };

  useEffect(() => {
    const sendConfirmationEmail = async (orderData) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email || "cliente@example.com";

      try {
        await fetch(`${API_URL}/email/send-order-confirmation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, orderData }),
        });
        console.log("📧 Correo de confirmación de MP enviado.");
      } catch (error) {
        console.error("Error al enviar correo de MP:", error);
      }
    };

    // Detectar redirección de Mercado Pago
    const searchParams = new URLSearchParams(location.search);
    const mpStatus = searchParams.get("status");
    const paymentId = searchParams.get("payment_id");

    if (mpStatus === "approved") {
      // Si es un éxito de MP, construimos la orden aquí para el correo.
      // NOTA: El carrito ya no existe, por lo que esta es una reconstrucción parcial.
      // Leemos el carrito y total guardados antes del checkout de MP.
      const savedCart = JSON.parse(localStorage.getItem('mp_checkout_cart') || '[]');
      const savedTotal = JSON.parse(localStorage.getItem('mp_checkout_total') || '0');

      const orderData = {
        cartItems: savedCart,
        total: savedTotal,
        date: new Date().toLocaleString(),
        paymentMethod: "Mercado Pago",
        paymentId: paymentId,
      };

      // Intentamos enviar un correo de notificación simple
      sendConfirmationEmail(orderData);

      // ✅ 2. LLAMAR A LA FUNCIÓN DE GUARDADO
      saveOrderToDatabase(orderData);

      setIsMpSuccess(true);
      // Limpiamos el carrito ya que el pago fue exitoso
      localStorage.removeItem("cartItems");
      localStorage.removeItem('mp_checkout_cart'); // Limpieza
      localStorage.removeItem('mp_checkout_total'); // Limpieza
      return; // No intentamos cargar desde localStorage
    }

    const savedOrder = localStorage.getItem("orderSummary");
    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch (err) {
        console.error("Error al cargar el resumen:", err);
      }
    }
  }, [location.search]);

  const handleBackHome = () => {
    // 🧹 Limpiar toda la información
    localStorage.removeItem("orderSummary");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cart");
    localStorage.removeItem("cartTotal");

    // Redirigir al inicio
    navigate("/");
  };

  // Renderizado especial para éxito de Mercado Pago
  if (isMpSuccess) {
    const searchParams = new URLSearchParams(location.search);
    return (
      <div className="min-h-screen bg-[#494949] text-white flex flex-col items-center p-6 py-12">
        <div className="mb-8 text-center animate-fade-in">
          <div className="text-7xl mb-4">✅</div>
          <h1 className="text-4xl font-bold text-[#EEDA00] mb-2">
            ¡Compra realizada con éxito!
          </h1>
          <p className="text-gray-300">Gracias por tu compra a través de Mercado Pago</p>
        </div>
        <div className="bg-[#353535] rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
          <h3 className="text-lg font-semibold mb-2 text-green-400">✓ Pago confirmado</h3>
          <p className="text-sm text-gray-300"><strong>ID de transacción:</strong> {searchParams.get("payment_id")}</p>
          <p className="text-sm text-gray-300"><strong>Método de pago:</strong> Mercado Pago</p>
          <button
            onClick={handleBackHome}
            className="mt-6 bg-[#EEDA00] text-black px-8 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!order && !isMpSuccess) {
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
                      Cantidad: {p.cantidad} × ${ p.descuento > 0 
                        ? (parseFloat(p.precio) * (1 - p.descuento / 100)).toFixed(2)
                        : parseFloat(p.precio).toFixed(2) }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {p.descuento > 0 ? (
                    <>
                      <p className="font-bold text-xl text-green-400">
                        ${(parseFloat(p.precio) * (1 - p.descuento / 100) * p.cantidad).toFixed(2)}
                      </p>
                      <p className="text-gray-500 line-through text-sm">
                        ${(parseFloat(p.precio) * p.cantidad).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="font-bold text-xl text-[#EEDA00]">
                      ${(parseFloat(p.precio) * p.cantidad).toFixed(2)}
                    </p>
                  )}
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