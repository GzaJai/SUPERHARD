import React from 'react'
import Carousel from '../Carousel'
import Banner from '../Banner'
import ImagenPrincipal from "../../assets/images/Imagen principal.png";

const Home = () => {
  return (

    <div className="flex flex-col h-100% w-100% min-w-screen  bflex flex-col min-h-screen bg-[#494949] text-whiteg-neutral-900 text-white">
      <main className="flex-grow">
        <Banner imgPath={ImagenPrincipal} />
        <Carousel />
      </main>
    </div>


  )
}

export default Home