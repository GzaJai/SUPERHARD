import { useState, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import CartContext from "../context/CartContext";

export default function Header({ user, setUser }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { cartQuantity } = useContext(CartContext);

  const categories = [
    "Procesadores",
    "Placas de video",
    "Memorias RAM",
    "Periféricos",
    "Gabinetes",
    "Notebooks",
  ];

  // 🔍 Buscar productos
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/search?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  // 🧭 Ir a una categoría
  const goToCategory = (categoria) => {
    navigate(`/category/${encodeURIComponent(categoria.toLowerCase())}`);
  };

  return (
    <>
      {/* 🔹 Header fijo */}
      <header className="fixed top-0 left-0 w-full bg-black text-white italic border-gray-300 z-50 shadow-md">
        {/* --- Fila superior: logo, buscador, botones --- */}
          <div className="flex flex-col md:flex-row py-[.6rem] px-[1rem] justify-between items-center gap-4 md:gap-0">
          {/* Logo */}
          <div className="flex">
            <Link
              to={"/"}
              className="text-[#EEDA00] cursor-pointer font-black text-2xl"
            >
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
              className="flex-1 w-[25rem] border-none bg-white text-black rounded-l py-1 px-3 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#EEDA00] text-black px-4 rounded-r cursor-pointer not-italic hover:bg-yellow-300 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={22}
                height={22}
                fill="none"
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
            {!user ? (
              <Link
                to={"/login"}
                className="flex px-3 py-1 rounded gap-1 hover:cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={25}
                  height={25}
                  fill={"#FFFFFF"}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2a5 5 0 1 0 0 10 5 5 0 1 0 0-10M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1"></path>
                </svg>
                Iniciar sesión
              </Link>
            ) : (
              <>
                {user.rol === "ADMIN" && (
                  <button className="flex px-3 py-1 rounded gap-1 hover:cursor-pointer">
                    Menu de Admin
                  </button>
                )}
                <button
                  className="flex px-3 py-1 gap-1 rounded hover:cursor-pointer"
                  onClick={() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    setUser(null);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={25}
                    height={25}
                    fill={"#FFFFFF"}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2a5 5 0 1 0 0 10 5 5 0 1 0 0-10M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1"></path>
                  </svg>
                  Cerrar sesión
                </button>
              </>
            )}

            <Link
              to={"/shopping-cart"}
              className="flex px-3 py-1 rounded gap-1 hover:cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={25}
                height={25}
                fill={"#FFFFFF"}
                viewBox="0 0 24 24"
              >
                <path d="M10.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M17.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M8.82 15.77c.31.75 1.04 1.23 1.85 1.23h6.18c.79 0 1.51-.47 1.83-1.2l3.24-7.4c.14-.31.11-.67-.08-.95A1 1 0 0 0 21 7H7.33L5.92 3.62C5.76 3.25 5.4 3 5 3H2v2h2.33z"></path>
              </svg>
              Carrito ({cartQuantity})
            </Link>
          </div>
        </div>

        {/* --- Fila de categorías --- */}
        <nav className="flex py-[.3rem] bg-[#282828] justify-around gap-2">
          <button className="text-[#EEDA00] px-4 text-lg border-r hover:cursor-pointer">
            OFERTAS
          </button>

          {categories.map((c) => (
            <button
              key={c}
              onClick={() => goToCategory(c)}
              className="px-3 py-1 rounded hover:text-[#EEDA00] cursor-pointer transition"
            >
              {c}
            </button>
          ))}

          <button className="text-[#EEDA00] px-4 text-lg border-l hover:cursor-pointer">
            Arma tu PC
          </button>
        </nav>
      </header>

      {/* 🔹 Margen inferior para contenido */}
      <div className="pt-[6rem]">
        <Outlet />
      </div>
    </>
  );
}
