import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "./RequestAppointmentForm.css";
import { useDB } from "../../context/db/DBContext";
import toast from "react-hot-toast";
import Calendar from "../calendar/RequestApptCalendar/RequestApptCalendar";
import TimeslotRadioInput from "../input/TimeslotRadioInput";
import CalendarIcon from "../../static/images/Group 1171275864.png";

const RequestAppointmentForm = ({
  instructor,
  show,
  toggleShow,
  myInfo,
  appointments,
}) => {
  const toastMessage = (message) => toast(message);

  const handleToggleShow = () => {
    toggleShow();
  };

  const db = useDB();
  const [selectedDate, setSelectedDate] = useState(null);
  const [instructorSchedule, setInstructorSchedule] = useState([]);
  const [instructorTimeslots, setInstructorTimeslots] = useState([]);
  const [days, setDays] = useState();
  const concernRef = useRef();
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);
  const [bookedTimeslots, setBookedTimeslots] = useState([]);

  const handleSetAvailableSchedule = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    if (instructorSchedule && appointments) {
      const appointmentDatematch = appointments.filter(
        (appt) => appt.appointmentDate === appointmentDate.dateWithoutTime
      );

      if (appointmentDatematch.length !== 0) {
        const matchingTimeslots = appointments.filter(
          (appointment) =>
            instructorTimeslots.some((timeslot) =>
              appointment.appointmentsTime.appointmentStartTime.includes(
                timeslot.time.startTime.toString()
              )
            ) && appointment.appointmentStatus === "Accepted"
        );

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
    const handleGetDays = async () => {
      try {
        setInstructorSchedule([]);
        if (show) {
          const dayOfWeek = await db.getDays();
          setDays(dayOfWeek);
          handleGetInstructorAvailableDays(dayOfWeek, instructor.email);
        }
      } catch (error) {
        toastMessage("Error in retreiving days: ", error.message);
      }
    };
    handleGetDays();
  }, [show]);

  const handleRequestAppointment = async (
    teacheruid,
    teacherFirstName,
    teacherLastName,
    teacherPhoneno,
    teacheruserID,
    concern,
    date,
    time,
    isOnline,
    phoneno,
    studentIDnumber
  ) => {
    try {
      if (
        concernRef.current.value &&
        appointmentTime &&
        appointmentDate.dateWithoutTime
      ) {
        await db.sendAppointmentRequest(
          teacheruid,
          teacherFirstName,
          teacherLastName,
          teacherPhoneno,
          teacheruserID,
          concern.current.value,
          appointmentDate.dateWithoutTime,
          appointmentTime,
          isOnline,
          phoneno,
          studentIDnumber
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
        <Modal.Body className="bg-[#ECECEC]">
          <div className="application-form h-[100%] w-full flex flex-row justify-around gap-3">
            <div className="data-time-container flex flex-col justify-around w-[45%] gap-5">
              <Calendar
                setAppointmentDate={setAppointmentDate}
                instructorSchedule={instructorSchedule}
                appointments={appointments}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
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
              <div className="timeslot-container w-full flex flex-col items-center text-center bg-white p-4 rounded-[30px] shadow-lg">
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
                      instructor.firstName,
                      instructor.lastName,
                      instructor.phoneNumber,
                      instructor.userID,
                      concernRef,
                      appointmentDate,
                      appointmentTime,
                      true,
                      myInfo.phoneNumber,
                      myInfo && myInfo.studentIdnumber
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
