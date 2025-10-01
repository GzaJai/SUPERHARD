import Ryzen3 from "../assets/images/Ryzen-3-5300G.jpg";
import Ryzen5 from "../assets/images/Ryzen-5-5600GT.jpg";
import Ryzen7 from "../assets/images/Ryzen-7-5800X.jpg";
import Ryzen9 from "../assets/images/Ryzen-9-5900X.jpg";

export const productos = [
  {
    id: 1,
    nombre: "Micro AMD Ryzen 5 5600GT 4.6 Ghz AM4",
    precio: "$134.999",
    img: Ryzen5,
    descripcion: "Procesador de 6 núcleos y 12 hilos, con frecuencia turbo de hasta 4.6 GHz. Ideal para gaming y multitarea eficiente en socket AM4.",
    specs: {
      cores: 6,
      threads: 12,
      baseClock: "3.7 GHz",
      turboClock: "4.6 GHz",
      TDP: "65W",
      socket: "AM4",
      cache: "32 MB L3"
    }
  },
  {
    id: 2,
    nombre: "Micro AMD Ryzen 7 5800X 4.7 Ghz AM4",
    precio: "$199.999",
    img: Ryzen7,
    descripcion: "CPU de 8 núcleos y 16 hilos con velocidad boost de 4.7 GHz. Excelente rendimiento para tareas exigentes y juegos de última generación.",
    specs: {
      cores: 8,
      threads: 16,
      baseClock: "3.8 GHz",
      turboClock: "4.7 GHz",
      TDP: "105W",
      socket: "AM4",
      cache: "32 MB L3"
    }
  },
  {
    id: 3,
    nombre: "Micro AMD Ryzen 9 5900X 4.8 Ghz AM4",
    precio: "$249.999",
    img: Ryzen9,
    descripcion: "Potente procesador de 12 núcleos y 24 hilos, frecuencia máxima de 4.8 GHz. Diseñado para creadores de contenido y entusiastas de alto rendimiento.",
    specs: {
      cores: 12,
      threads: 24,
      baseClock: "3.7 GHz",
      turboClock: "4.8 GHz",
      TDP: "105W",
      socket: "AM4",
      cache: "64 MB L3"
    }
  },
  {
    id: 4,
    nombre: "Micro AMD Ryzen 5 5600X 4.6 Ghz AM4",
    precio: "$139.999",
    img: Ryzen5,
    descripcion: "Procesador de 6 núcleos y 12 hilos, rendimiento optimizado para gaming. Socket AM4 y velocidad turbo de hasta 4.6 GHz.",
    specs: {
      cores: 6,
      threads: 12,
      baseClock: "3.7 GHz",
      turboClock: "4.6 GHz",
      TDP: "65W",
      socket: "AM4",
      cache: "32 MB L3"
    }
  },
  {
    id: 5,
    nombre: "Micro AMD Ryzen 3 5300G 4.4 Ghz AM4",
    precio: "$109.999",
    img: Ryzen3,
    descripcion: "CPU de 4 núcleos y 8 hilos con gráficos integrados Radeon. Solución económica para PCs de uso general y gaming ligero.",
    specs: {
      cores: 4,
      threads: 8,
      baseClock: "4.0 GHz",
      turboClock: "4.4 GHz",
      TDP: "65W",
      socket: "AM4",
      graphics: "Radeon Vega 6",
      cache: "8 MB L3"
    }
  }
];