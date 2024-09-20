import React, { useEffect, useState } from "react";
import { useDB } from "../../../../context/db/DBContext";
import { useChat } from "../../../../context/chatContext/ChatContext";

const PendingApptointmentsCard = ({ appointment }) => {
  const db = useDB();
  const chat = useChat();
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
    <div>
      <div className="text-[#360000] flex flex-row items-center [&_p]:m-0 justify-between">
        <p className="text-2xl">
          {faculty?.firstName + " " + faculty?.lastName}
        </p>
      </div>
    </div>
  );
};

export default PendingApptointmentsCard;
