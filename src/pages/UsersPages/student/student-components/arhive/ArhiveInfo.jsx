import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";

const ArhiveInfo = ({ appointment, handleOpenForm }) => {
  const db = useDB();
  const [faculty, setFacultyData] = useState();
  const facultyData = async (uid) => {
    try {
      const data = await db.getUser(uid);
      setFacultyData(data);
    } catch (error) {
      console.log("Error occured in getting faculty data");
    }
  };

  useEffect(() => {
    if (appointment) {
      facultyData(appointment.appointedFaculty);
    }
  }, [appointment]);

  return (
    <div className="w-[45%] max-h-[100%] overflow-auto flex flex-col p-10 shadow-md rounded-3xl">
      <header className="flex flex-row w-full justify-between items-center border-b-[1px] border-solid border-[#9e9c9c32] pb-3">
        <h1 className="">Archive Info</h1>
        <button className="p-0 bg-transparent text-[#320000] cursor-pointer" onClick={() => handleOpenForm(appointment)}>X</button>
      </header>
      <main className="flex flex-col gap-3 pt-3"> 
        <p><span>Department: </span>{appointment.department}</p>
        <p><span>Appointment Type: </span>{appointment.appointmentType}</p>
        <p><span>Appointment Status: </span>{appointment.appointmentStatus}</p>
        <p><span>Appointment Mode: </span>{appointment.appointmentFormat}</p>
        <p><span>Appointment Duration: </span>{appointment.appointmentDuration}</p>
        <p><span>Teacher Remarks: </span>{appointment.teacherRemarks}</p>
        <p><span>Appointment Date was </span>{appointment.appointmentDate}</p>
      </main>
    </div>
  );
};

export default ArhiveInfo;
