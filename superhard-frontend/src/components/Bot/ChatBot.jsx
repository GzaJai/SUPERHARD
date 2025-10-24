import { useEffect } from "react";

export default function Chatbot() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jotfor.ms/agent/embedjs/0199f7faf2547a3183d56023d3276545e995/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // se elimina al salir de la ruta
    };
  }, []);

  return null; // no necesita renderizar nada visible
}
