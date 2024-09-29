import React from "react";
import TimeslotRadioInput from "./TimeslotRadioInput";

const Timeslot = ({appointmentDate, instructorTimeslots, bookedTimeslots, setAppointmentTime, calendarRef}) => {
  const handleDisableInput = (timeslot) => {
    return bookedTimeslots.some(
      (booked) =>
        appointmentDate.dateWithoutTime === booked.Day &&
        timeslot.time.startTime.toString() === booked.startTime
    );
  };
  return (
    <div ref={calendarRef} className="timeslot-container w-full flex flex-col items-center text-center bg-white p-4 rounded-[30px] shadow-md">
      <p className="text-lg font-semibold mb-4">Timeslot</p>
      {appointmentDate ? (
        instructorTimeslots.length !== 0 ? (
          instructorTimeslots.map((timeslot) => (
            <div
              key={timeslot.id}
              className="timeslot w-full flex flex-col items-center py-2 border-b last:border-none"
            >
              {!handleDisableInput(timeslot) ? (
                <TimeslotRadioInput
                  timeslot={timeslot}
                  setAppointmentTime={setAppointmentTime}
                />
              ) : (
                <p className="m-0 text-sm text-gray-600">
                  {`${timeslot.time.startTime}:00 - ${timeslot.time.endTime}:00`}{" "}
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md">
                    Booked
                  </span>
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="h-12 w-full flex items-center justify-center bg-yellow-100 text-yellow-800 p-4 rounded-md">
            Instructor not available on this day
          </div>
        )
      ) : (
        <div className="h-12 w-full"></div>
      )}
    </div>
  );
};

export default Timeslot;
