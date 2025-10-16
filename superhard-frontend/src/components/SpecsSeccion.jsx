import React from "react";
import { productos } from "../data/products";

const SpecsSeccion = ({ productId }) => {
  const product = productos.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="text-white text-center py-10">
        Producto no encontrado.
      </div>
    );
  }

  return (
    <section className="w-full bg-[#313131] shadow-[0_6px_20px_rgba(0,0,0,0.5),0_-6px_20px_rgba(0,0,0,0.5)] py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-[#EEDA00] mb-8 border-b-2 border-[#EEDA00] pb-2">
          Especificaciones
        </h3>

        {/* GRID DE 3 COLUMNAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(product.specs).map(([sectionName, sectionContent]) => (
            <div
              key={sectionName}
              className=" p-4 "
            >
              {/* Subtítulo */}
              <h4 className="text-lg font-semibold text-white border-b border-[#EEDA00] pb-1 mb-3 capitalize">
                {sectionName}
              </h4>

              {/* Lista de atributos */}
              <ul className="list-disc list-inside text-white space-y-1">
                {Object.entries(sectionContent).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-semibold">
                      {key.replace(/([A-Z])/g, " $1").toUpperCase()}:
                    </span>{" "}
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecsSeccion;
