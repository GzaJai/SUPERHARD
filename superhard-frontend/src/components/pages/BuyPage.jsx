import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BuyPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();

  const [contact, setContact] = useState({
    email: "",
    province: "",
    city: "",
    postal: "",
    firstName: "",
    lastName: "",
    address: "",
    department: "",
  });

  const [payment, setPayment] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCart);

    const subtotal = savedCart.reduce((acc, item) => {
      const price = parseFloat(item.precio.toString().replace(/[^0-9.]/g, ""));
      return acc + price * item.cantidad;
    }, 0);

    setTotal(subtotal);
  }, []);

  const handleContactChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderData = {
      contact,
      payment,
      cartItems,
      total,
      date: new Date().toLocaleString(),
    };

    localStorage.setItem("orderSummary", JSON.stringify(orderData));
    localStorage.removeItem("cartItems");

    setShowAnimation(true);

    setTimeout(() => {
      navigate("/order-summary");
    }, 5000); // ⏱️ Espera a que termine la animación
  };

  const inputClass =
    "w-full p-2 bg-[#353535] text-[#fff] border-b-2 border-[#EEDA00] outline-none focus:border-white transition-colors duration-200";

  const camposDireccion = [
    { name: "province", placeholder: "Provincia" },
    { name: "city", placeholder: "Ciudad" },
    { name: "postal", placeholder: "Código Postal" },
    { name: "firstName", placeholder: "Nombre" },
    { name: "lastName", placeholder: "Apellido" },
    { name: "address", placeholder: "Dirección" },
    { name: "department", placeholder: "Departamento / Piso (opcional)" },
  ];

  return (
    <div className="relative min-h-screen bg-[#494949] text-white px-6 py-10 flex flex-col md:flex-row gap-6 overflow-hidden">
      {showAnimation && (
        <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#EEDA00] animate-wave-fill flex items-center justify-center">
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#EEDA00"
              fillOpacity="1"
              d="M0,192L80,213.3C160,235,320,277,480,277.3C640,277,800,235,960,208C1120,181,1280,171,1360,165.3L1440,160L1440,320L0,320Z"
            >
              <animate
                attributeName="d"
                dur="3s"
                repeatCount="indefinite"
                values="
                  M0,192L80,213.3C160,235,320,277,480,277.3C640,277,800,235,960,208C1120,181,1280,171,1360,165.3L1440,160L1440,320L0,320Z;
                  M0,220L80,240C160,260,320,300,480,300C640,300,800,260,960,230C1120,200,1280,190,1360,185L1440,180L1440,320L0,320Z;
                  M0,192L80,213.3C160,235,320,277,480,277.3C640,277,800,235,960,208C1120,181,1280,171,1360,165.3L1440,160L1440,320L0,320Z
                "
              />
            </path>
          </svg>

          <h1 className="text-5xl md:text-6xl font-black text-black italic animate-fade-in">
            ¡Gracias por su compra!
          </h1>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex-1 bg-[#353535] rounded-xl p-6 flex flex-col gap-6 shadow-lg z-10"
      >
        <h2 className="text-2xl font-bold text-[#EEDA00]">
          Pago por transferencia
        </h2>
        <div className="flex gap-2 items-center flex-wrap">
          <img
            src="https://vectorseek.com/wp-content/uploads/2023/09/MercadoPago-Logo-Vector.svg-.png"
            alt="Mercado Pago"
            className="w-16 h-16 object-contain"
          />
          <img
            src="https://cdn.worldvectorlogo.com/logos/bitcoin-logo.svg"
            alt="Bitcoin"
            className="w-16 h-16 object-contain"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
            alt="MasterCard"
            className="w-16 h-16 object-contain"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            alt="PayPal"
            className="w-16 h-16 object-contain"
          />
        </div>

        <h3 className="text-xl font-semibold text-[#EEDA00]">
          Información de contacto
        </h3>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={contact.email}
          onChange={handleContactChange}
          className={inputClass}
        />

        <h3 className="text-xl font-semibold text-[#EEDA00]">
          Dirección de entrega
        </h3>
        {camposDireccion.map((field) => (
          <input
            key={field.name}
            type="text"
            name={field.name}
            placeholder={field.placeholder}
            value={contact[field.name]}
            onChange={handleContactChange}
            className={inputClass}
          />
        ))}

        <h3 className="text-xl font-semibold text-[#EEDA00]">
          Información de pago
        </h3>
        <input
          type="text"
          name="cardNumber"
          placeholder="Número de tarjeta"
          value={payment.cardNumber}
          onChange={handlePaymentChange}
          className={inputClass}
        />
        <input
          type="text"
          name="nameOnCard"
          placeholder="Nombre en la tarjeta"
          value={payment.nameOnCard}
          onChange={handlePaymentChange}
          className={inputClass}
        />
        <div className="flex gap-2">
          {["expiryMonth", "expiryYear", "cvv"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={
                field === "expiryMonth"
                  ? "Mes"
                  : field === "expiryYear"
                  ? "Año"
                  : "CVV"
              }
              value={payment[field]}
              onChange={handlePaymentChange}
              className="w-1/3 p-2 bg-[#353535] text-[#fff] border-b-2 border-[#EEDA00] outline-none focus:border-white transition-colors duration-200"
            />
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 bg-[#EEDA00] text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:opacity-90 cursor-pointer transition-all duration-200"
        >
          Finalizar compra
        </button>
      </form>

      <div className="w-full md:w-1/3 bg-[#353535] rounded-xl p-6 flex flex-col gap-4 shadow-lg h-fit z-10">
        {cartItems.map((product) => (
          <div
            key={product.id}
            className="flex justify-between items-center gap-4 bg-[#353535] p-2 rounded-lg"
          >
            <img
              src={product.img}
              alt={product.nombre}
              className="w-20 h-20 object-contain rounded-xl bg-white p-2"
            />
            <div className="flex-1">{product.nombre}</div>
            <div className="font-bold">
              {product.precio} x {product.cantidad}
            </div>
          </div>
        ))}

        <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-400">
          <span>Subtotal:</span>
          <span>${total.toFixed(3)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Envío:</span>
          <span>$0</span>
        </div>
      </div>

      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 1.5s ease-out forwards;
          }

          @keyframes wave-fill {
            0% { transform: translateY(100%); }
            100% { transform: translateY(0%); }
          }
          .animate-wave-fill {
            animation: wave-fill 2.5s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default BuyPage;
