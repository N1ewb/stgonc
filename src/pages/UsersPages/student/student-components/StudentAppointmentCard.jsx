import React, { useEffect, useState } from 'react'
import { useDB } from '../../../../context/db/DBContext';
import { useChat } from '../../../../context/chatContext/ChatContext';

const StudentAppointmentCard = ({appointment}) => {
    const db = useDB()
    const chat = useChat()
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
    <div className="text-[#360000] flex flex-row items-center [&_p]:m-0 justify-between">
      <p className="text-2xl">{faculty?.firstName + " " + faculty?.lastName}</p>
      <button
        className="py-2 px-4"
        onClick={() => chat.setCurrentChatReceiver(faculty)}
      >
        Chat
      </button>
    </div>
  )
}

export default StudentAppointmentCard