import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email.trim()) {
      setError('Ingresa tu correo electrónico');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Si el correo existe, se ha enviado un enlace para restablecer la contraseña.');
      } else {
        setError(data.message || 'Hubo un error al enviar el correo');
      }
    } catch (err) {
      setError('Error en el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#494949] w-dvw mx-auto pt-[7rem] pb-[5rem] flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-[2rem] w-2/3 md:w-1/3 bg-[#353535] text-white text-center items-center rounded-xl gap-[1.5rem] shadow-lg"
      >
        <h2 className="text-3xl text-[#EEDA00]">Olvidé mi contraseña</h2>

        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-[#353535] text-[#fff] border-b-2 border-[#EEDA00] outline-none focus:border-white transition-colors duration-200"
        />

        {message && <p className="text-green-400">{message}</p>}
        {error && <p className="text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`p-[1rem] font-bold text-2xl text-black bg-[#EEDA00] rounded-lg cursor-pointer ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </button>

        <Link to="/login" className="text-sm mt-2">
          Volver al login
        </Link>
      </form>
    </div>
  );
}
