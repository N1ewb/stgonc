import React from "react";

const STGAdditionalInfo = ({ appt }) => {
  return (
    <div className="w-full">
      <p><span>Student Concern: </span>{appt.appointmentConcern}</p>
      <p><span>Recommendation: </span>{appt.teacherRemarks}</p>
      <p><span>Concern Type: </span>{appt.appointmentType}</p>
      <p><span>Appointment Mode: </span>{appt.appointmentFormat} </p>
      <p><span>Duration: </span>{appt.appointmentDuration} Hr/s</p>
      <p><span>Time: </span>{`${appt.appointmentsTime.appointmentStartTime}:00-${appt.appointmentsTime.appointmentEndTime}:00`}</p>
    </div>
  );
};

export default STGAdditionalInfo;
