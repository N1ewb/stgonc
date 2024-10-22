import React from 'react'
import cursorIcon from '../../static/images/Vector.png'

const DefaultInfoScreen = () => {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center text-[#320000] gap-5'>
        <h1 className='font-light text-[40px] '>No available data to display</h1>
        <p className='font-light'>Kindly choose a <span className='font-bold'>user account</span> to show its information</p>
        <img src={cursorIcon} alt="" className='h-[250px]' />
    </div>
  )
}

export default DefaultInfoScreen