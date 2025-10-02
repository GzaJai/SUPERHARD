import React from 'react'
import Carousel from '../Carousel'
import Banner from '../Banner'
import ImagenPrincipal from "../../assets/images/Imagen principal.png";

const Home = () => {
  return (
    <div className="flex flex-col h-dvh bg-neutral-900 text-white">
      <main className="flex-1 p-5">
        <Banner imgPath={ImagenPrincipal} />
        <Carousel />
        <h2>Contenido principal de la página</h2>
      </main>
    </div>
  )
}

export default Home