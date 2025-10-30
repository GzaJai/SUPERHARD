import { Link } from "react-router-dom";

function ProductCard({ id, img, title, price, oldPrice }) {
  return (
    <div className="bg-[#282828] text-white rounded-2xl shadow-lg p-4 flex flex-col justify-between w-full max-w-[290px] mx-auto h-[23rem] hover:scale-105 transition-transform duration-300 cursor-pointer">

      {/* Contenido superior */}
      <div className="flex flex-col items-center flex-grow">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-40 object-contain rounded-xl mb-3 bg-neutral-700" 
        />
        <h3 className="text-lg font-semibold text-center line-clamp-2 w-full px-2">{title}</h3>
      </div>

      {/* Precios y botón siempre al final */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center justify-center gap-2">
          {oldPrice && (
            <p className="text-gray-400 line-through text-sm">${parseFloat(oldPrice).toFixed(2)}</p>
          )}
          <p className={`text-xl font-bold ${oldPrice ? 'text-green-400' : 'text-white'}`}>
            ${parseFloat(price).toFixed(2)}
          </p>
          <p className="text-xl font-bold text-[#EEDA00]">${price}</p>
        </div>

        <Link 
          to={`/product/${id}`}
          className="bg-[#EEDA00] hover:opacity-90 text-black font-bold py-2 px-4 rounded-xl shadow-md transition-colors w-full text-center"
        >
          Ver Producto
        </Link>
      </div>

    </div>
  );
}

export default ProductCard;
