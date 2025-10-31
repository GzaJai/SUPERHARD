import { useNavigate } from "react-router-dom";

export default function Sucursales() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#494949] min-h-screen py-12 px-6 text-white flex flex-col items-center">
      <div className="max-w-4xl w-full bg-[#3D3D3D] rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-10 text-[#EEDA00]">
          Nuestra Sucursal
        </h1>

        {/* Tarjeta de sucursal */}
        <div className="flex flex-col md:flex-row items-center justify-center bg-[#2F2F2F] rounded-xl shadow-md overflow-hidden hover:shadow-[0_0_15px_#EEDA0055] transition-all duration-300">
          
          {/* Mapa con marcador real */}
          <div className="w-full md:w-1/2 flex justify-center items-center bg-[#353535] p-4">
            <iframe
              title="Mapa sucursal"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13361.272403208635!2d-68.848388!3d-32.927330!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e0974ab7a1e0b%3A0xe2d26a1d2c9ccbea!2sAv.%20San%20Mart%C3%ADn%201450%2C%20Godoy%20Cruz%2C%20Mendoza!5e0!3m2!1ses-419!2sar!4v1730304000000!5m2!1ses-419!2sar"
              className="w-full h-72 rounded-lg"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          {/* Información */}
          <div className="p-6 flex flex-col justify-center items-start md:w-1/2 text-gray-200">
            <h2 className="text-2xl font-bold mb-3 text-[#EEDA00]">
              Sucursal Godoy Cruz
            </h2>
            <p className="mb-3">
              📍 <span className="font-semibold">Av. San Martín 1450</span>, Godoy Cruz, Mendoza, Argentina.
            </p>
            <p className="mb-2">🕒 Horario: Lunes a Sábado, 9:00 a 19:00 hs</p>
            <p className="mb-2">📞 Teléfono: (0261) 456-7890</p>
            <p className="mb-2">
              📧 Email: <span className="select-none">superhard898@gmail.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
