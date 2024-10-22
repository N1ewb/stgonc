import React, { useEffect, useState } from "react";

import DefaultProfile from "../../static/images/default-profile.png";
import CheckMarkDark from "../../static/images/tick-mark-dark.png";
import DenyDark from "../../static/images/delete-dark.png";
import MoreDark from "../../static/images/more-dark.png";
import { useAppointment } from "../../context/appointmentContext/AppointmentContext";
import { useDB } from "../../context/db/DBContext";
import Loading from "../Loading/Loading";
import Usercard from "../userscard/Usercard";

const AppointmentReqList = ({
  handleAcceptAppointment,
  handleDenyAppointment,
  appointment,
}) => {
  const db = useDB();
  const { setCurrentAppointment } = useAppointment();
  const [appointee, setAppointee] = useState(null);
  const [loading, setLoading] = useState(true)

  
  const handleGetUser = async (uid) => {
    setLoading(true)
    try {
      const user = await db.getUser(uid);
      setAppointee(user);
    } catch (error) {
      console.log(`Error in retrieving user data: ${error.message}`);
    }finally{
      setLoading(false)
    }
  };

  
  useEffect(() => {
    if (appointment.appointee) {
      handleGetUser(appointment.appointee);
    }
  }, [appointment]);

  const buttons = [
    {
      src: CheckMarkDark,
      alt: "Call",
      function: () => handleAcceptAppointment( appointment.id,
        appointee.userID, 
        appointment.appointmentDate),
    },
    {
      src: DenyDark,
      alt: "Message",
      function: () => handleDenyAppointment( appointment.id,
        appointee.userID, 
        "REASON: BALA KA JAN"),
    },
    {
      src: MoreDark,
      alt: "More",
      function: () => setCurrentAppointment(appointment),
    },
  ];

  if(loading){
    return <Loading />
  }

  return (
    <div className="w-[48%]">
      <Usercard data={appointment} buttons={buttons} />
    </div>
  );
};

export default AppointmentReqList;
