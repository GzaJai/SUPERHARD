import { Link} from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-black text-white min-w-screen py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Marca */}
        <div>
          <h2 className="text-2xl font-bold mb-4">SuperHard</h2>
          <p className="text-gray-400 text-sm">
            Tienda especializada en hardware y tecnología. 
            Rendimiento y calidad al mejor precio.
          </p>
        </div>

        {/* Sobre nosotros */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Sobre nosotros</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/nosotros" className="hover:text-white">Quiénes somos</Link></li>
            <li><Link to="/sucursales" className="hover:text-white">Sucursales</Link></li>
            <li><Link to="/trabaja-con-nosotros" className="hover:text-white">Trabajá con nosotros</Link></li>
          </ul>
        </div>

        {/* Ayuda */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Ayuda</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/faq" className="hover:text-white">Preguntas frecuentes</Link></li>
            <li><Link to="/envios" className="hover:text-white">Envíos y entregas</Link></li>
            <li><Link to="/devoluciones" className="hover:text-white">Devoluciones</Link></li>
            <li><Link to="/soporte" className="hover:text-white">Soporte técnico</Link></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contacto</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Email: contacto@superhard.com</li>
            <li>Tel: +54 11 5555-5555</li>
            <li><Link to="/contacto" className="hover:text-white">Formulario de contacto</Link></li>
          </ul>
        </div>
      </div>

      {/* Derechos reservados */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SuperHard. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;

