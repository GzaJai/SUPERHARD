import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Contacto() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    for (let key in form) {
      if (!form[key]) {
        setError("Por favor completa todos los campos");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSuccess(true);
        setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
      } else {
        const text = await response.text();
        setError("Error al enviar: " + text);
      }
    } catch (err) {
      setError("Hubo un problema al enviar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Clase compartida para inputs y textarea
  const fieldClass =
    "w-full p-3 bg-[#2A2A2A] text-white rounded-lg outline-none transition-all duration-200 hover:bg-[#333333] focus:bg-[#3D3D3D] focus:ring-2 focus:ring-[#EEDA00] resize-none";

  return (
    <div className="bg-[#494949] min-h-screen pt-[7rem] pb-[5rem] flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-[2rem] w-5/6 md:w-2/3 bg-[#353535] text-white text-center items-center gap-[1.5rem] shadow-[0_0_5px_rgba(0,0,0,0.7)]"
      >
        <h2 className="text-3xl text-[#EEDA00]">Contáctanos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            className={fieldClass}
            value={form.nombre}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className={fieldClass}
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="asunto"
            type="text"
            placeholder="Asunto"
            className={fieldClass + " md:col-span-2"}
            value={form.asunto}
            onChange={handleChange}
          />
          <textarea
            name="mensaje"
            placeholder="Mensaje"
            className={fieldClass + " md:col-span-2 h-40"}
            value={form.mensaje}
            onChange={handleChange}
          />
        </div>

        {error && <p className="text-red-400">{error}</p>}
        {success && <p className="text-green-400">Mensaje enviado correctamente!</p>}

        <button
          type="submit"
          disabled={loading}
          className={`p-[1rem] font-bold text-2xl text-black bg-[#EEDA00] rounded-lg cursor-pointer ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
