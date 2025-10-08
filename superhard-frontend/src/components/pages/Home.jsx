import React from 'react'
import Carousel from '../Carousel'
import Banner from '../Banner'
import ImagenPrincipal from "../../assets/images/Imagen principal.png";
import Footer from '../Footer';

const Home = () => {
  return (
      <div className="flex-grow">
        <Banner imgPath={ImagenPrincipal} />
        <Carousel />
      </div>

  )
}

export default Home