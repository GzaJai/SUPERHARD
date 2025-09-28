import React from 'react'
import Carousel from '../Carousel'
import Header from '../Header'

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-neutral-900 text-white">
      <main className="flex-1 p-5">
        <Carousel />

        <h2>Contenido principal de la página</h2>
      </main>
    </div>
  )
}

export default Home