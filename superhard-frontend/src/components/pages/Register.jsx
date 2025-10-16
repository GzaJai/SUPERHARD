import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register({ setUser }) {
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [address, setAddress] = useState("")
  const [locality, setLocality] = useState("")
  const [province, setProvince] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [phone, setPhone] = useState("")
  const [dni, setDni] = useState("")
  const [subscribeOffers, setSubscribeOffers] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const provinces = [
    'Ciudad Autónoma de Buenos Aires','Buenos Aires','Catamarca','Chaco','Chubut','Córdoba','Corrientes','Entre Ríos','Formosa','Jujuy','La Pampa','La Rioja','Mendoza','Misiones','Neuquén','Río Negro','Salta','San Juan','San Luis','Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego','Tucumán'
  ]

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (!name || !lastName || !email || !password || !confirmPassword || !address || !locality || !province || !postalCode || !phone || !dni) {
      setError("Completa todos los campos")
      return
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      const body = { name, lastName, email, password, address, locality, province, postalCode, phone, dni, subscribeOffers }
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      if (!response.ok) throw new Error("Error en el servidor")
      const data = await response.json()
      if (data.success) {
        const userWithRol = { ...data.user, rol: data.rol }
        if (data.token) localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(userWithRol))
        setUser(userWithRol)
        navigate("/")
      } else setError(data.message || "No se pudo registrar")
    } catch (err) {
      setError(err.message || "Hubo un problema al registrarse")
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
          <input className={inputClass} type='text' placeholder='Nombre' value={name} onChange={e => setName(e.target.value)} />
          <input className={inputClass} type='text' placeholder='Apellido' value={lastName} onChange={e => setLastName(e.target.value)} />
          <input className={`${inputClass} col-span-2`} type='email' placeholder='Correo electrónico' value={email} onChange={e => setEmail(e.target.value)} />
          <input className={inputClass} type='password' placeholder='Contraseña' value={password} onChange={e => setPassword(e.target.value)} />
          <input className={inputClass} type='password' placeholder='Confirmar contraseña' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          <input className={`${inputClass} col-span-2`} type='text' placeholder='Dirección' value={address} onChange={e => setAddress(e.target.value)} />
          <input className={inputClass} type='text' placeholder='Localidad' value={locality} onChange={e => setLocality(e.target.value)} />
          <select className={`${inputClass}`} value={province} onChange={e => setProvince(e.target.value)}>
            <option value=''>Seleccioná provincia</option>
            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <input className={inputClass} type='text' placeholder='Código Postal' value={postalCode} onChange={e => setPostalCode(e.target.value)} />
          <input className={inputClass} type='text' placeholder='Teléfono' value={phone} onChange={e => setPhone(e.target.value)} />
          <input className={inputClass} type='text' placeholder='DNI' value={dni} onChange={e => setDni(e.target.value)} />
        </div>

        <div className='flex items-center gap-2 w-full text-left'>
          <input type='checkbox' id='subscribeOffers' checked={subscribeOffers} onChange={e => setSubscribeOffers(e.target.checked)} className='ml-0' />
          <label htmlFor='subscribeOffers'>Quiero recibir ofertas y novedades en mi correo</label>
        </div>

        {error && <p className='text-red-400'>{error}</p>}

        <button type='submit' disabled={loading} className={`p-[1rem] font-bold text-2xl text-black bg-[#EEDA00] rounded-lg cursor-pointer ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
          {loading ? 'Registrando...' : 'Registrarme'}
        </button>
      </form>
    </div>
  )
}