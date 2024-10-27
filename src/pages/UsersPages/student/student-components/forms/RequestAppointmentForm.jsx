import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "./RequestAppointmentForm.css";

import toast from "react-hot-toast";
import CalendarIcon from "../../../../../static/images/Group 1171275864.png";
import Calendar from "../RequestApptCalendar/RequestApptCalendar";
import { useDB } from "../../../../../context/db/DBContext";
import Timeslot from "../timeslots/Timeslot";

const RequestAppointmentForm = ({ instructor, show, toggleShow }) => {
  const toastMessage = (message) => toast(message);

  const handleToggleShow = () => {
    toggleShow();
  };

  const db = useDB();
  const [selectedDate, setSelectedDate] = useState(null);
  const [instructorSchedule, setInstructorSchedule] = useState([]);
  const [instructorTimeslots, setInstructorTimeslots] = useState([]);
  const concernRef = useRef();
  const formatRef = useRef();
  const typeRef = useRef();
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);
  const [bookedTimeslots, setBookedTimeslots] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const calendarRef = useRef(null);

  const handleSetAvailableSchedule = () => {
    if (instructorSchedule && allAppointments) {
      const appointmentDatematch = allAppointments.filter(
        (appt) => appt.appointmentDate === appointmentDate.dateWithoutTime
      );

      if (appointmentDatematch.length !== 0) {
        const matchingTimeslots = appointmentDatematch.filter((appointment) => {
          const { appointmentsTime } = appointment;

          if (appointmentsTime && typeof appointmentsTime === "object") {
            return (
              instructorTimeslots.some((timeslot) =>
                appointmentsTime.appointmentStartTime.includes(
                  timeslot.time.startTime.toString()
                )
              ) &&
              (appointment.appointmentStatus === "Accepted" ||
                appointment.appointmentStatus === "Followup")
            );
          } else {
            console.warn(
              "appointmentsTime is undefined or not an object for appointment:",
              appointment
            );
            return false;
          }
        });

        if (matchingTimeslots.length > 0) {
          const bookedSlots = matchingTimeslots.map((match) => ({
            Day: match.appointmentDate,
            startTime: match.appointmentsTime.appointmentStartTime,
            endTime: match.appointmentsTime.appointmentEndTime,
          }));
          setBookedTimeslots(bookedSlots);
        }
      }
    } else {
      toastMessage("Instructor schedule or timeslots are missing.");
    }
  };

  useEffect(() => {
    if (appointmentDate && instructorTimeslots) {
      handleSetAvailableSchedule();
    }
  }, [appointmentDate, show, instructorTimeslots]);

  const handleGetInstructorTimeSlots = async (day, email) => {
    try {
      const scheduleDay = await db.getScheduleDay(day.dayOfWeek);
      const timeslots = await db.getInstructorTimeslots(scheduleDay[0], email);
      setInstructorTimeslots(timeslots);
    } catch (error) {
      toastMessage("Error in retreiving instrctor timeslots: ", error.message);
    }
  };

  const handleGetInstructorAvailableDays = async (days, email) => {
    try {
      if (days && days.length !== 0) {
        const availableDays = [];

        for (const day of days) {
          const timeslots = await db.getInstructorTimeslots(day, email);

          if (timeslots && timeslots.length !== 0) {
            availableDays.push(day.dayOfWeek);
          }
        }
        setInstructorSchedule(availableDays);
      }
    } catch (error) {
      toastMessage(
        "Error in retreiving instructor available dates: ",
        error.message
      );
    }
  };

  useEffect(() => {
    if (show) {
      const handleGetAppointments = async () => {
        const appointments = await db.getInstructorAppointment(instructor.id);
        const fitleredAppointments = appointments.filter(
          (appt) => appt.appointedFaculty === instructor.id
        );
        console.log("all appointments", appointments);
        setAllAppointments(fitleredAppointments);
      };
      handleGetAppointments();
    }
  }, [show]);

  useEffect(() => {
    const handleGetDays = async () => {
      try {
        setInstructorSchedule([]);
        if (show) {
          const dayOfWeek = await db.getDays();

          handleGetInstructorAvailableDays(dayOfWeek, instructor.email);
        }
      } catch (error) {
        toastMessage("Error in retreiving days: ", error.message);
      }
    };
    handleGetDays();
  }, [show]);

  const handleRequestAppointment = async (
    facultyEmail,
    facultyUID,
    concern,
    format,
    type,
    department
  ) => {
    try {
      if (
        concernRef.current.value &&
        appointmentTime &&
        appointmentDate.dateWithoutTime &&
        formatRef.current.value &&
        typeRef.current.value
      ) {
        await db.sendAppointmentRequest(
          facultyEmail,
          facultyUID,
          concern,
          appointmentDate.dateWithoutTime,
          appointmentTime,
          format,
          type,
          department
        );
        toastMessage("Appointment request sent");
        handleToggleShow();
      } else {
        toastMessage("Please fill in fields");
      }
    } catch (error) {
      toastMessage("Request Appoinment not sent");
    }
  };

  useEffect(() => {
    if (appointmentDate && appointmentDate.dayOfWeek && instructor) {
      handleGetInstructorTimeSlots(appointmentDate, instructor.email);
    }
  }, [appointmentDate, instructor]);

  const handleDisableInput = (timeslot) => {
    return bookedTimeslots.some(
      (booked) =>
        appointmentDate.dateWithoutTime === booked.Day &&
        timeslot.time.startTime.toString() === booked.startTime
    );
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

  useEffect(() => {
    if (!selectedDate) {
      setInstructorTimeslots([]);
    }
  }, [selectedDate]);

  return (
    <>
      <Modal show={show} onHide={toggleShow}>
        <Modal.Header
          closeButton
          className=" m-0 items-center bg-[#ECECEC] border-b-0 "
        >
          <Modal.Title className="text-[#273240] flex flex-row justify-between w-[95%]">
            <div className="icon flex flex-row gap-4 m-0">
              {" "}
              <img src={CalendarIcon} alt="Calenday" height={30} width={40} />
              <span className="font-bold m-0">
                {" "}
                Appointment <span className="font-light">Application Form</span>
              </span>
            </div>
            <h3 className="relative top-4">
              Requesting{" "}
              <span className="font-bold text-[#320000]">
                {instructor && instructor.firstName + " " + instructor.lastName}
              </span>
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-[#ECECEC]" ref={calendarRef}>
          <div className="application-form h-[100%] w-full flex flex-row justify-around gap-3">
            <div className="data-time-container flex flex-col justify-around w-[45%] gap-5">
              <Calendar
                setAppointmentDate={setAppointmentDate}
                instructorSchedule={instructorSchedule}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                calendarRef={calendarRef}
              />
              <div className="form-group w-full flex flex-col bg-[#273240] p-2 rounded-md">
                <label className="text-white" htmlFor="concern">
                  Describe your Concerns
                </label>
                <textarea
                  className="min-h-20 rounded-xl"
                  id="concern"
                  name="concern"
                  type="text-fi"
                  ref={concernRef}
                ></textarea>
              </div>
            </div>
            <div className="form-group-container flex flex-col w-[50%] justify-around">
              <Timeslot
                calendarRef={calendarRef}
                setAppointmentTime={setAppointmentTime}
                appointmentDate={appointmentDate}
                instructorTimeslots={instructorTimeslots}
                bookedTimeslots={bookedTimeslots}
              />
              <div className="group-container flex flex-row justify-around items-center">
                <div className="group">
                  <select name="" id="" className="" ref={formatRef}>
                    <option value="">Select Format</option>
                    <option value="F2F">Face to Face</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div className="group">
                  <select name="" id="" className="" ref={typeRef}>
                    <option value="">Select Type</option>
                    <option value="Academic">Academic</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="image">
                  Picture of Yourself right now this moment
                </label>
                <input className="" id="image" name="image" type="file" />
                <Button variant="secondary" onClick={() => toggleShow()}>
                  Close
                </Button>
                <Button
                  onClick={() =>
                    handleRequestAppointment(
                      instructor.email,
                      instructor.userID,
                      concernRef.current.value,
                      formatRef.current.value,
                      typeRef.current.value,
                      instructor.department
                    )
                  }
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RequestAppointmentForm;
