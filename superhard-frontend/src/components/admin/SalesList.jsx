import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function SalesList() {
  const [ventas, setVentas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await fetch(`${API_URL}/ventas`);
        const data = await response.json();
        // Ordenamos por fecha, de más reciente a más antigua
        data.sort((a, b) => new Date(b.fechaVenta) - new Date(a.fechaVenta));
        setVentas(data);
      } catch (err) {
        console.error("Error al obtener ventas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  if (loading || !ventas) {
    return <p className="text-white p-6">Cargando ventas...</p>;
  }

  if (ventas.length === 0) {
    return <p className="text-white p-6">No hay ventas registradas todavía.</p>;
  }

  return (
    <div className="p-6 bg-neutral-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Registro de Ventas</h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-neutral-800 rounded-lg overflow-hidden">
          <thead className="bg-neutral-700">
            <tr>
              <th className="py-2 px-4 text-left">ID Venta</th>
              <th className="py-2 px-4 text-left">Fecha</th>
              <th className="py-2 px-4 text-left">Comprador (ID)</th>
              <th className="py-2 px-4 text-left">Estado Pago</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Método de Pago</th>
              <th className="py-2 px-4 text-left">ID Transacción</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id} className="border-b border-neutral-700 hover:bg-neutral-700">
                <td className="py-2 px-4">{venta.id}</td>
                <td className="py-2 px-4">
                  {new Date(venta.fechaVenta).toLocaleString("es-AR")}
                </td>
                <td className="py-2 px-4">{venta.usuario?.id} - {venta.usuario?.nombre} {venta.usuario?.apellido}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    venta.estadoPago === 'Pagado'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {venta.estadoPago || 'Pendiente'}
                  </span>
                </td>
                <td className="py-2 px-4 font-bold text-green-400">
                  ${venta.total.toFixed(2)}
                </td>
                <td className="py-2 px-4">{venta.metodoPago}</td>
                <td className="py-2 px-4 text-xs">{venta.pagoId || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
