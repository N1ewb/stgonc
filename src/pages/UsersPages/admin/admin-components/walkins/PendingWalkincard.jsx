import React from 'react'

const PendingWalkincard = ({walkin}) => {
  return (
    <div className='p-10 rounded-3xl shadow-md flex flex-row justify-between'>
        <p>Name: {walkin.appointee.firstName} {walkin.appointee.lastName}</p>
    </div>
  )
}

export default PendingWalkincard