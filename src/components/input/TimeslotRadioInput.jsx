import React from "react";

const TimeslotRadioInput = ({ timeslot, setAppointmentTime }) => {
  return (
    <div>
      <input
        className={``}
        type="radio"
        name="timeslot"
        id={`timeslot-${timeslot.id}`}
        data-start-time={timeslot.time.startTime}
        data-end-time={timeslot.time.endTime}
        onClick={(e) => {
          setAppointmentTime({
            appointmentStartTime: e.target.dataset.startTime,
            appointmentEndTime: e.target.dataset.endTime,
          });
        }}
        value={timeslot.id}
      />
      <label htmlFor={`timeslot-${timeslot.id}`}>
        {`${timeslot.time.startTime}:00  - ${timeslot.time.endTime}:00`}
      </label>
    </div>
  );
};

export default TimeslotRadioInput;
