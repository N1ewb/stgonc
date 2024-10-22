import React, { useEffect, useState } from "react";

import More from '../../../../../static/images/more-dark.png'
import DefaultProfile from "../../../../../static/images/default-profile.png";
import { useDB } from "../../../../../context/db/DBContext";
import Usercard from "../../../../../components/userscard/Usercard";

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

  const buttons = [
    
    {
      src: More,
      alt: "More",
      function: () => handleSetCurrentAppointment(appointment),
    },
  ];

  return (
    <div className="w-[48%]">
      {faculty && <Usercard buttons={buttons} data={faculty} />}
    </div>
  );
};

export default PendingApptointmentsCard;
