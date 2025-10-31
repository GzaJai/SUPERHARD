import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "¿Qué tipo de productos venden?",
      answer:
        "Somos un ecommerce especializado en hardware: procesadores, placas de video, memorias RAM, motherboards, fuentes y periféricos de alta calidad.",
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Podés pagar con Mercado Pago, tarjetas de crédito y débito, y también aceptamos criptomonedas como Bitcoin y USDT.",
    },
    {
      question: "¿Realizan envíos a todo el país?",
      answer:
        "Sí, realizamos envíos a todo Argentina a través de correo privado o retiro en puntos habilitados.",
    },
    {
      question: "¿Cómo puedo hacer un seguimiento de mi pedido?",
      answer:
        "Una vez realizada la compra, te enviaremos un correo con el número de seguimiento y un enlace para rastrear tu envío en tiempo real.",
    },
    {
      question: "¿Puedo devolver un producto?",
      answer:
        "Sí, aceptamos devoluciones dentro de los 10 días hábiles desde la recepción, siempre que el producto esté en perfectas condiciones y con su embalaje original.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#494949] min-h-screen py-12 px-6 text-white">
      <div className="max-w-3xl mx-auto bg-[#3D3D3D] rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-10 text-[#EEDA00]">
          Preguntas Frecuentes
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#2F2F2F] rounded-xl shadow-md overflow-hidden transition-all duration-300"
            >
              {/* Pregunta */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-lg hover:bg-[#3A3A3A] transition-colors duration-200"
              >
                {faq.question}
                <span
                  className={`transform transition-transform duration-300 text-[#EEDA00] ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>

              {/* Respuesta */}
              <div
                className={`bg-[#5C5C5C] px-6 text-gray-100 leading-relaxed transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? "max-h-40 py-3 opacity-100"
                    : "max-h-0 opacity-0 py-0"
                } overflow-hidden`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
