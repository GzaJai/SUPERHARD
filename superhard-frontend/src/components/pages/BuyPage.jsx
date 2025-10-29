import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import CryptoPaymentForm from './CryptoPaymentForm';

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const MERCADOPAGO_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
const API_URL = import.meta.env.VITE_API_URL || "/api";

initMercadoPago(MERCADOPAGO_KEY, { locale: 'es-AR' });
const stripePromise = loadStripe(STRIPE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#ffffff",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": { color: "#aab7c4" },
      iconColor: "#ffffff",
    },
    invalid: { color: "#fa755a", iconColor: "#fa755a" },
  },
  hidePostalCode: false,
};

const StripePaymentForm = ({ total, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setMessage("Stripe aún no está listo. Por favor, intenta de nuevo.");
      return;
    }

    setProcessing(true);
    setMessage("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${apiUrl}/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: Math.round(total * 100),
          currency: "ars"
        })
      });

      if (!res.ok) throw new Error("Error al crear el pago en el servidor");

      const { clientSecret } = await res.json();
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else if (paymentIntent.status === "succeeded") {
        setMessage("¡Pago exitoso! ✅");
        // Pasar el ID del pago de Stripe
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="flex flex-col gap-4">
      {!stripe && (
        <div className="p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg text-yellow-200">
          ⏳ Cargando Stripe...
        </div>
      )}
      
      <div className="p-4 bg-[#353535] rounded-lg border border-gray-600 min-h-[50px]">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="mt-4 bg-[#EEDA00] text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? "Procesando..." : `Pagar ${total.toFixed(2)} ARS`}
      </button>
      
      {message && (
        <p className={`mt-2 ${message.includes("exitoso") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </form>
  );
};

const BuyPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [mpError, setMpError] = useState(null);
  const [isLoadingMp, setIsLoadingMp] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mercadoPago");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCart);
    const subtotal = savedCart.reduce((acc, item) => acc + parseFloat(item.precio) * item.cantidad, 0);
    setTotal(subtotal);
  }, []);

  // ✅ NUEVO: Detectar callback de MercadoPago
  useEffect(() => {
    const status = searchParams.get("status");
    const paymentId = searchParams.get("payment_id");
    
    if (status === "approved" && paymentId) {
      // El pago fue aprobado, guardar la venta
      const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      if (savedCart.length > 0) {
        handlePaymentSuccess(paymentId);
      }
    } else if (status === "failure") {
      alert("El pago fue rechazado. Intenta nuevamente.");
    } else if (status === "pending") {
      alert("Tu pago está pendiente de aprobación.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (paymentMethod !== "mercadoPago") {
      setPreferenceId(null);
      setMpError(null);
      return;
    }

    if (cartItems.length > 0) {
      setIsLoadingMp(true);
      setMpError(null);
      setPreferenceId(null);

      // ✅ Incluir URLs de retorno
      fetch(`${API_URL}/payments/create-mercadopago-preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            title: item.nombre,
            quantity: item.cantidad,
            unit_price: parseFloat(item.precio),
            currency_id: "ARS",
          })),
          back_urls: {
            success: `${window.location.origin}/buy?status=approved`,
            failure: `${window.location.origin}/buy?status=failure`,
            pending: `${window.location.origin}/buy?status=pending`
          },
          auto_return: "approved"
        }),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message || 'Error del servidor') });
        }
        return response.json();
      })
      .then(data => {
        setPreferenceId(data.preferenceId);
      })
      .catch(error => {
        console.error("Error al crear preferencia de MP:", error.message);
        setMpError("No se pudo generar el link de pago. Intenta de nuevo.");
      })
      .finally(() => {
        setIsLoadingMp(false);
      });
    }
  }, [paymentMethod, cartItems]);

  const saveOrderToBackend = async (orderData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      console.error("No se pudo guardar la orden: Usuario no logueado.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/payments/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: user.id,
          productos: JSON.stringify(orderData.cartItems),
          total: orderData.total,
          metodoPago: orderData.paymentMethod,
          pagoId: orderData.paymentId,
          email: user.email || "cliente@example.com",
          customerName: `${user.nombre || ''} ${user.apellido || ''}`.trim(),
          cartItems: orderData.cartItems
        }),
      });

      if (response.ok) {
        console.log("✅ Venta guardada y email enviado");
      } else {
        console.error("Error al guardar la venta");
      }
    } catch (error) {
      console.error("Error de red al guardar la venta:", error);
    }
  };

  const handlePaymentSuccess = (paymentId = null) => {
    const orderData = {
      cartItems,
      total,
      date: new Date().toLocaleString(),
      paymentMethod: 
        paymentMethod === "tarjeta" 
          ? "Tarjeta (Stripe)" 
          : paymentMethod === "crypto"
          ? "Criptomonedas"
          : "Mercado Pago",
      paymentId: paymentId
    };
    
    localStorage.setItem("orderSummary", JSON.stringify(orderData));
    
    // Guardar en backend (incluye envío de email)
    saveOrderToBackend(orderData);
    
    // Limpiar carrito DESPUÉS de guardar
    localStorage.removeItem("cartItems");
    
    setShowAnimation(true);
    setTimeout(() => navigate("/order-summary"), 3000);
  };

  return (
    <div className="relative min-h-screen bg-[#494949] text-white px-6 py-10 flex flex-col md:flex-row gap-6 overflow-hidden">
      {showAnimation && (
        <div className="fixed inset-0 z-[9999] bg-[#EEDA00] flex items-center justify-center">
          <h1 className="text-5xl font-black text-black italic animate-pulse">
            ¡Gracias por su compra!
          </h1>
        </div>
      )}

      <div className="flex-1 bg-[#353535] rounded-xl p-6 flex flex-col gap-4 shadow-lg z-10">
        <h2 className="text-2xl font-bold text-[#EEDA00]">Método de pago</h2>
        
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="mercadoPago"
              checked={paymentMethod === "mercadoPago"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4"
            />
            <span>Mercado Pago</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="tarjeta"
              checked={paymentMethod === "tarjeta"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4"
            />
            <span>Tarjeta de Crédito/Débito</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="crypto"
              checked={paymentMethod === "crypto"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4"
            />
            <span>💎 Criptomonedas</span>
          </label>
        </div>

        {paymentMethod === "tarjeta" && (
          <Elements stripe={stripePromise}>
            <StripePaymentForm total={total} onSuccess={handlePaymentSuccess} />
          </Elements>
        )}

        {paymentMethod === "crypto" && (
          <CryptoPaymentForm total={total} onSuccess={handlePaymentSuccess} />
        )}

        {paymentMethod === "mercadoPago" && (
          <div className="mt-4 flex flex-col items-center">
            {isLoadingMp && <p>Generando link de pago...</p>}
            {mpError && <p className="text-red-500">{mpError}</p>}
            {preferenceId && !isLoadingMp && (
              <>
                <Wallet initialization={{ preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} />
                <p className="text-sm text-gray-400 mt-2">
                  Serás redirigido a MercadoPago para completar el pago
                </p>
              </>
            )}
            {!isLoadingMp && !preferenceId && !mpError && cartItems.length === 0 && (
              <p className="text-gray-400">Agrega productos a tu carrito para generar el link de pago.</p>
            )}
          </div>
        )}
      </div>

      <div className="w-full md:w-1/3 bg-[#353535] rounded-xl p-6 flex flex-col gap-4 shadow-lg h-fit z-10">
        <h2 className="text-xl font-bold text-[#EEDA00] mb-2">Resumen del pedido</h2>
        
        {cartItems.length === 0 ? (
          <p className="text-gray-400">Tu carrito está vacío</p>
        ) : (
          <>
            {cartItems.map((product) => (
              <div key={product.id} className="flex justify-between items-center gap-4 bg-[#494949] p-3 rounded-lg">
                <img
                  src={product.image}
                  alt={product.nombre}
                  className="w-16 h-16 object-contain rounded-lg bg-white p-1"
                />
                <div className="flex-1">
                  <p className="font-semibold">{product.nombre}</p>
                  <p className="text-sm text-gray-400">Cantidad: {product.cantidad}</p>
                </div>
                <div className="font-bold text-[#EEDA00]">
                  ${(parseFloat(product.precio) * product.cantidad).toFixed(2)}
                </div>
              </div>
            ))}
            
            <div className="flex justify-between font-bold text-xl pt-4 border-t border-gray-600 text-[#EEDA00]">
              <span>Total:</span>
              <span>${total.toFixed(2)} ARS</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BuyPage;