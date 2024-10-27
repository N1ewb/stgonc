import React, { useRef, useState } from "react";
import Calendar from "../../../../student/student-components/RequestApptCalendar/RequestApptCalendar";
import { useDB } from "../../../../../../context/db/DBContext";

import useScheduleAppointment from "../../../../../../hooks/useScheduleAppointment";
import Timeslot from "../../../../student/student-components/timeslots/Timeslot";
import toast from "react-hot-toast";

const WalkinScheduleAppt = () => {
  const db = useDB();
  const toastMessage = (message) => toast(message);
  const calendarRef = useRef(null);
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const appteeTypeRef = useRef()
  const isFormOpen = true;
  const {
    selectedDate,
    setSelectedDate,
    instructorSchedule,
    instructorTimeslots,
    appointmentDate,
    setAppointmentDate,
    appointmentTime,
    setAppointmentTime,
    bookedTimeslots,
  } = useScheduleAppointment(isFormOpen);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const email = emailRef.current.value;
    const appteeType = appteeTypeRef.current.value

    setIsSubmitting(true);
    console.log(`Email: ${email}, Firstname: ${firstName}, Lastname: ${lastName}, Appt Date: ${appointmentDate.dayOfWeek}, Appt Time: ${JSON.stringify(appointmentTime)}, Appt Type: ${appteeType}`)
    if (email && firstName && lastName && appointmentDate && appointmentTime && appteeType) {
      try {
        await db.walkinScheduleAppointment(
          firstName,
          lastName,
          email,
          appointmentDate.dayOfWeek,
          appointmentTime,
          appteeType
        );
      } catch (error) {
        setError(true);
      } finally {
        if (error) {
          toastMessage("Error Occured");
          console.log("Error has occured");
        } else {
          setIsSubmitting(false);
          setError(false);
          toastMessage("Successfuly Scheduled Walkin type Appointment");
        }
      }
    } else {
      setIsSubmitting(false);
      toastMessage("Please Fill in all fields");
    }
  };

  return (
    <div
      className="walkin-schedule-appoitnment-container w-full flex flex-col items-center"
      ref={calendarRef}
    >
      <div className="walkin-sched-header w-full"></div>

      <form
        onSubmit={handleSubmit}
        className="w-full h-[100%] flex flex-col items-center justify-center p-10"
      >
        <div className="flex flex-row w-full">
          <div className="input-forms w-1/2 flex flex-col [&_input]:w-[80%]">
            <div className="group flex flex-col items-center w-full ">
              <label htmlFor="firstname">First Name</label>
              <input
                id="firstname"
                type="text"
                name="firstname"
                ref={firstNameRef}
              />
            </div>
            <div className="group flex flex-col items-center w-full">
              <label htmlFor="lastname">Last Name</label>
              <input
                id="lastname"
                type="text"
                name="lastname"
                ref={lastNameRef}
              />
            </div>
            <div className="group flex flex-col items-center w-full">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" ref={emailRef} />
            </div>
            <div className="group flex flex-col items-center w-full">
              <label htmlFor="role">Appointee Type</label>
              <select ref={appteeTypeRef}>
                <option value='Student'>Student</option>
                <option value='Guardian'>Guardian</option>
              </select>
            </div>
          </div>
          <div className="date-and-time flex flex-col w-1/2 justify-around gap-10">
            <div className="calendar-container w-[80%]">
              <Calendar
                setAppointmentDate={setAppointmentDate}
                instructorSchedule={instructorSchedule}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                calendarRef={calendarRef}
              />
            </div>
            <div className="timeslot-container w-[80%]">
              <Timeslot
                setAppointmentTime={setAppointmentTime}
                appointmentDate={appointmentDate}
                instructorTimeslots={instructorTimeslots}
                bookedTimeslots={bookedTimeslots}
                calendarRef={calendarRef}
              />
            </div>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default WalkinScheduleAppt;
