import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TrabajaConNosotros() {
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        mensaje: "",
        cv: null,
    });
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "cv") {
            setForm((prev) => ({ ...prev, cv: files[0] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!form.nombre || !form.email || !form.cv) {
            setError("Por favor completa los campos obligatorios y adjunta tu CV.");
            return;
        }

        setLoading(true);
        try {
            // Crear FormData para envío de archivo
            const data = new FormData();
            data.append("nombre", form.nombre);
            data.append("email", form.email);
            data.append("mensaje", form.mensaje);
            data.append("cv", form.cv);

            const response = await fetch("http://localhost:8080/api/trabajo", {
                method: "POST",
                body: data,
            });

            if (response.ok) {
                setSuccess(true);
                setForm({ nombre: "", email: "", mensaje: "", cv: null });
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

    const fieldClass =
        "peer w-full p-3 bg-[#2A2A2A] text-white rounded-lg outline-none transition-all duration-200 hover:bg-[#333333] focus:bg-[#3D3D3D] focus:ring-2 focus:ring-[#EEDA00]";

    return (
        <div className="bg-[#494949] min-h-screen pt-[7rem] pb-[5rem] flex justify-center">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col p-[2rem] w-5/6 md:w-2/3 bg-[#353535] text-white items-center gap-[1.5rem] shadow-[0_0_5px_rgba(0,0,0,0.7)]"
            >
                <h2 className="text-3xl text-[#EEDA00] text-center mb-6">
                    Trabaja con nosotros
                </h2>
                <p className="text-gray-300 mb-4 text-center">
                    Envía tu información y CV, y nos pondremos en contacto contigo.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="relative w-full md:col-span-1">
                        <input
                            type="text"
                            name="nombre"
                            placeholder=" "
                            className={fieldClass}
                            value={form.nombre}
                            onChange={handleChange}
                        />
                        <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-[#EEDA00] peer-focus:text-sm">
                            Nombre
                        </label>
                    </div>

                    <div className="relative w-full md:col-span-1">
                        <input
                            type="email"
                            name="email"
                            placeholder=" "
                            className={fieldClass}
                            value={form.email}
                            onChange={handleChange}
                        />
                        <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-[#EEDA00] peer-focus:text-sm">
                            Email
                        </label>
                    </div>

                    <div className="relative md:col-span-2 w-full">
                        <textarea
                            name="mensaje"
                            placeholder=" "
                            className={fieldClass + " h-32 resize-none"}
                            value={form.mensaje}
                            onChange={handleChange}
                        />
                        <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-[#EEDA00] peer-focus:text-sm">
                            Mensaje (opcional)
                        </label>
                    </div>

                    <div className="relative md:col-span-2 w-full flex flex-col items-start">
                        <label className="mb-2 text-gray-400">Adjuntar CV *</label>
                        <div className="w-full flex items-center gap-4">
                            {/* Botón personalizado */}
                            <button
                                type="button"
                                onClick={() => document.getElementById("cvInput").click()}
                                className="bg-[#EEDA00] text-black font-bold px-4 py-2 rounded-lg shadow hover:opacity-90 transition-all duration-200"
                            >
                                Seleccionar archivo
                            </button>

                            {/* Nombre del archivo seleccionado */}
                            <span className="text-gray-200">
                                {form.cv ? form.cv.name : "Ningún archivo seleccionado"}
                            </span>
                        </div>

                        {/* Input real oculto */}
                        <input
                            type="file"
                            id="cvInput"
                            name="cv"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {error && <p className="text-red-400">{error}</p>}
                {success && (
                    <p className="text-green-400">Formulario enviado correctamente!</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`p-[1rem] font-bold text-2xl text-black bg-[#EEDA00] rounded-lg cursor-pointer ${loading ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "Enviando..." : "Enviar"}
                </button>
            </form>
        </div>
    );
}
