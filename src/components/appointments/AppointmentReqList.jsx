import React, { useEffect, useState } from "react";

import DefaultProfile from "../../static/images/default-profile.png";
import CheckMarkDark from "../../static/images/tick-mark-dark.png";
import DenyDark from "../../static/images/delete-dark.png";
import MoreDark from "../../static/images/more-dark.png";
import { useAppointment } from "../../context/appointmentContext/AppointmentContext";
import { useDB } from "../../context/db/DBContext";

const AppointmentReqList = ({
  handleAcceptAppointment,
  handleDenyAppointment,
  appointment,
}) => {
  const db = useDB();
  const { setCurrentAppointment } = useAppointment();
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
    <div className="teacher-appointment-request-table w-full flex flex-row items-center [&_p]:m-0 justify-evenly bg-white p-5 rounded-[30px] shadow-md">
      <img
        src={DefaultProfile}
        alt="profile"
        height={80}
        width={80}
        className="rounded-full object-cover p-1 bg-[#320000] "
      />
      <p className="capitalize font-semibold text-[#320000] w-[60%]">
        {appointee ? `${appointee.firstName} ${appointee.lastName}` : "Loading..."} <br />
        <span className="text-[13px] text-[#969696] font-light normal-case">
          {appointee ? appointee.email : ""}
        </span>
      </p>

      <button
        className="bg-transparent p-0"
        onClick={() =>
          handleAcceptAppointment(
            appointment.id,
            appointee.userID, 
            appointment.appointmentDate
          )
        }
      >
        <img src={CheckMarkDark} alt="Accept" height={30} width={30} />
      </button>
      <button
        className="bg-transparent p-0"
        onClick={() =>
          handleDenyAppointment(
            appointment.id,
            appointee.userID, 
            "REASON: BALA KA JAN"
          )
        }
      >
        <img src={DenyDark} alt="Deny" height={30} width={30} />
      </button>
      <button
        className="p-0 bg-transparent"
        onClick={() => setCurrentAppointment(appointment)}
      >
        <img src={MoreDark} alt="more" height={30} width={30} />
      </button>
    </div>
  );
};

export default AppointmentReqList;
