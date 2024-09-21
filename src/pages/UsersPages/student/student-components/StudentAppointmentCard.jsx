import React, { useEffect, useState } from 'react'
import { useDB } from '../../../../context/db/DBContext';
import { useChat } from '../../../../context/chatContext/ChatContext';

import DefaultProfile from '../../../../static/images/default-profile.png'

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
    <div className="text-[#360000] w-full flex flex-row items-center [&_p]:m-0 justify-between shadow-md rounded-3xl p-4">
      <div className="div flex flex-row w-[70%] items-center gap-3">
       
       <img className='w-[80px] p-[2px] bg-[#320000] h-[80px] rounded-full object-cover' src={faculty?.photoURL ? faculty?.photoURL : DefaultProfile} alt='profile' />
   
      <p className="text-2xl">{faculty?.firstName + " " + faculty?.lastName}</p>
      </div>
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