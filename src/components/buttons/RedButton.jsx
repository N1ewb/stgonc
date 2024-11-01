import React from 'react'

const RedButton = ({click, label}) => {
  return (
    <button onClick={click} className='m-0 py-2 px-5 bg-[#720000] rounded-md'>{label}</button>
  )
}

export default RedButton