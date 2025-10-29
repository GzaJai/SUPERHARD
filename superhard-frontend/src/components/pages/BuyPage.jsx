import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import CryptoPaymentForm from './CryptoPaymentForm';

// ✅ Para Vite: import.meta.env (NO process.env)
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const MERCADOPAGO_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Inicializa Mercado Pago con tu clave pública
initMercadoPago(MERCADOPAGO_KEY, { locale: 'es-AR' });
const stripePromise = loadStripe(STRIPE_KEY);

// Debug
console.log("Stripe Key:", STRIPE_KEY ? "✅ Cargada" : "❌ No encontrada");
console.log("MercadoPago Key:", MERCADOPAGO_KEY ? "✅ Cargada" : "❌ No encontrada");
console.log("API URL:", API_URL);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#ffffff",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
      iconColor: "#ffffff",
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
  hidePostalCode: false,
};

const StripePaymentForm = ({ total, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  // Debug: Verifica que Stripe se cargó
  useEffect(() => {
    console.log("Stripe cargado:", stripe ? "✅ Sí" : "⏳ Esperando...");
    console.log("Elements cargado:", elements ? "✅ Sí" : "⏳ Esperando...");
  }, [stripe, elements]);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setMessage("Stripe aún no está listo. Por favor, intenta de nuevo.");
      return;
    }

    setProcessing(true);
    setMessage("");

    try {
      // ✅ CORREGIDO: Para Vite usa import.meta.env
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: Math.round(total * 100), // Monto en centavos
          currency: "ars" // Especifica la moneda
        })
      });

      if (!res.ok) {
        throw new Error("Error al crear el pago en el servidor");
      }

      const { clientSecret, originalAmount, originalCurrency, exchangeRate } = await res.json();

      // Mostrar información de conversión si aplica
      if (originalCurrency === "ars") {
        const arsAmount = (originalAmount / 100).toFixed(2);
        console.log(`💱 Conversión: ${arsAmount} ARS → ${(total * exchangeRate).toFixed(2)} USD`);
      }

      // 2️⃣ Confirmar pago con Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else if (paymentIntent.status === "succeeded") {
        setMessage("¡Pago exitoso! ✅");
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
      {/* Indicador de carga de Stripe */}
      {!stripe && (
        <div className="p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg text-yellow-200">
          ⏳ Cargando Stripe... Si esto tarda mucho, verifica tu clave en el .env
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

      {/* Tarjetas de prueba */}
      <div className="mt-4 p-3 bg-gray-700 rounded text-sm">
        <p className="font-bold mb-2">🧪 Tarjetas de prueba:</p>
        <p>✅ Éxito: 4242 4242 4242 4242</p>
        <p>❌ Error: 4000 0000 0000 0002</p>
        <p>🔐 Requiere autenticación: 4000 0025 0000 3155</p>
        <p>Fecha: cualquier fecha futura | CVV: cualquier 3 dígitos</p>
      </div>
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

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCart);
    const subtotal = savedCart.reduce((acc, item) => acc + parseFloat(item.precio) * item.cantidad, 0);
    setTotal(subtotal);
  }, []);

  // Efecto para crear la preferencia de Mercado Pago
  useEffect(() => {
    // Resetea el preferenceId si se cambia de método de pago
    if (paymentMethod !== "mercadoPago") {
      setPreferenceId(null);
      setMpError(null);
      return;
    }

    // Solo intentar crear la preferencia si hay items en el carrito
    if (cartItems.length > 0) {
      setIsLoadingMp(true);
      setMpError(null);
      setPreferenceId(null); // Resetea el ID anterior

      fetch(`${API_URL}/payments/create-mercadopago-preference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            title: item.nombre,
            quantity: item.cantidad,
            unit_price: parseFloat(item.precio),
            currency_id: "ARS",
          })),
        }),
      })
      .then(response => {
        if (!response.ok) {
          // Si la respuesta no es 2xx, lanza un error para que lo capture el .catch()
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
  }, [paymentMethod, cartItems]); // Se ejecuta cuando cambia el método o el carrito

  const sendConfirmationEmail = async (orderData) => {
    // Aquí asumimos que el email del usuario está en localStorage.
    // En una app real, lo obtendrías del estado de autenticación (Context, Redux, etc.).
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email || "cliente@example.com"; // Email de respaldo

    try {
      const response = await fetch(`${API_URL}/email/send-order-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, orderData }),
      });
      if (response.ok) {
        console.log("📧 Correo de confirmación enviado.");
      } else {
        console.error("Error al enviar el correo de confirmación.");
      }
    } catch (error) {
      console.error("Error de red al intentar enviar el correo:", error);
    }
  };

  const handlePaymentSuccess = (paymentId = null) => {
    // Guardar resumen de orden y limpiar carrito
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
    localStorage.removeItem("cartItems");

    // Enviar correo de confirmación
    sendConfirmationEmail(orderData);
    
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

      {/* Formulario de pago */}
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
              <Wallet initialization={{ preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} />
            )}
            {!isLoadingMp && !preferenceId && !mpError && cartItems.length === 0 && (
              <p className="text-gray-400">Agrega productos a tu carrito para generar el link de pago.</p>
            )}
          </div>
        )}
      </div>

      {/* Resumen del carrito */}
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