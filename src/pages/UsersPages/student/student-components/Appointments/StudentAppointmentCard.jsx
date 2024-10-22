import React, { useEffect, useState } from "react";

import DefaultProfile from "../../../../../static/images/default-profile.png";
import More from "../../../../../static/images/more-dark.png";
import Chat from "../../../../../static/images/chat-dark.png";

import { useDB } from "../../../../../context/db/DBContext";
import { useChat } from "../../../../../context/chatContext/ChatContext";
import Usercard from "../../../../../components/userscard/Usercard";

const StudentAppointmentCard = ({ appointment, setCurrentAppointment }) => {
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
    const appointment = { appt, faculty };
    setCurrentAppointment((prevAppt) =>
      prevAppt === appt ? null : appointment
    );
  };

  useEffect(() => {
    if (appointment) {
      facultyData(appointment.appointedFaculty);
    }
  }, [appointment]);

  const buttons = [
    {
      src: Chat,
      alt: "Message",
      function: () => chat.setCurrentChatReceiver(faculty),
    },
    {
      src: More,
      alt: "More",
      function: () => handleSetCurrentAppointment(appointment),
    },
  ];

  return (
    <div className="w-[48%]">
      {faculty && <Usercard data={faculty} buttons={buttons} />}
    </div>
  );
};

export default StudentAppointmentCard;
