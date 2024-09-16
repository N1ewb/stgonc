import React from 'react'

const RegistrationReqInfo = ({currentOpenedRegistrationCard ,setCurrentOpenedRegistrationCard}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      };

  return (
    <div className='w-full p-5 shadow-md rounded-[30px] '><div className="registration-req-header flex flex-row justify-between  w-full border-b-[1px] border-solid border-[#d1d1d1] mb-5">
        <h1 className='text-4xl font-bold text-[#720000]'>Registration <span className='font-light text-[#720000] text-4xl'>Request Info</span></h1>

        <button className='bg-transparent text-[#720000]' onClick={() => setCurrentOpenedRegistrationCard(null)}>X</button>
        </div>
        <div className="registration-req-body flex flex-col gap-3 [$_p]:m-0 [&_span]:text-[#7a7a7ad1] [&_span]:text-sm">
            <p><span>Full Name: </span>{`${currentOpenedRegistrationCard.firstName} ${currentOpenedRegistrationCard.lastName}`}</p>
            <p><span>Email: </span>{currentOpenedRegistrationCard.email}</p>
            <p><span>Role: </span>{currentOpenedRegistrationCard.role}</p>
            <p> <span>Department: </span>{currentOpenedRegistrationCard.department}</p>
            <p><span>Student ID Number: </span>{currentOpenedRegistrationCard.studentIdnumber}</p>
            <p><span>Phone Number: </span>{currentOpenedRegistrationCard.phoneNumber}</p>
        </div>
        <div className="registration-req-footer w-full flex flex-row justify-between [&_span]:text-[#7a7a7ad1] [&_span]:text-sm">
            <p><span >Status: </span>{currentOpenedRegistrationCard.status}</p>
            <p><span>Request Created At: </span>{formatDate(currentOpenedRegistrationCard.createdAt.toDate().toLocaleDateString())}</p>
        </div>
        </div>
  )
}

export default RegistrationReqInfo