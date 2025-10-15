function ProductCard({ img, title, price, oldPrice }) {
  return (
    <div className="bg-[#282828] text-white rounded-2xl shadow-lg p-4 flex flex-col items-center w-64 hover:scale-105 transition-transform duration-300">
      <img 
        src={img} 
        alt={title} 
          className="w-full h-40 object-contain rounded-xl mb-3 bg-neutral-700" 
      />
      <h3 className="text-lg font-semibold mb-1 text-center">{title}</h3>
      <div className="flex items-center gap-2 mb-2">
        {oldPrice && (
          <p className="text-gray-400 line-through text-sm">${oldPrice}</p>
        )}
        <p className="text-xl font-bold text-green-400">${price}</p>
      </div>
      <button className="bg-green hover:bg-green-600 text-white font-medium py-2 px-4 rounded-xl shadow-md transition-colors">
        Ver Producto
      </button>
    </div>
  );
}

export default ProductCard;
