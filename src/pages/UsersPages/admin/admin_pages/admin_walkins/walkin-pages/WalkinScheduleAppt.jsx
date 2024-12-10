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
  const appteeTypeRef = useRef();
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
    const appteeType = appteeTypeRef.current.value;

    setIsSubmitting(true);
    console.log(
      `Email: ${email}, Firstname: ${firstName}, Lastname: ${lastName}, Appt Date: ${
        appointmentDate.dateWithoutTime
      }, Appt Time: ${JSON.stringify(
        appointmentTime
      )}, Appt Type: ${appteeType}`
    );
    if (
      email &&
      firstName &&
      lastName &&
      appointmentDate &&
      appointmentTime &&
      appteeType
    ) {
      try {
        await db.walkinScheduleAppointment(
          firstName,
          lastName,
          email,
          appointmentDate.dateWithoutTime,
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
        className="w-full h-full flex flex-col items-center justify-center p-10"
      >
        <div className="flex flex-row w-full h-full gap-4">
          <div className="date-and-time flex flex-col flex-1 justify-around gap-10 max-h-[80vh] overflow-auto">
            <div className="calendar-container w-[80%]">
              <Calendar
                setAppointmentDate={setAppointmentDate}
                instructorSchedule={instructorSchedule}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                calendarRef={calendarRef}
              />
            </div>
          </div>
          <div className="input-forms h-full flex-1 flex flex-col space-y-4">
            <div className="group flex flex-col items-start  w-full">
              <label
                htmlFor="firstname"
                className="text-[10px] font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstname"
                type="text"
                name="firstname"
                ref={firstNameRef}
                className="mt-1 p-1 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#720000] focus:border-[#720000]"
              />
            </div>

            <div className="group flex flex-col items-start w-full">
              <label
                htmlFor="lastname"
                className="text-[10px] font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastname"
                type="text"
                name="lastname"
                ref={lastNameRef}
                className="mt-1 p-1 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#720000] focus:border-[#720000]"
              />
            </div>

            <div className="group flex flex-col items-start w-full">
              <label
                htmlFor="email"
                className="text-[10px] font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                ref={emailRef}
                className="mt-1 p-1 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#720000] focus:border-[#720000]"
              />
            </div>

            <div className="group flex flex-col items-start w-full">
              <label
                htmlFor="role"
                className="text-[10px] font-medium text-gray-700"
              >
                Appointee Type
              </label>
              <select
                ref={appteeTypeRef}
                className="mt-1 p-1 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#720000] focus:border-[#720000]"
              >
                <option value="Student">Student</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>
            <div className="timeslot-container w-full">
              <Timeslot
                setAppointmentTime={setAppointmentTime}
                appointmentDate={appointmentDate}
                instructorTimeslots={instructorTimeslots}
                bookedTimeslots={bookedTimeslots}
                calendarRef={calendarRef}
              />
            </div>
            <button
              type="submit"
              className="bg-[#720000] hover:bg-[#320000] text-white p-2 rounded-md w-full mt-4 focus:outline-none focus:ring-2 focus:ring-[#320000]"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WalkinScheduleAppt;
