import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DefaultProfile from "../../static/images/default-profile.png";
import ChatDark from "../../static/images/chat.png";
import CallDark from "../../static/images/phone-call.png";
import MoreDark from "../../static/images/more-dark.png";
import { useAuth } from "../../context/auth/AuthContext";
import { useAppointment } from "../../context/appointmentContext/AppointmentContext";
import { useDB } from "../../context/db/DBContext";

const AppointmentList = ({ appointment, setCurrentChatReceiver }) => {
  const { setCurrentAppointment } = useAppointment();
  const auth = useAuth();
  const db = useDB()
  const [appointee, setAppointee] = useState(null);

  
  const handleGetUser = async (uid) => {
    try {
      const user = await db.getUser(uid);
      setAppointee(user);
    } catch (error) {
      console.log(`Error in retrieving user data: ${error.message}`);
    }
  };

  
  useEffect(() => {
    if (appointment.appointee) {
      handleGetUser(appointment.appointee);
    }
  }, [appointment]);
  return (
    <div className="teacher-appointment-list-table w-full flex flex-row items-center [&_p]:m-0 justify-evenly bg-white p-5 rounded-[30px] shadow-md">
      <img
        src={DefaultProfile}
        alt="profile"
        height={80}
        width={80}
        className="rounded-full object-cover bg-[#320000] p-1"
      />
      <p className="capitalize font-semibold text-[#320000] w-[60%]">
        {appointee?.firstName} {appointee?.lastName}<br />
        <span className="text-[13px] text-[#969696] font-light normal-case">
          {appointee?.email}
        </span>
      </p>

      <button
        className="bg-transparent p-0"
        onClick={() => setCurrentChatReceiver(appointee && appointee)}  
      >
        <img src={ChatDark} alt="chat" width={30} height={30} />
      </button>
      <Link
        to={`/private/SendCallReq?receiver=${
          appointment && appointment.appointee
        }&caller=${auth.currentUser.uid}`}
      >
        <img src={CallDark} alt="chat" width={30} height={30} />
      </Link>
      <button
        className="p-0 bg-transparent"
        onClick={() => setCurrentAppointment(appointment)}
      >
        <img src={MoreDark} alt="more" height={40} width={30} />
      </button>
    </div>
  );
};

export default AppointmentList;
