import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "./RequestAppointmentForm.css";
import { useDB } from "../../context/db/DBContext";
import { useAuth } from "../../context/auth/AuthContext";
import toast from "react-hot-toast";
import Calendar from "../calendar/Calendar";
import TimeslotRadioInput from "../input/TimeslotRadioInput";

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
      console.log("Instructor schedule or timeslots are missing.");
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
        console.log(availableDays);
      }
      console.log("Instructor Available Days: ", instructorSchedule);
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
        <Modal.Header closeButton>
          <Modal.Title>Appointment Application Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="application-form h-[100%]">
            <h3>
              Requesting{" "}
              {instructor && instructor.firstName + " " + instructor.lastName}
            </h3>
            <label htmlFor="concern">Describe your Concerns</label>
            <input id="concern" name="concern" type="text" ref={concernRef} />
            <Calendar
              setAppointmentDate={setAppointmentDate}
              instructorSchedule={instructorSchedule}
              appointments={appointments}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            <div className="timeslot-container flex w-full justify-center items-center text-center">
              <p>Timeslot</p>
              {appointmentDate ? (
                instructorTimeslots.length !== 0 ? (
                  instructorTimeslots.map((timeslot) => (
                    <div
                      key={timeslot.id}
                      className="timeslot flex flex-col justify-around "
                    >
                      {!handleDisableInput(timeslot) ? (
                        <TimeslotRadioInput
                          timeslot={timeslot}
                          setAppointmentTime={setAppointmentTime}
                        />
                      ) : (
                        <p className="m-0">
                          {`${timeslot.time.startTime}:00  - ${timeslot.time.endTime}:00`}{" "}
                          <span className="bg-red text-red">Booked</span>
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="h-[50px] w-[50%] bg-[red] p-5 rounded-lg m-0">
                    Instructor not available on this day
                  </div>
                )
              ) : (
                <div className="div"></div>
              )}
            </div>

            <label htmlFor="image">
              Picture of Yourself right now this moment
            </label>
            <input id="image" name="image" type="file" />
          </div>
        </Modal.Body>
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RequestAppointmentForm;
