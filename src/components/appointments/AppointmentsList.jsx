import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import DefaultProfile from "../../static/images/default-profile.png";
import ChatDark from "../../static/images/chat.png";
import CallDark from "../../static/images/phone-call.png";
import MoreDark from "../../static/images/more-dark.png";
import { useAuth } from "../../context/auth/AuthContext";
import { useAppointment } from "../../context/appointmentContext/AppointmentContext";
import { useDB } from "../../context/db/DBContext";
import Loading from "../Loading/Loading";
import Usercard from "../userscard/Usercard";

const AppointmentList = ({ appointment, setCurrentChatReceiver }) => {
  const { setCurrentAppointment } = useAppointment();
  const auth = useAuth();
  const db = useDB();
  const navigate = useNavigate();
  const [appointee, setAppointee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleGetUser = async (uid) => {
    setLoading(true);
    try {
      const user = await db.getUser(uid);
      setAppointee(user);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointment.appointee) {
      handleGetUser(appointment.appointee);
    }
  }, [appointment]);

  const handleCall = () => {
    navigate(
      `/private/SendCallReq?appointment=${appointment.id}&receiver=${
        appointment.appointee || ""
      }&caller=${auth.currentUser.uid}`
    );
  };
  const buttons = [
    appointment.appointmentStatus === "Finished"
      ? null
      : {
          src: CallDark,
          alt: "Call",
          function: () => handleCall(),
          needsParams: false,
        },
    {
      src: ChatDark,
      alt: "Message",
      function: () => setCurrentChatReceiver(appointee),
      needsParams: true,
    },
    {
      src: MoreDark,
      alt: "More",
      function: () =>
        appointment.appointmentStatus === "Finished"
          ? navigate(`/private/${auth.currentUser.role}/dashboard/appointments/students-info?appointee=${appointment.appointee}
`)
          : setCurrentAppointment(appointment),
      needsParams: true,
    },
  ].filter(Boolean);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="div h-screen w-full justify-center items-center">
        Error Occured
      </div>
    );
  }

  return (
    <div className="w-[48%]">
      <Usercard data={appointment} buttons={buttons} />
    </div>
  );
};

export default AppointmentList;
