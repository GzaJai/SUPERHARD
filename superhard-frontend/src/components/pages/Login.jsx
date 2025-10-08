import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (<div className='bg-[#494949] w-dvw h-dvh pt-[5rem]'>
    <div className='flex flex-col p-[2rem] mx-auto w-1/2 bg-[#3E3E3E] text-white text-center items-center rounded-xl gap-[2rem] mb-[4rem]'>
        <h2 className='text-3xl text-[#EEDA00]'>Ingresa a tu cuenta</h2>
        <div className='flex flex-col w-3/4 items-center gap-[1rem]'>
            <input className='w-full p-1 bg-white text-[#3E3E3E] rounded-md' type="text" placeholder='Ingresa tu correo'/>
            <input className='w-full p-1 bg-white text-[#3E3E3E] rounded-md' type="password" placeholder='Ingresa tu contraseña'/>
        </div>
        <div className='flex w-full px-5 justify-around'>
            <Link>Registrarme</Link>
            <Link>Olvide mi contraseña</Link>
        </div>
        <button className='p-[1rem] font-bold text-2xl text-black bg-[#EEDA00] rounded-lg cursor-pointer'>
            Ingresar
        </button>
    </div>
</div>

  )
}

export default Login