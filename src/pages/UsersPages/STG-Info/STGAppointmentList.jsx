import React from "react";
import STGAppointmentCard from "./STGAppointmentCard";

const STGAppointmentList = ({ pastAppointments = [] }) => {
  const sortedAppointments = pastAppointments.length
    ? pastAppointments.sort((b, a) => {
        return b.createdAt?.toMillis() - a.createdAt?.toMillis();
      })
    : [];

  return (
    <div className="max-h-full w-full overflow-auto">
      {sortedAppointments.length !== 0
        ? sortedAppointments.map((appt) => (
            <STGAppointmentCard key={appt.id} appt={appt} />
          ))
        : "No past appointments with this user"}
    </div>
  );
};

export default STGAppointmentList;
