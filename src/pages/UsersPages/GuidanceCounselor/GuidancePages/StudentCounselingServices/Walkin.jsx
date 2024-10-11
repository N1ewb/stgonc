import React, { useState } from 'react'
import WalkinForm from '../../GuidanceComponents/WalkinForm'
import Add from '../../../../../static/images/add.png'

const Walkin = () => {
  const [isWalkingFormOpen, setisWalkingFormOpen] = useState(false)

  const handleOpenWalkinForm = () => {
    setisWalkingFormOpen(!isWalkingFormOpen)
  }

  const SampleData = [
    {
      firstName: "ahaha",
      lastName: "ddd",
      email: "easd",
    },
    {
      firstName: "ahaha",
      lastName: "ddd",
      email: "easd",
    },
    {
      firstName: "ahaha",
      lastName: "ddd",
      email: "easd",
    },
    {
      firstName: "ahaha",
      lastName: "ddd",
      email: "easd",
    },
    {
      firstName: "ahaha",
      lastName: "ddd",
      email: "easd",
    },
  ];
  return (
    <div className="flex flex-col gap-10 h-[100%] w-full">
      <header className="flex flex-row items-center gap-10 h-[20%]">
        <h3>
          Walk-in <span className="font-light">Page</span>
        </h3>
        <button className="bg-transparent p-0" onClick={handleOpenWalkinForm}>
          <img src={Add} alt="add" height={35} width={35} />
        </button>
      </header>
      <main className="m-h-[80%] flex flex-row">
        <div
          className={`form-container transition-all duration-500 ease-out ${
            isWalkingFormOpen ? "w-1/2" : "w-0"
          }`}
        >
          {isWalkingFormOpen && <WalkinForm handleOpenWalkinForm={handleOpenWalkinForm} />}
        </div>
        <div
          className={`data-container p-10 transition-all duration-500 ease-out ${
            !isWalkingFormOpen ? "w-full" : "w-1/2"
          }`}
        >
          {SampleData.map((data, index) => (
            <div
              key={index}
              className="flex flex-row shadow-md rounded-3xl p-10"
            >
              <p>{data.firstName}</p>
              <p>{data.lastName}</p>
              <p>{data.email}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Walkin