import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BuyPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [errors, setErrors] = useState({});
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

  const validateFields = () => {
    const newErrors = {};

    // 📧 Email
    if (!contact.email.trim())
      newErrors.email = "El correo electrónico es obligatorio.";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(contact.email))
      newErrors.email = "El correo electrónico no es válido.";

    // 📍 Provincia
    if (!contact.province.trim())
      newErrors.province = "La provincia es obligatoria.";

    // 🏙️ Ciudad
    if (!contact.city.trim())
      newErrors.city = "La ciudad es obligatoria.";

    // 🏷️ Código postal
    if (!contact.postal.trim())
      newErrors.postal = "El código postal es obligatorio.";
    else if (!/^\d{4,8}$/.test(contact.postal))
      newErrors.postal = "Ingrese un código postal válido.";

    // 👤 Nombre y Apellido
    if (!contact.firstName.trim())
      newErrors.firstName = "El nombre es obligatorio.";
    else if (!/^[a-zA-ZÀ-ÿ\s]{2,30}$/.test(contact.firstName))
      newErrors.firstName = "Ingrese un nombre válido.";

    if (!contact.lastName.trim())
      newErrors.lastName = "El apellido es obligatorio.";
    else if (!/^[a-zA-ZÀ-ÿ\s]{2,30}$/.test(contact.lastName))
      newErrors.lastName = "Ingrese un apellido válido.";

    // 🏠 Dirección
    if (!contact.address.trim())
      newErrors.address = "La dirección es obligatoria.";

    // 💳 Tarjeta
    if (!payment.cardNumber.trim())
      newErrors.cardNumber = "El número de tarjeta es obligatorio.";
    else if (!/^\d{16}$/.test(payment.cardNumber))
      newErrors.cardNumber = "El número de tarjeta debe tener 16 dígitos.";

    if (!payment.nameOnCard.trim())
      newErrors.nameOnCard = "El nombre del titular es obligatorio.";
    else if (!/^[a-zA-ZÀ-ÿ\s]{3,}$/.test(payment.nameOnCard))
      newErrors.nameOnCard = "Ingrese un nombre válido.";

    if (!payment.expiryMonth.trim())
      newErrors.expiryMonth = "El mes es obligatorio.";
    else {
      const mes = parseInt(payment.expiryMonth, 10);
      if (isNaN(mes) || mes < 1 || mes > 12)
        newErrors.expiryMonth = "Ingrese un mes válido (01-12).";
    }

    if (!payment.expiryYear.trim())
      newErrors.expiryYear = "El año es obligatorio.";
    else {
      const año = parseInt(payment.expiryYear, 10);
      const añoActual = new Date().getFullYear() % 100;
      if (año < añoActual)
        newErrors.expiryYear = "La tarjeta está vencida.";
      if (!/^\d{2,4}$/.test(payment.expiryYear))
        newErrors.expiryYear = "Año inválido.";
    }

    if (!payment.cvv.trim())
      newErrors.cvv = "El CVV es obligatorio.";
    else if (!/^\d{3,4}$/.test(payment.cvv))
      newErrors.cvv = "El CVV debe tener 3 o 4 dígitos.";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

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
    setTimeout(() => navigate("/order-summary"), 5000);
  };

  const inputClass = (name) =>
    `w-full p-2 bg-[#353535] text-[#fff] border-b-2 ${
      errors[name]
        ? "border-red-500 focus:border-red-400"
        : "border-[#EEDA00] focus:border-white"
    } outline-none transition-colors duration-200`;

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
      {/* 🟡 Animación */}
      {showAnimation && (
        <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#EEDA00] animate-wave-fill flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-black text-black italic animate-fade-in">
            ¡Gracias por su compra!
          </h1>
        </div>
      )}

      {/* 🧾 Formulario */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 bg-[#353535] rounded-xl p-6 flex flex-col gap-4 shadow-lg z-10"
      >
        <h2 className="text-2xl font-bold text-[#EEDA00]">Pago con tarjeta</h2>

        <h3 className="text-xl font-semibold text-[#EEDA00]">
          Información de contacto
        </h3>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={contact.email}
          onChange={handleContactChange}
          className={inputClass("email")}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <h3 className="text-xl font-semibold text-[#EEDA00]">
          Dirección de entrega
        </h3>
        {camposDireccion.map((f) => (
          <div key={f.name}>
            <input
              type="text"
              name={f.name}
              placeholder={f.placeholder}
              value={contact[f.name]}
              onChange={handleContactChange}
              className={inputClass(f.name)}
            />
            {errors[f.name] && (
              <p className="text-red-500 text-sm">{errors[f.name]}</p>
            )}
          </div>
        ))}

        <h3 className="text-xl font-semibold text-[#EEDA00]">
          Información de pago
        </h3>
        <input
          type="text"
          name="cardNumber"
          placeholder="Número de tarjeta (16 dígitos)"
          value={payment.cardNumber}
          onChange={handlePaymentChange}
          className={inputClass("cardNumber")}
          maxLength={16}
        />
        {errors.cardNumber && (
          <p className="text-red-500 text-sm">{errors.cardNumber}</p>
        )}

        <input
          type="text"
          name="nameOnCard"
          placeholder="Nombre en la tarjeta"
          value={payment.nameOnCard}
          onChange={handlePaymentChange}
          className={inputClass("nameOnCard")}
        />
        {errors.nameOnCard && (
          <p className="text-red-500 text-sm">{errors.nameOnCard}</p>
        )}

        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              name="expiryMonth"
              placeholder="Mes (MM)"
              value={payment.expiryMonth}
              onChange={handlePaymentChange}
              className={inputClass("expiryMonth")}
              maxLength={2}
            />
            {errors.expiryMonth && (
              <p className="text-red-500 text-sm">{errors.expiryMonth}</p>
            )}
          </div>

          <div className="flex-1">
            <input
              type="text"
              name="expiryYear"
              placeholder="Año (YY o YYYY)"
              value={payment.expiryYear}
              onChange={handlePaymentChange}
              className={inputClass("expiryYear")}
              maxLength={4}
            />
            {errors.expiryYear && (
              <p className="text-red-500 text-sm">{errors.expiryYear}</p>
            )}
          </div>

          <div className="flex-1">
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={payment.cvv}
              onChange={handlePaymentChange}
              className={inputClass("cvv")}
              maxLength={4}
            />
            {errors.cvv && (
              <p className="text-red-500 text-sm">{errors.cvv}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-[#EEDA00] text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:opacity-90 cursor-pointer transition-all duration-200"
        >
          Finalizar compra
        </button>
      </form>

      {/* 🛒 Resumen */}
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

      {/* ✨ Animaciones */}
      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in { animation: fade-in 1.5s ease-out forwards; }

          @keyframes wave-fill {
            0% { transform: translateY(100%); }
            100% { transform: translateY(0%); }
          }
          .animate-wave-fill { animation: wave-fill 2.5s ease-in-out forwards; }
        `}
      </style>
    </div>
  );
};

export default BuyPage;