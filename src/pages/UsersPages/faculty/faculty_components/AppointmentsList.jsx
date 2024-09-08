import React from "react";
import { Link } from "react-router-dom";

import DefaultProfile from "../../../../static/images/default-profile.png";
import ChatDark from "../../../../static/images//chat-dark.png";
import CallDark from "../../../../static/images/phone-call.png";
import MoreDark from "../../../../static/images/more-dark.png";

const AppointmentList = ({
  appointment,
  auth,
  handleSetCurrentAppointment,
  setCurrentChatReceiver,
}) => {
  return (
    <div className="teacher-appointment-list-table w-full flex flex-row items-center [&_p]:m-0 justify-evenly bg-white p-5 rounded-[30px] shadow-md">
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
        onClick={() => setCurrentChatReceiver(appointment)}
      >
        <img src={ChatDark} alt="chat" width={30} height={30} />
      </button>
      <Link
        to={`/private/SendCallReq?receiver=${
          appointment && appointment.appointee.userID
        }&caller=${auth.currentUser.uid}`}
      >
        <img src={CallDark} alt="chat" width={30} height={30} />
      </Link>
      <button
        className="p-0 bg-transparent"
        onClick={() => handleSetCurrentAppointment(appointment)}
      >
        <img src={MoreDark} alt="more" height={40} width={30} />
      </button>
    </div>
  );
};

export default AppointmentList;
