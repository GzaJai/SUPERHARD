function ProductCard({ img, title, price, oldPrice }) {
  return (
    <div className="product-card">
      <img src={img} alt={title} />
      <h3>{title}</h3>
      <p className="old-price">${oldPrice}</p>
      <p className="price">${price}</p>
      <button className="btn">Ver Producto</button>
    </div>
  );
}

export default ProductCard;
