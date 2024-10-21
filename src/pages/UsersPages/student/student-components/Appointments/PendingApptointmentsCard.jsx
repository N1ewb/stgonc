import React, { useEffect, useState } from "react";

import More from '../../../../../static/images/more-dark.png'
import DefaultProfile from "../../../../../static/images/default-profile.png";
import { useDB } from "../../../../../context/db/DBContext";

const PendingApptointmentsCard = ({ appointment, setCurrentAppointment }) => {
  const db = useDB();
  const [faculty, setFacultyData] = useState(null);
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

  const handleSetCurrentAppointment = (appt) => {
    const appointment = {appt, faculty}
    setCurrentAppointment((prevAppt) => (prevAppt === appt ? null : appointment));
  }

  return (
    <div>
      {faculty && <div className="text-[#360000] w-full flex flex-row items-center [&_p]:m-0 justify-between shadow-md rounded-3xl p-4">
        <div className="flex flex-row items-center w-full justify-between">
          <div className="flex flex-row gap-3 items-center"><img
            className="w-[80px] p-[2px] bg-[#320000] h-[80px] rounded-full object-cover"
            src={faculty.photoURL ? faculty.photoURL : DefaultProfile}
            alt="profile"
          />
          <p className="text-xl flex flex-col">
            <span>{faculty.firstName + " " + faculty.lastName}</span>
            <span className="text-[#d4d4d4] text-base">{faculty.email}</span>
          </p></div>
          <button className="bg-transparent m-0 p-0" onClick={() => handleSetCurrentAppointment(appointment)}><img src={More} alt="more" height={25} width={25} /></button>
        </div>
      </div>}
    </div>
  );
};

export default PendingApptointmentsCard;
