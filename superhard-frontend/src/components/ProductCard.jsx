import { Link } from "react-router-dom";

function ProductCard({ id, img, title, price, oldPrice }) {
  return (
    <div className="bg-[#282828] text-white rounded-2xl shadow-lg p-4 flex flex-col w-64 h-[23rem] hover:scale-105 transition-transform duration-300">
      <div className="flex flex-col items-center flex-grow mb-4">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-40 object-contain rounded-xl mb-3 bg-neutral-700" 
        />
        <h3 className="text-lg font-semibold text-center">{title}</h3>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2">
          {oldPrice && (
            <p className="text-gray-400 line-through text-sm">${oldPrice}</p>
          )}
          <p className="text-xl font-bold text-green-400">${price}</p>
        </div>

        {/* Enlace al detalle */}
        <Link 
          to={`/product/${id}`}
          className="bg-green-900 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-xl shadow-md transition-colors w-full text-center"
        >
          Ver Producto
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;

