import { Link } from "react-router-dom";


const ProducPage = () => {
  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black flex items-center px-6 py-3">
        <h1 className="text-yellow-400 font-extrabold text-xl mr-6">SUPERHARD</h1>

        {/* Buscador */}
        <div className="flex flex-1">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full px-3 py-1 text-black rounded-l"
          />
          <button className="bg-yellow-400 px-3 rounded-r">🔍</button>
        </div>

        {/* Sesión y carrito */}
        <div className="flex items-center space-x-6 ml-6">
          <button className="flex items-center space-x-1">
            <span>👤</span>
            <span>Iniciar sesión</span>
          </button>
          <button className="flex items-center space-x-1">
            <span>🛒</span>
            <span>Mi carrito</span>
          </button>
        </div>
      </header>

      {/* Menú */}
      <nav className="bg-gray-800 text-sm text-white flex space-x-6 px-6 py-2">
        <a href="#" className="text-yellow-400 font-bold">
          OFERTAS
        </a>
        <a href="#">Procesadores</a>
        <a href="#">Placas de video</a>
        <a href="#">Placas madre</a>
        <a href="#">Memoria RAM</a>
        <a href="#">Almacenamiento</a>
        <a href="#">Periféricos</a>
        <a href="#">Gabinetes</a>
        <a href="#">Notebooks</a>
        <a href="#" className="text-yellow-400 font-bold">
          ARMA TU PC
        </a>
      </nav>

      {/* Detalle de producto */}
      <main className="p-6 bg-gray-700 flex">
        {/* Imagen */}
        <div className="flex-shrink-0">
          <img
            src="https://via.placeholder.com/200x200.png?text=Ryzen+5"
            alt="Ryzen 5"
            className="rounded"
          />
          <p className="text-2xl font-bold mt-4">$134999</p>
        </div>

        {/* Info */}
        <div className="ml-8 flex flex-col">
          <h2 className="text-3xl font-bold mb-4">PROCESADOR RYZEN 5 5600GT</h2>

          <button className="bg-yellow-400 text-black px-6 py-2 font-bold rounded mb-4">
            COMPRAR
          </button>
          <button className="bg-yellow-400 text-black px-6 py-2 font-bold rounded">
            AGREGAR AL CARRITO
          </button>
        </div>
      </main>

      {/* Especificaciones */}
      <section className="bg-gray-700 text-sm p-6 grid grid-cols-3 gap-4">
        <div>
          <h3 className="font-bold mb-2">GENERAL</h3>
          <p>Modelo: 5600GT</p>
          <p>Familia: Ryzen</p>
          <p>Núcleos: 6</p>
          <p>Hilos: 12</p>
          <p>Frecuencia: 3.6 GHz</p>
          <p>Frecuencia Máxima: 4.6 GHz</p>
          <p>Gráfica Integrada: Vega 7</p>
          <p>Socket: AM4</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">COOLERS Y DISIPADORES</h3>
          <p>Incluye Cooler CPU: Sí</p>
          <p>TDP: 65 W</p>
          <p>Desbloqueado - Overclockeable: Sí</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">MEMORIA</h3>
          <p>L1: 64 Kb (por núcleo)</p>
          <p>L2: 512 Kb (por núcleo)</p>
          <p>L3: 16 MB</p>
        </div>
      </section>

      {/* Carrusel de productos */}
      <section className="bg-gray-800 p-6 flex items-center space-x-4 overflow-x-auto">
        <button className="bg-yellow-400 text-black px-3 py-1 rounded-full">◀</button>

        <div className="flex space-x-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-gray-700 p-3 rounded shadow min-w-[150px] text-center"
              >
                <img
                  src="https://via.placeholder.com/100x100.png?text=Ryzen+5"
                  alt="Producto"
                  className="mx-auto mb-2"
                />
                <p className="text-xs">Micro AMD Ryzen 5 5600GT 4.6 Ghz AM4</p>
              </div>
            ))}
        </div>

        <button className="bg-yellow-400 text-black px-3 py-1 rounded-full">▶</button>
      </section>
    </div>
  );
}
