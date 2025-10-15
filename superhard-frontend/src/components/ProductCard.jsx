import { Link } from "react-router-dom";

function ProductCard({ p }) {
  return (
    <div className="bg-[#2F2F2F] rounded-lg p-3 flex flex-col justify-center items-center shadow hover:shadow-lg hover:scale-[1.01] transition-transform duration-300">
      <img
        src={p.img}
        alt={p.nombre}
        className="w-full h-32 object-contain mb-2"
      />
      <h3 className="text-sm font-semibold mb-1 text-center text-[#EEDA00]">
        {p.nombre}
      </h3>
      <p className="text-[#EEDA00] font-bold text-sm mb-1 text-center">
        {p.precio}
      </p>
      <p className="text-xs text-gray-300 mb-2 text-center">
        ¡Mismo precio en 6 cuotas fijas!
      </p>
      <Link
        to={`/product/${p.id}`}
        className="block text-center bg-[#EEDA00] text-black font-semibold px-2 py-1 rounded-md hover:opacity-90 transition text-sm w-full"
      >
        Ver Producto
      </Link>
    </div>
  );
}

export default ProductCard;
