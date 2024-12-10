import React, { useEffect, useRef } from "react";
import { useReschedDialog } from "../../context/appointmentContext/ReschedContext";
import Calendar from "../../pages/UsersPages/student/student-components/RequestApptCalendar/RequestApptCalendar";
import useScheduleAppointment from "../../hooks/useScheduleAppointment";
import Timeslot from "../../pages/UsersPages/student/student-components/timeslots/Timeslot";
import { useDB } from "../../context/db/DBContext";
import toast from "react-hot-toast";

export default function ReschedAPpointmentDialog({ id, receiver }) {
  const db = useDB();
  const { openReschedDialog, handleToggleReschedDialog, reschedappointment } =
    useReschedDialog();
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
  } = useScheduleAppointment(openReschedDialog);
  const calendarRef = useRef(null);

  const reasonRef = useRef();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reason = reasonRef.current.value;
      if (
        !reschedappointment.id ||
        !reschedappointment.appointee ||
        !reason ||
        !appointmentDate.dateWithoutTime ||
        !appointmentTime
      )
        return toast.error("Please fill in fields");
      const res = await db.reschedAppointment(
        reschedappointment.id,
        reschedappointment.appointee,
        reason,
        appointmentDate.dateWithoutTime,
        appointmentTime
      );
      if (res.status === "success") {
        toast.success("Success: ", res.message);
      } else {
        toast.error("Error: ", res.message);
      }
    } catch (error) {
      toast.error(
        "Error occured in re scheduling appointment, check internet connection"
      );
    } finally {
      handleToggleReschedDialog();
    }
  };

  return (
    <div
      onClick={handleToggleReschedDialog}
      className="h-full w-full bg-[#00000065] absolute top-0 left-0 flex justify-center items-center p-20 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        ref={calendarRef}
        className="dialog w-[80%] h-auto rounded-md bg-white p-10"
      >
        <header>
          <h1 className="text-[#320000] text-xl">
            Re-Schedule Appointment Dialog
          </h1>
        </header>
        <form
          onSubmit={handleSubmit}
          className="flex flex-row h-full w-full overflow-hidden"
        >
          <div className="calendar-and-timeslot flex-1 flex flex-col gap-3 max-h-[95%] overflow-auto pb-2">
            <Calendar
              setAppointmentDate={setAppointmentDate}
              instructorSchedule={instructorSchedule}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              calendarRef={calendarRef}
            />
            <Timeslot
              setAppointmentTime={setAppointmentTime}
              appointmentDate={appointmentDate}
              instructorTimeslots={instructorTimeslots}
              bookedTimeslots={bookedTimeslots}
              calendarRef={calendarRef}
            />
          </div>
          <div className="flex flex-col flex-1 justify-start gap-3">
            <div className="group flex flex-col gap-3 justify-start">
              <label htmlFor="">Reason</label>
              <input type="text" name="reason" ref={reasonRef} />
            </div>
            <button
              type="submit"
              className="bg-[#720000] hover:bg-[#320000] rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
