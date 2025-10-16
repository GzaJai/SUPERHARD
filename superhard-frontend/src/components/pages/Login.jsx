import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = ({setUser}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error("Error en el servidor")
      }

      const data = await response.json()

      if (data.success) {
        const userWithRol = { ...data.user, rol: data.rol }

        // Guardar token en localStorage
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(userWithRol))

        setUser(userWithRol)
        // Redirigir
        navigate("/")
      } else {
        setError("Correo o contraseña incorrectos")
      }
    } catch (err) {
      setError("Hubo un problema al iniciar sesión"+ err)
    }
  }

  return (
    <div className='bg-[#494949] w-dvw h-dvh pt-[5rem]'>
      <form 
        onSubmit={handleLogin} 
        className='flex flex-col p-[2rem] mx-auto w-3/5 bg-[#353535] text-white text-center items-center rounded-xl gap-[2rem]'
      >
        <h2 className='text-3xl text-[#EEDA00]'>Ingresa a tu cuenta</h2>
        
        <div className='flex flex-col w-3/4 items-center gap-[1rem]'>
          <input 
            className='w-full p-2 bg-[#353535] text-[#fff] border-b-2 border-[#EEDA00] outline-none focus:border-white transition-colors duration-200'
            type="email"
            placeholder='Ingresa tu correo'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            className='w-full p-2 bg-[#353535] text-[#fff] border-b-2 border-[#EEDA00] outline-none focus:border-white transition-colors duration-200'
            type="password"
            placeholder='Ingresa tu contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-400">{error}</p>}

        <div className='flex w-full px-5 justify-around'>
          <Link to="/register" className='hover:underline self-start'>Registrarme</Link>
          <Link to="/forgot" className='hover:underline self-start'>Olvide mi contraseña</Link>
        </div>

        <button 
          type="submit"
          className='p-[1rem] font-bold text-2xl text-black bg-[#EEDA00] rounded-lg cursor-pointer'
        >
          Ingresar
        </button>
      </form>
    </div>
  )
}

export default Login
