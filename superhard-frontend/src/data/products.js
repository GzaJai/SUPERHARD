import Ryzen3 from "../assets/images/Ryzen-3-5300G.jpg";
import Ryzen5 from "../assets/images/Ryzen-5-5600GT.jpg";
import Ryzen7 from "../assets/images/Ryzen-7-5800X.jpg";
import Ryzen9 from "../assets/images/Ryzen-9-5900X.jpg";
import IntelI5 from "../assets/images/Intel-Core-i5-11400F.jpg";
import IntelI7 from "../assets/images/Intel-Core-i7-11700K.jpg";
import IntelI9 from "../assets/images/Intel-Core-i9-11900K.jpg";


export const productos = [
  {
    id: 1,
    nombre: "Micro AMD Ryzen 5 5600GT 4.6 Ghz AM4",
    precio: "$134.999",
    img: Ryzen5,
    descripcion: "Procesador de 6 núcleos y 12 hilos, con frecuencia turbo de hasta 4.6 GHz. Ideal para gaming y multitarea eficiente en socket AM4.",
    specs: {
      general: {
        cores: 6,
        threads: 12,
        socket: "AM4",
        cache: "32 MB L3",
        lithography: "7nm"
      },
      rendimiento: {
        baseClock: "3.7 GHz",
        turboClock: "4.6 GHz",
        precisionBoost: "Sí"
      },
      memoria: {
        maxRAM: "128 GB",
        typeRAM: "DDR4",
        dualChannel: "Sí"
      },
      gráficos: {
        integratedGPU: "No",
        supportedDisplays: "HDMI, DisplayPort"
      },
      cooling: {
        TDP: "65W",
        disipador: "No",
        overclockable: "Limitado"
      }
    }
  },
  {
    id: 2,
    nombre: "Micro AMD Ryzen 7 5800X 4.7 Ghz AM4",
    precio: "$199.999",
    img: Ryzen7,
    descripcion: "CPU de 8 núcleos y 16 hilos con velocidad boost de 4.7 GHz. Excelente rendimiento para tareas exigentes y juegos de última generación.",
    specs: {
      general: {
        cores: 8,
        threads: 16,
        socket: "AM4",
        cache: "32 MB L3",
        lithography: "7nm"
      },
      rendimiento: {
        baseClock: "3.8 GHz",
        turboClock: "4.7 GHz",
        precisionBoost: "Sí"
      },
      memoria: {
        maxRAM: "128 GB",
        typeRAM: "DDR4",
        dualChannel: "Sí"
      },
      gráficos: {
        integratedGPU: "No"
      },
      cooling: {
        TDP: "105W",
        disipador: "No",
        overclockable: "Sí"
      }
    }
  },
  {
    id: 3,
    nombre: "Micro AMD Ryzen 9 5900X 4.8 Ghz AM4",
    precio: "$249.999",
    img: Ryzen9,
    descripcion: "Potente procesador de 12 núcleos y 24 hilos, frecuencia máxima de 4.8 GHz. Diseñado para creadores de contenido y entusiastas de alto rendimiento.",
    specs: {
      general: {
        cores: 12,
        threads: 24,
        socket: "AM4",
        cache: "64 MB L3",
        lithography: "7nm"
      },
      rendimiento: {
        baseClock: "3.7 GHz",
        turboClock: "4.8 GHz",
        precisionBoost: "Sí"
      },
      memoria: {
        maxRAM: "128 GB",
        typeRAM: "DDR4",
        dualChannel: "Sí"
      },
      gráficos: {
        integratedGPU: "No"
      },
      cooling: {
        TDP: "105W",
        disipador: "No",
        overclockable: "Sí"
      }
    }
  },
  {
    id: 4,
    nombre: "Micro AMD Ryzen 5 5600X 4.6 Ghz AM4",
    precio: "$139.999",
    img: Ryzen5,
    descripcion: "Procesador de 6 núcleos y 12 hilos, rendimiento optimizado para gaming. Socket AM4 y velocidad turbo de hasta 4.6 GHz.",
    specs: {
      general: {
        cores: 6,
        threads: 12,
        socket: "AM4",
        cache: "32 MB L3",
        lithography: "7nm"
      },
      rendimiento: {
        baseClock: "3.7 GHz",
        turboClock: "4.6 GHz",
        precisionBoost: "Sí"
      },
      memoria: {
        maxRAM: "128 GB",
        typeRAM: "DDR4",
        dualChannel: "Sí"
      },
      gráficos: {
        integratedGPU: "No"
      },
      cooling: {
        TDP: "65W",
        disipador: "Sí",
        overclockable: "Limitado"
      }
    }
  },
  {
    id: 5,
    nombre: "Micro AMD Ryzen 3 5300G 4.4 Ghz AM4",
    precio: "$109.999",
    img: Ryzen3,
    descripcion: "CPU de 4 núcleos y 8 hilos con gráficos integrados Radeon. Solución económica para PCs de uso general y gaming ligero.",
    specs: {
      general: {
        cores: 4,
        threads: 8,
        socket: "AM4",
        cache: "8 MB L3",
        lithography: "7nm"
      },
      rendimiento: {
        baseClock: "4.0 GHz",
        turboClock: "4.4 GHz",
        precisionBoost: "Sí"
      },
      memoria: {
        maxRAM: "64 GB",
        typeRAM: "DDR4",
        dualChannel: "Sí"
      },
      gráficos: {
        integratedGPU: "Radeon Vega 6",
        supportedDisplays: "HDMI, DisplayPort"
      },
      cooling: {
        TDP: "65W",
        disipador: "Sí",
        overclockable: "No"
      }
    }
  },
  {
    id: 6,
    nombre: "Micro Intel Core i5-11400F 2.6 Ghz LGA1200",
    precio: "$129.999",
    img: IntelI5,
    descripcion: "Procesador de 6 núcleos y 12 hilos, velocidad base de 2.6 GHz, sin gráficos integrados. Ideal para gaming y productividad.",
    specs: {
      general: {
        cores: 6,
        threads: 12,
        socket: "LGA1200",
        cache: "12 MB L3",
        lithography: "14nm"
      },
      rendimiento: {
        baseClock: "2.6 GHz",
        turboClock: "4.4 GHz",
        precisionBoost: "Sí"
      },
      memoria: {
        maxRAM: "64 GB",
        typeRAM: "DDR4",
        dualChannel: "Sí"
      },
      gráficos: {
        integratedGPU: "No"
      },
      cooling: {
        TDP: "65W",
        disipador: "Sí",
        overclockable: "No"
      }
    }
  },
  {
    id: 7,
    nombre: "Micro Intel Core i7-11700K 3.6 Ghz LGA1200",
    precio: "$249.999",
    img: IntelI7,
    descripcion: "Procesador de 8 núcleos y 16 hilos, velocidad base de 3.6 GHz, desbloqueado para overclocking. Excelente para tareas exigentes.",
    specs: {
      general: {
        cores: 8,
        threads: 16,
        socket: "LGA1200",
        cache: "16 MB L3",
        lithography: "14nm"
      },
      rendimiento: {
        baseClock: "3.6 GHz",
        turboClock: "5.0 GHz",
        precisionBoost: "Sí"
      },
      memoria: {
        maxRAM: "64 GB",
        typeRAM: "DDR4",
        dualChannel: "Sí"
      },
      gráficos: {
        integratedGPU: "Intel UHD Graphics 750"
      },
      cooling: {
        TDP: "125W",
        disipador: "No",
        overclockable: "Sí"
      }
    }
  },
  {
    id: 8,
    nombre: "Micro Intel Core i9-11900K 3.5 Ghz LGA1200",
    precio: "$329.999",
    img: IntelI9,
    descripcion: "Procesador de 8 núcleos y 16 hilos, velocidad base de 3.5 GHz, desbloqueado para overclocking. Ideal para entusiastas y creadores de contenido.",
    specs: {
      general: {
        cores: 8,
        threads: 16,
        socket: "LGA1200",
        cache: "16 MB L3",
        lithography: "14nm"
      },
      rendimiento: {
        baseClock: "3.5 GHz",
        turboClock: "5.3 GHz",
        precisionBoost: "Sí"
      },
      memoria: {
        maxRAM: "64 GB",
        typeRAM: "DDR4",
        dualChannel: "Sí"
      },
      gráficos: {
        integratedGPU: "Intel UHD Graphics 750"
      },
      cooling: {
        TDP: "125W",
        disipador: "No",
        overclockable: "Sí"
      }
    }
  }
];
