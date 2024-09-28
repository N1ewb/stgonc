import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DefaultProfile from "../../static/images/default-profile.png";
import ChatDark from "../../static/images/chat.png";
import CallDark from "../../static/images/phone-call.png";
import MoreDark from "../../static/images/more-dark.png";
import { useAuth } from "../../context/auth/AuthContext";
import { useAppointment } from "../../context/appointmentContext/AppointmentContext";
import { useDB } from "../../context/db/DBContext";
import Loading from "../Loading/Loading";

const AppointmentList = ({ appointment, setCurrentChatReceiver }) => {
  const { setCurrentAppointment } = useAppointment();
  const auth = useAuth();
  const db = useDB();
  const [appointee, setAppointee] = useState(null);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleGetUser = async (uid) => {
    setLoading(true)
    try {
      const user = await db.getUser(uid);
      setAppointee(user);
    } catch (error) {
      setError(true)
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    if (appointment.appointee) {
      handleGetUser(appointment.appointee);
    }
  }, [appointment]);

  if(loading){
    return <Loading />
  }

  if(error){
    return <div className="div h-screen w-full justify-center items-center">Error Occured</div>
  }

  return (
    <div className="teacher-appointment-list-table w-full flex flex-row items-center [&_p]:m-0 justify-evenly bg-white p-5 rounded-[30px] shadow-md">
      <img
        src={appointee?.photoURL ? appointee.photoURL : DefaultProfile}
        alt="profile"
        height={80}
        width={80}
        className="rounded-full object-cover bg-[#320000] p-1"
      />
      <p className="capitalize font-semibold text-[#320000] w-[60%]">
        {appointee?.firstName} {appointee?.lastName}
        <br />
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
      {appointment && (
        <Link
          to={`/private/SendCallReq?appointment=${appointment.id}&receiver=${
            appointment.appointee || ""
          }&caller=${auth.currentUser.uid}`}
        >
          <img src={CallDark} alt="call" width={30} height={30} />
        </Link>
      )}

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
