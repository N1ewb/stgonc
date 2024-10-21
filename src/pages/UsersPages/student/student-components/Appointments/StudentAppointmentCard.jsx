import React, { useEffect, useState } from "react";


import DefaultProfile from "../../../../../static/images/default-profile.png";
import More from '../../../../../static/images/more-dark.png'
import Chat from '../../../../../static/images/chat-dark.png'

import { useDB } from "../../../../../context/db/DBContext";
import { useChat } from "../../../../../context/chatContext/ChatContext";

const StudentAppointmentCard = ({ appointment, setCurrentAppointment  }) => {
  const db = useDB();
  const chat = useChat();
  const [faculty, setFacultyData] = useState(null);
  const facultyData = async (uid) => {
    try {
      const data = await db.getUser(uid);
      setFacultyData(data);
    } catch (error) {
      console.log("Error occured in getting faculty data");
    }
  };

  const handleSetCurrentAppointment = (appt) => {
    const appointment = {appt, faculty}
    setCurrentAppointment((prevAppt) => (prevAppt === appt ? null : appointment));
  }

  useEffect(() => {
    if (appointment) {
      facultyData(appointment.appointedFaculty);
    }
  }, [appointment]);
  return (
    <div className="w-full">
      {faculty && (
        <div className="text-[#360000] w-full flex flex-row items-center [&_p]:m-0 justify-between shadow-md rounded-3xl p-4">
          <div className="div flex flex-row w-[70%] items-center gap-3">
            <img
              className="w-[80px] p-[2px] bg-[#320000] h-[80px] rounded-full object-cover"
              src={faculty.photoURL ? faculty.photoURL : DefaultProfile}
              alt="profile"
            />

            <p className="text-xl flex flex-col">
              <span>{faculty.firstName + " " + faculty.lastName}</span>
              <span className="text-[#d4d4d4] text-base">{faculty?.email}</span>
            </p>
          </div>
          <div className="flex flex-row items-center gap-3 bg-transparent"><button
            className="py-2 px-4"
            onClick={() => chat.setCurrentChatReceiver(faculty)}
          >
            <img src={Chat} alt="more" width={25} height={25} />
          </button>
          <button className="bg-transparent p-0 m-0" onClick={() => handleSetCurrentAppointment(appointment)}><img src={More} alt="more" width={25} height={25} /></button></div>
        </div>
      )}
    </div>
  );
};

export default StudentAppointmentCard;
