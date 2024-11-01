import React from "react";
import AppointmentCard from "./STGAppointmentCard";

const AppointmentList = ({ pastAppointments }) => {
  return (
    <div>
      {pastAppointments.length !== 0
        ? pastAppointments.map((appt) => <AppointmentCard key={appt.id} appt={appt} />)
        : "No past appointments with this user"}
    </div>
  );
};

export default AppointmentList;
