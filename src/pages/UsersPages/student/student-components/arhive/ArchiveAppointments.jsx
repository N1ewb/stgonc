import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import More from "../../../../../static/images/more-dark.png";
const ArchiveAppointments = ({ appointment, handleOpenForm }) => {
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
    <div className="w-full flex flex-row justify-between items-center shadow-md rounded-3xl p-5">
      <p>
        This appointment was {appointment.appointmentStatus} by{" "}
        {faculty?.firstName} {faculty?.lastName}
      </p>
      <button className="bg-transparent p-0" onClick={() => handleOpenForm(appointment)}>
        {" "}
        <img src={More} alt="More info" height={25} width={25} />
      </button>
    </div>
  );
};

export default ArchiveAppointments;
