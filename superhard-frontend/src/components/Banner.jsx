import React from 'react'


const Banner = ({ imgPath }) => {
  return (
    <div className='flex w-full justify-center'>
        <img className='w-full object-cover' src={imgPath} alt="" />
    </div>
  )
}

export default Banner