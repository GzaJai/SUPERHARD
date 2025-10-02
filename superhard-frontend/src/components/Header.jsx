import { useState, useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import CartContext from "../context/CartContext";

export default function Header() {
  const [search, setSearch] = useState("");
  const categories = ["Procesadores", "Placas de video", "Memorias RAM", "Periféricos", "Gabinetes", "Notebooks"];
  const { cartQuantity } = useContext(CartContext);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscar:", search);
  };

  return (
    <>
      <header className="w-full border-gray-300 bg-black italic text-white">
        {/* --- Fila superior: logo, buscador, botones --- */}
        <div className="flex flex-col md:flex-row py-[.6rem] px-[1rem] justify-between items-center gap-4 md:gap-0">

          {/* Logo */}
          <div className="flex">
            <Link to={"/"} className="text-[#EEDA00]  cursor-pointer font-black text-2xl">
              SUPERHARD
            </Link>
          </div>

          {/* Buscador */}
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="flex-1 w-[25rem] border border-none bg-white text-black rounded-l py-1 px-3 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#EEDA00] text-white px-4 rounded-r cursor-pointer not-italic hover:bg-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={25}
                height={25}
                fill={"none"}
                viewBox="0 0 24 24"
              >
                <path
                  d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                  stroke="#000000"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          {/* Botones */}
          <div className="flex text-lg gap-2">
            <Link to={"/login"} className="flex px-3 py-1 rounded hover:bg-orange-500 gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} fill={"#FFFFFF"} viewBox="0 0 24 24">{/* Boxicons v3.0 https://boxicons.com | License  https://docs.boxicons.com/free */}<path d="M12 2a5 5 0 1 0 0 10 5 5 0 1 0 0-10M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1"></path></svg>
              Iniciar sesión
            </Link>
            <Link to={"/shopping-cart"} className="flex px-3 py-1 rounded hover:bg-orange-500 gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} fill={"#FFFFFF"} viewBox="0 0 24 24">{/* Boxicons v3.0 https://boxicons.com | License  https://docs.boxicons.com/free */}<path d="M10.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M17.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M8.82 15.77c.31.75 1.04 1.23 1.85 1.23h6.18c.79 0 1.51-.47 1.83-1.2l3.24-7.4c.14-.31.11-.67-.08-.95A1 1 0 0 0 21 7H7.33L5.92 3.62C5.76 3.25 5.4 3 5 3H2v2h2.33z"></path></svg>
              Carrito ({ cartQuantity })
            </Link>
          </div>
        </div>

        {/* --- Fila de categorías debajo del buscador --- */}
        <nav className="flex py-[.3rem] bg-[#282828] justify-around gap-2">
          <button className="text-[#EEDA00] px-4 text-lg border-r hover:bg-blue-600">
            OFERTAS
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className="px-3 py-1 rounded hover:bg-orange-500"
            >
              {c}
            </button>
          ))}
          <button className="text-[#EEDA00] px-4 text-lg border-l hover:bg-blue-600">
            Arma tu PC
          </button>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
