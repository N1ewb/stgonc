import React from "react";

const WalkinInfo = ({ currentWalkin, setCurrentWalkin }) => {
  return (
    <div className="w-full rounded-3xl shadow-md py-10 px-5">
      <div className="current-walkin-info-header w-full flex flex-row justify-between border-b-[1px] border-solid border-[#b3b2b2] pb-2  mb-4 ">
        <h3 className="text-[#720000] font-bold">Walkin Appointment <span className="font-light">Info</span></h3>
        <button
          className="bg-transparent hover:bg-transparent text-[#720000]"
          onClick={() => setCurrentWalkin(null)}
        >
          X
        </button>
      </div>
      <div className="current-walking-info-content flex flex-col gap-3 [&_p]:m-0">
        <p><span>Name: </span> {currentWalkin.appointee.firstName} {currentWalkin.appointee.lastName}</p>
        <p><span>Appointee Type: </span>{currentWalkin.appointeeType}</p>
        <p><span>Concern: </span> {currentWalkin.appointmentConcern}</p>
        <p><span>Remarks: </span> {currentWalkin.teacherRemarks }</p>
        <div className="group flex flex-row justify-between items-center">
        <p><span>Date: </span> {currentWalkin.appointmentDate}</p>
        <button className="bg-[#720000] rounded-md px-5 py-2">Edit</button>
        </div>
      </div>
    </div>
  );
};

export default WalkinInfo;
