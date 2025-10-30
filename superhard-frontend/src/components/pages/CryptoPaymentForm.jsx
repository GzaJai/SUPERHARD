import { useState, useEffect } from "react";

const CryptoPaymentForm = ({ total, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentData, setPaymentData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("btc");
  const [currencies, setCurrencies] = useState([]);
  const [estimatedAmount, setEstimatedAmount] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  // Cargar criptomonedas disponibles
  useEffect(() => {
    const loadCurrencies = async () => {
      // Primero cargar monedas por defecto inmediatamente
      const defaultCurrencies = ['btc', 'eth', 'usdt', 'ltc', 'bnb', 'doge', 'trx'];
      setCurrencies(defaultCurrencies);

      // Intentar cargar de la API (opcional)
      try {
        const res = await fetch(`${API_URL}/crypto-payments/currencies`);
        if (res.ok) {
          const data = await res.json();
          console.log("✅ Monedas cargadas:", data);
          // Filtrar solo las más populares para el UI
          const popular = ['btc', 'eth', 'usdt', 'ltc', 'bnb', 'trx', 'doge', 'ada', 'xrp', 'sol'];
          const apiCurrencies = data.currencies || [];
          const filtered = apiCurrencies.filter(c => popular.includes(c.toLowerCase()));
          if (filtered.length > 0) {
            setCurrencies(filtered);
          }
        }
      } catch (err) {
        console.log("ℹ️ Usando monedas por defecto (API no disponible)");
      }
    };
    loadCurrencies();
  }, [API_URL]);

  // Estimar cantidad cuando cambia la crypto seleccionada
  useEffect(() => {
    if (selectedCrypto && total > 0) {
      estimateAmount();
    }
  }, [selectedCrypto, total]);

  const estimateAmount = async () => {
    // Convertir ARS a USD (aproximado)
    const usdAmount = total * 0.00067;

    // Caso especial para USDT: es 1:1 con USD, no necesita estimación.
    if (selectedCrypto.toLowerCase() === 'usdt') {
      setEstimatedAmount(usdAmount.toFixed(2)); // Mostramos el monto en USD directamente
      return;
    }

    try {
      const res = await fetch(`${API_URL}/crypto-payments/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: usdAmount,
          currency_from: 'usd',
          currency_to: selectedCrypto
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setEstimatedAmount(data.estimated_amount);
      } else {
        setEstimatedAmount(null); // Limpiar estimación si hay error
      }
    } catch (err) {
      console.log("No se pudo estimar (normal en sandbox):", err);
      setEstimatedAmount(null);
    }
  };

  const handleCryptoPayment = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Convertir ARS a USD (aproximado: 1 USD = 1500 ARS)
      const usdAmount = (total * 0.00067).toFixed(2);

      const res = await fetch(`${API_URL}/crypto-payments/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price_amount: usdAmount,
          price_currency: "usd",
          pay_currency: selectedCrypto,
          description: `Compra e-commerce - ${total.toFixed(2)} ARS`,
          order_id: "ORDER-" + Date.now()
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al crear el pago");
      }

      const data = await res.json();
      console.log("✅ Pago crypto creado:", data);

      setPaymentData(data);
      setShowModal(true);
      
      // Empezar a verificar el estado
      startStatusPolling(data.payment_id);

    } catch (err) {
      setMessage(`Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startStatusPolling = (paymentId) => {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutos (cada 5 segundos)

    const intervalId = setInterval(async () => {
      attempts++;
      
      try {
        const res = await fetch(`${API_URL}/crypto-payments/payment-status/${paymentId}`);
        const data = await res.json();
        
        console.log(`🔍 Estado del pago (${attempts}/${maxAttempts}):`, data.payment_status);
        
        if (data.payment_status === "finished") {
          clearInterval(intervalId);
          setMessage("¡Pago confirmado! ✅");
          setShowModal(false);
          setTimeout(() => onSuccess(paymentId), 1000);
        } else if (data.payment_status === "failed" || data.payment_status === "expired") {
          clearInterval(intervalId);
          setMessage(`Pago ${data.payment_status} ❌`);
          setShowModal(false);
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          setMessage("Tiempo de espera agotado. Verifica el estado manualmente.");
        }
      } catch (err) {
        console.error("Error verificando estado:", err);
      }
    }, 5000);
  };

  const getCryptoName = (symbol) => {
    const names = {
      btc: "Bitcoin",
      eth: "Ethereum",
      usdt: "Tether",
      ltc: "Litecoin",
      bnb: "Binance Coin",
      trx: "Tron",
      doge: "Dogecoin",
      ada: "Cardano",
      xrp: "Ripple",
      sol: "Solana",
      matic: "Polygon",
      dot: "Polkadot"
    };
    return names[symbol?.toLowerCase()] || symbol?.toUpperCase() || "Crypto";
  };

  const getCryptoIcon = (symbol) => {
    const icons = {
      btc: "₿",
      eth: "Ξ",
      usdt: "₮",
      ltc: "Ł",
      bnb: "⛏",
      trx: "◈",
      doge: "Ð",
      ada: "₳",
      xrp: "✕",
      sol: "◎",
      matic: "⬡",
      dot: "●"
    };
    return icons[symbol?.toLowerCase()] || "💎";
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("¡Dirección copiada al portapapeles!");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg border border-purple-500">
        <h3 className="font-bold text-lg mb-2 text-purple-200">💎 Pago con Criptomonedas</h3>
        <p className="text-sm text-gray-300 mb-4">
          Powered by NOWPayments - Acepta 300+ criptomonedas
        </p>
        
        {/* Selector de criptomoneda */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">Selecciona tu criptomoneda:</label>
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none text-base"
          >
            {currencies.length === 0 ? (
              <option>Cargando...</option>
            ) : (
              currencies.map(currency => (
                <option key={currency} value={currency.toLowerCase()}>
                  {getCryptoIcon(currency)} {getCryptoName(currency)} ({currency.toUpperCase()})
                </option>
              ))
            )}
          </select>
          {currencies.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {currencies.length} criptomonedas disponibles
            </p>
          )}
        </div>

        {estimatedAmount && (
          <div className="mb-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-400">Cantidad estimada:</p>
            <p className="text-lg font-bold text-white">
              {estimatedAmount} {selectedCrypto.toUpperCase()}
            </p>
          </div>
        )}

        <button
          onClick={handleCryptoPayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creando pago..." : `💰 Pagar ${total.toFixed(2)} ARS con ${selectedCrypto.toUpperCase()}`}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg ${
          message.includes("confirmado") 
            ? "bg-green-900/50 border border-green-600 text-green-200" 
            : "bg-red-900/50 border border-red-600 text-red-200"
        }`}>
          {message}
        </div>
      )}

      {/* Modal de pago */}
      {showModal && paymentData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#353535] rounded-xl p-6 max-w-lg w-full border border-purple-500 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-purple-300">
              💎 Pagar con {getCryptoName(paymentData.pay_currency)}
            </h3>
            
            <div className="space-y-4 mb-6">
              {/* Monto a pagar */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Monto total:</p>
                <p className="text-2xl font-bold text-white">
                  {paymentData.price_amount} {paymentData.price_currency.toUpperCase()}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  ≈ {total.toFixed(2)} ARS
                </p>
              </div>

              {/* Cantidad en crypto */}
              <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 rounded-lg border-2 border-purple-500">
                <p className="text-sm text-gray-300 mb-1">Enviar exactamente:</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-white">
                    {paymentData.pay_amount} {paymentData.pay_currency.toUpperCase()}
                  </p>
                  <span className="text-4xl">{getCryptoIcon(paymentData.pay_currency)}</span>
                </div>
              </div>

              {/* Dirección de pago */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Dirección de pago:</p>
                <div className="bg-gray-800 p-3 rounded flex items-center gap-2">
                  <p className="text-xs font-mono text-green-400 break-all flex-1">
                    {paymentData.pay_address}
                  </p>
                  <button
                    onClick={() => copyToClipboard(paymentData.pay_address)}
                    className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm"
                  >
                    📋
                  </button>
                </div>
              </div>

              {/* Estado */}
              <div className="bg-yellow-900/30 border border-yellow-600 p-3 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  ⏳ <strong>Estado:</strong> {paymentData.payment_status}
                </p>
                <p className="text-yellow-200 text-xs mt-2">
                  Esperando confirmación de la transacción en la blockchain...
                </p>
              </div>

              {/* Instrucciones */}
              <div className="bg-gray-700 p-4 rounded-lg text-sm">
                <p className="font-bold text-white mb-2">📝 Instrucciones:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-300">
                  <li>Copia la dirección de pago</li>
                  <li>Abre tu wallet de {getCryptoName(paymentData.pay_currency)}</li>
                  <li>Envía <strong>exactamente</strong> {paymentData.pay_amount} {paymentData.pay_currency.toUpperCase()}</li>
                  <li>Espera la confirmación (puede tardar unos minutos)</li>
                </ol>
              </div>

              {/* Modo sandbox */}
              <div className="bg-blue-900/30 border border-blue-600 p-3 rounded-lg">
                <p className="text-blue-200 text-xs">
                  🧪 <strong>Modo Sandbox:</strong> Este es un pago de prueba. 
                  En el dashboard de NOWPayments puedes simular la confirmación del pago.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition font-bold"
            >
              Cerrar (seguir esperando en segundo plano)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoPaymentForm;