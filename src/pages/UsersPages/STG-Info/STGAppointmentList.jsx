import React, { useState } from "react";
import STGAppointmentCard from "./STGAppointmentCard";
import STGAdditionalInfo from "./STGAdditionalInfo";

const STGAppointmentList = ({ pastAppointments = [] }) => {
  const [currentAppt, setCurrentAppt] = useState(null);
  const sortedAppointments = pastAppointments.length
    ? pastAppointments.sort((b, a) => {
        return b.createdAt?.toMillis() - a.createdAt?.toMillis();
      })
    : [];

  return (
    <div className=" w-full h-[90%] flex justify-between">
      <div className="w-1/2 max-h-[90%] overflow-auto">
        {sortedAppointments.length !== 0
          ? sortedAppointments.map((appt) => (
              <STGAppointmentCard
                key={appt.id}
                appt={appt}
                setCurrentAppt={setCurrentAppt}
                currentAppt={currentAppt}
              />
            ))
          : "No past appointments with this user"}
      </div>
      <div className="w-[47%] h-[90%] flex justify-center items-center">
        {currentAppt && <STGAdditionalInfo appt={currentAppt} />}
      </div>
    </div>
  );
};

export default STGAppointmentList;
