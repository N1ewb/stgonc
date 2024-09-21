import React from "react";

const InstructorInfo = ({
  currentInstructor,
  setInstructorInfo,
  toggleShow,
}) => {
  return (
    <div className="faculty-info h-auto w-full bg-white shadow-lg rounded-[30px] p-10 relative">
      <div className="faculty-info-header flex flex-row justify-between border-b-[1px] border-solid border-[#aeaeae] mb-5">
        <h1 className="text-[#720000]">Faculty Info</h1>
        <button
          className="bg-transparent p-0 m-0 hover:bg-transparent text-[#720000]"
          onClick={() => setInstructorInfo(null)}
        >
          X
        </button>
      </div>
      <div className="faculty-info flex flex-row w-full justify-between">
        {" "}
        <div className="faculty-info-content flex-col flex [&_span]:text-[#d1d1d1] [&_p]:m-0 gap-3">
          <p className="capitalize">
            <span className="">Name: </span>
            <br></br>
            {currentInstructor.firstName} {currentInstructor.lastName}
          </p>
          <p className="">
            <span>Email: </span>
            <br></br>
            {currentInstructor.email}
          </p>
          <p>
            <span>Faculty ID Number: </span>
            <br></br>
            {currentInstructor.facultyIdnumber}
          </p>
          <p>
            <span>Department: </span>
            <br></br>
            {currentInstructor.department}  
          </p>
        </div>
        <div className="faculty-profile w-[47%] flex items-center justify-center rounded-md bg-[#720000] p-[2px]">
          <img
            className="h-auto w-full "
            src={currentInstructor.photoURL}
            alt="Faculty Profile"
          />
        </div>
      </div>
      <div className="faculty-info-footer  w-full justify-between gap-10 flex flex-row  items-center [&_p]:m-0 [&_span]:text-[#d1d1d1] mt-5">
        <p className="flex items-center justify-center gap-2">
          <span>Status: </span>
          <span className="p-2 bg-red-400 rounded-md"></span>
        </p>

        <button
          className="bg-[#360000] rounded-[4px] px-6 py-2 hover:bg[#323232]"
          onClick={() => toggleShow(currentInstructor)}
        >
          Request Appointment
        </button>
      </div>
    </div>
  );
};

export default InstructorInfo;
