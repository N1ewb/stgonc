import React from "react";

import DefaultProfile from "../../../../static/images/default-profile.png";
import CheckMarkDark from "../../../../static/images/tick-mark-dark.png";
import DenyDark from "../../../../static/images/delete-dark.png";
import MoreDark from "../../../../static/images/more-dark.png";

const AppointmentReqList = ({
  handleAcceptAppointment,
  handleDenyAppointment,
  appointment,
  handleSetCurrentAppointment,
}) => {
  return (
    <div className="teacher-appointment-request-table w-full flex flex-row items-center [&_p]:m-0 justify-evenly bg-white p-5 rounded-[30px] shadow-md">
      <img
        src={DefaultProfile}
        alt="profile"
        height={40}
        width={40}
        className="rounded-full bg-[#320000] p-1"
      />
      <p className="capitalize font-semibold text-[#320000] w-[60%]">
        {appointment.appointee.name} <br />
        <span className="text-[13px] text-[#969696] font-light normal-case">
          {appointment.appointee.email}
        </span>
      </p>

      <button
        className="bg-transparent p-0"
        onClick={() =>
          handleAcceptAppointment(
            appointment.id,
            appointment.appointee.email,
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
            appointment.appointee.email,
            "REASON: BALA KA JAN"
          )
        }
      >
        <img src={DenyDark} alt="Deny" height={30} width={30} />
      </button>
      <button
        className="p-0 bg-transparent"
        onClick={() => handleSetCurrentAppointment(appointment)}
      >
        <img src={MoreDark} alt="more" height={30} width={30} />
      </button>
    </div>
  );
};

export default AppointmentReqList;
