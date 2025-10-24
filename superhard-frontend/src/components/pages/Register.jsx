import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register({ setUser }) {
  // ✅ Estado para campos de usuario
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
  })

  // ✅ Estado para campos de dirección
  const [direccion, setDireccion] = useState({
    calle: "",
    numero: "",
    ciudad: "",
    provincia: "",
    codigoPostal: ""
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const provincias = [
    'Ciudad Autónoma de Buenos Aires','Buenos Aires','Catamarca','Chaco','Chubut','Córdoba','Corrientes','Entre Ríos','Formosa','Jujuy','La Pampa','La Rioja','Mendoza','Misiones','Neuquén','Río Negro','Salta','San Juan','San Luis','Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego','Tucumán'
  ]

  // 🔹 Maneja cambios en los campos de usuario
  const handleUsuarioChange = e => {
    const { name, value } = e.target
    setUsuario(prev => ({ ...prev, [name]: value }))
  }

  // 🔹 Maneja cambios en los campos de dirección
  const handleDireccionChange = e => {
    const { name, value } = e.target
    setDireccion(prev => ({ ...prev, [name]: value }))
  }

  // 🔹 Maneja registro
  const handleRegister = async e => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validación simple de campos
    const usuarioFields = ["nombre","apellido","email","password","confirmPassword","telefono"]
    const direccionFields = ["calle","numero","ciudad","provincia","codigoPostal"]

    for (let field of usuarioFields) {
      if (!usuario[field]) { setError("Completa todos los campos"); setLoading(false); return }
    }
    for (let field of direccionFields) {
      if (!direccion[field]) { setError("Completa todos los campos"); setLoading(false); return }
    }

    if (usuario.password !== usuario.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    const body = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      password: usuario.password,
      telefono: usuario.telefono,
      direccion
    }

    console.log("Enviando body:", body) // 🔹 Log del JSON enviado

    try {
      const response = await fetch("http://localhost:8080/api/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      console.log("Response status:", response.status)
      const text = await response.text()
      console.log("Response text:", text) // 🔹 Log de la respuesta

      let data
      try { data = JSON.parse(text) } catch { data = { success: false, message: text } }

      if (data.success) {
        const userWithRol = { ...data.user, rol: data.rol }
        if (data.token) localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(userWithRol))
        setUser(userWithRol)
        navigate("/")
      } else {
        setError(data.message || "No se pudo registrar")
      }

    } catch (err) {
      console.error("Error fetch:", err)
      setError("Hubo un problema al registrarse: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full p-2 bg-[#353535] text-[#fff] border-b-2 border-[#EEDA00] outline-none focus:border-white transition-colors duration-200'

  return (
    <div className='bg-[#494949] w-dvw min-h-dvh pt-[7rem] pb-[5rem] flex justify-center'>
      <form onSubmit={handleRegister} className='flex flex-col p-[2rem] w-5/6 bg-[#353535] text-white text-center items-center gap-[1.5rem] shadow-[0_0_5px_rgba(0,0,0,0.7)]'>
        <h2 className='text-3xl text-[#EEDA00]'>Crea tu cuenta</h2>

        <div className='grid grid-cols-2 gap-4 w-full'>
          {/* Campos usuario */}
          {["nombre","apellido","email","password","confirmPassword","telefono"].map(field => (
            <input
              key={field}
              name={field}
              type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className={`${inputClass} ${field === "email" ? "col-span-2" : ""}`}
              value={usuario[field]}
              onChange={handleUsuarioChange}
            />
          ))}

          {/* Campos dirección */}
          {["calle","numero","ciudad"].map(field => (
            <input
              key={field}
              name={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className={inputClass}
              value={direccion[field]}
              onChange={handleDireccionChange}
            />
          ))}

          <select
            name="provincia"
            className={inputClass}
            value={direccion.provincia}
            onChange={handleDireccionChange}
          >
            <option value=''>Seleccioná provincia</option>
            {provincias.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <input
            name="codigoPostal"
            type="text"
            placeholder="Código Postal"
            className={inputClass}
            value={direccion.codigoPostal}
            onChange={handleDireccionChange}
          />
        </div>

        {error && <p className='text-red-400'>{error}</p>}

        <button type='submit' disabled={loading} className={`p-[1rem] font-bold text-2xl text-black bg-[#EEDA00] rounded-lg cursor-pointer ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
          {loading ? 'Registrando...' : 'Registrarme'}
        </button>
      </form>
    </div>
  )
}
