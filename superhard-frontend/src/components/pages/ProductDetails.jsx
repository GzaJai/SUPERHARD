import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { productos } from '../../data/products';

const ProductDetails = () => {
    const [product, setProduct] = useState();
    const { id } = useParams();

    useEffect(() => {
        setProduct(productos.find(p => p.id == id))
    }, [])
    
    
  return (
    <div className="flex flex-col h-dvh bg-[#494949] text-white items-center">
        {product && 
            <div className='flex flex-col pt-10 w-2/3 justify-around items-center'>
                <div className='flex justify-between items-center'>
                    <img className='w-1/5 rounded-xl' src={product.img} alt="" />
                    <div className='flex flex-col w-auto items-center gap-[2rem]'>
                        <p className='text-2xl font-semibold'>{product.nombre}</p>
                        <p className='text-3xl font-bold'>{product.precio}</p>
                    </div>
                    <div>
                        <button className='p-[1rem] font-bold text-lg text-black bg-[#EEDA00] rounded-lg cursor-pointer'>Agregar al carrito</button>
                    </div>
                </div>
                <div className='mt-10 pb-10 w-full px-10 bg-[#3E3E3E] rounded-lg'>
                    <p className='text-2xl py-10 '><span className='font-bold'>Descripción: </span>{product.descripcion}</p>
                {product.specs && (
                    <>
                        <h3 className='text-2xl font-bold'>Especificaciones: </h3>
                        {Object.entries(product.specs).map(([key, value]) => (
                            <p key={key} className='text-lg'>
                            <span className='font-semibold'>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</span> {value}
                        </p>
                        ))}
                    </>
                )}
                </div>
            </div>
        }
    </div>
  )
}

export default ProductDetails