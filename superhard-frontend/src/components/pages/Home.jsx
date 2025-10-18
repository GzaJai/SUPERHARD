import React from 'react'
import Carousel from '../Carousel'
import Banner from '../Banner'
import ImagenPrincipal from "../../assets/images/Imagen principal.png";

const Home = () => {
  return (

    <div className="flex flex-col min-h-screen bg-neutral-900 text-white">
      <main className="flex-grow">
        <Banner imgPath={ImagenPrincipal} />
        <Carousel />
      </main>
    </div>

  )
}

export default Home