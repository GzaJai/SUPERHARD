import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function PublicLayout({ user, setUser }) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-white overflow-x-hidden">
      <Header user={user} setUser={setUser} />
      <main className="flex-grow">
        <Outlet /> {/* Renderiza las rutas hijas aquí */}
      </main>
      <Footer />
    </div>
  );
}
