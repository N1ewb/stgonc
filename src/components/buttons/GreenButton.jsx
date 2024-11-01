import React from 'react'

const GreenButton = ({click, label}) => {
  return (
    <button onClick={click} className='m-0 py-2 px-5 bg-[#57a627] rounded-md'>{label}</button>
  )
}

export default GreenButton