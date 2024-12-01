import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";

const ArchiveInfo = ({ appointment, handleOpenForm }) => {
  const db = useDB();
  const [faculty, setFacultyData] = useState();

  const facultyData = async (uid) => {
    try {
      const data = await db.getUser(uid);
      setFacultyData(data);
    } catch (error) {
      console.log("Error occurred in getting faculty data");
    }
  };

  useEffect(() => {
    if (appointment) {
      facultyData(appointment.appointedFaculty);
    }
  }, [appointment]);

  return (
    <div className="archive-info w-[48%] bg-white shadow-md rounded-[30px] p-10 relative lg:w-full lg:absolute transition-all ease-in-out duration-300">
      <header className="archive-info-header flex flex-row items-center justify-between border-b-[1px] border-solid border-[#aeaeae] mb-5">
        <h1 className="text-[#720000]">Archive Info</h1>
        <button
          className="bg-[#320000] hover:bg-[#720000] rounded-md m-0 text-white"
          onClick={() => handleOpenForm(appointment)}
        >
          X
        </button>
      </header>
      <main className="archive-info-content flex flex-col gap-3 pt-3">
        <p><span className="text-[14px] text-[#929292]">Department: </span>{appointment.department}</p>
        <p><span className="text-[14px] text-[#929292]">Appointment Type: </span>{appointment.appointmentType}</p>
        <p><span className="text-[14px] text-[#929292]">Appointment Status: </span>{appointment.appointmentStatus}</p>
        <p><span className="text-[14px] text-[#929292]">Appointment Mode: </span>{appointment.appointmentFormat}</p>
        <p><span className="text-[14px] text-[#929292]">Appointment Duration: </span>{appointment.appointmentDuration}</p>
        <p><span className="text-[14px] text-[#929292]">Teacher Remarks: </span>{appointment.teacherRemarks}</p>
        <p><span className="text-[14px] text-[#929292]">Appointment Date: </span>{appointment.appointmentDate}</p>
      </main>
    </div>
  );
};

export default ArchiveInfo;
