import React, { useEffect, useRef, useState } from "react";
import { useDB } from "../../context/db/DBContext";
import toast from "react-hot-toast";
import Calendar from "../../pages/UsersPages/student/student-components/RequestApptCalendar/RequestApptCalendar";
import Timeslot from "../../pages/UsersPages/student/student-components/timeslots/Timeslot";
import useScheduleAppointment from "../../hooks/useScheduleAppointment";

const FollowupAppointment = ({
  isFollowupFormOpen,
  setIsFollowupFormOpen,
  submitForm,
  appointment,
  receiver,
}) => {
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
  } = useScheduleAppointment(isFollowupFormOpen);
  const db = useDB();
  const toastMessage = (message) => toast(message);
  const [apptFormat, setApptFormat] = useState(null);
  const [location, setLocation] = useState(null);
  const calendarRef = useRef(null);

  //id, receiver, date, format, appointmentsTime
  //Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        (appointment &&
        receiver &&
        apptFormat &&
        appointmentDate &&
        appointmentTime &&
        location)
      ) {
        await db.followupAppointment(
          appointment,
          receiver,
          apptFormat,
          appointmentDate.dateWithoutTime,
          appointmentTime,
          location
        );
        await submitForm();
      } else {
        toastMessage("Please fill in fields in both forms");
      }
    } catch (error) {
      toastMessage(error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setSelectedDate(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelectedDate]);

  return (
    <div
      className="w-full bg-white p-10 shadow-lg rounded-3xl flex flex-col gap-5"
      ref={calendarRef}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-[#320000] font-bold">
          Follow-up <span className="font-light"> Appointment</span>
        </h1>
        <button
          className="p-0 bg-transparent hover:bg-transparent text-[#720000]"
          onClick={() => setIsFollowupFormOpen(false)}
        >
          X
        </button>
      </div>
      <div className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <div className="schedule-container flex flex-row justify-between">
            <div className="calendar-container w-[48%]">
              <Calendar
                setAppointmentDate={setAppointmentDate}
                instructorSchedule={instructorSchedule}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                calendarRef={calendarRef}
              />
            </div>
            <div className="timeslot-container w-[48%] flex flex-col items-center gap-5">
              <Timeslot
                setAppointmentTime={setAppointmentTime}
                appointmentDate={appointmentDate}
                instructorTimeslots={instructorTimeslots}
                bookedTimeslots={bookedTimeslots}
                calendarRef={calendarRef}
              />
              <div className="row flex flex-col w-full p-5 text-center items-center gap-3 rounded-3xl shadow-md bg-white">
                <p className="font-semibold">Appointment Format</p>
                <div className="radio-group flex flex-row w-full justify-center gap-5">
                  <div className="group flex flex-row gap-2 items-center">
                    <label htmlFor="online">Online</label>

                    <input
                      value={`Online`}
                      type="radio"
                      id="online"
                      className="form-input"
                      name="format"
                      onChange={(e) => setApptFormat(e.target.value)}
                    />
                  </div>
                  <div className="group flex flex-row gap-2 items-center">
                    <label htmlFor="f2f">F2F</label>

                    <input
                      value={`Face to Face`}
                      type="radio"
                      id="f2f"
                      className="form-input"
                      name="format"
                      onChange={(e) => setApptFormat(e.target.value)}
                    />
                  </div>
                </div>
                {apptFormat && apptFormat !== "Online" && (
                  <div className="group">
                    <label htmlFor="location">Appointment Location</label>
                    <input
                      list="locations"
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <datalist id="locations">
                      <option value="CCS Faculty Office">
                        CCS Faculty Office
                      </option>
                    </datalist>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            className="bg-[#320000] hover:bg-[#720000] rounded-lg"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FollowupAppointment;
