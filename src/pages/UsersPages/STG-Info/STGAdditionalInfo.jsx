import React from "react";
import download from "../../../static/images/download.png";

const STGAdditionalInfo = ({ appt, handleDownloadRecord }) => {
  return (
    <div className="w-full h-full flex flex-col [&_span]:text-[12px] [&_span]:text-[#9e9e9e] [&_p]:m-0 p-10 gap-3">
      <div className="buttonw-full flex items-center justify-between">
        <div className="date-time flex flex-col ">
          <h1 className="text-[20px]">{appt.appointmentDate}</h1>
          <h2 className="text-[14px]">
            {`${appt.appointmentsTime.appointmentStartTime}:00-${appt.appointmentsTime.appointmentEndTime}:00`}
          </h2>
        </div>
        <button
          className="bg-[#4CAF50] px-14 py-2 rounded-xl"
          onClick={(e) => handleDownloadRecord(appt, e)}
        >
          <img src={download} alt="download" height={30} width={30} />
        </button>
      </div>
      <div className="basic-information">
        {" "}
        <p>
          <span>Student Concern: </span>
          <br />
          {appt.appointmentConcern}
        </p>
        <p>
          <span>Concern Type: </span>
          <br />
          {appt.appointmentType}
        </p>
        <p>
          <span>Appointment Mode: </span>
          <br />
          {appt.appointmentFormat}{" "}
        </p>
        <p>
          <span>Duration: </span>
          <br />
          {appt.appointmentDuration} Hr/s
        </p>
      </div>
      <div className="facultys-observations">
        
      </div>
    </div>
  );
};

export default STGAdditionalInfo;
