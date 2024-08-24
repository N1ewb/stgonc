import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "./RequestAppointmentForm.css";
import { useDB } from "../../context/db/DBContext";
import { useAuth } from "../../context/auth/AuthContext";
import toast from "react-hot-toast";

const RequestAppointmentForm = ({
  instructor,
  show,
  toggleShow,
  myInfo,
  index,
}) => {
  const toastMessage = (message) => toast(message);

  const handleToggleShow = () => {
    toggleShow();
  };

  const db = useDB();
  const auth = useAuth();
  const [instructorSchedule, setInstructorSchedule] = useState();
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const concernRef = useRef();
  const appointmentDateRef = useRef();
  const appointmentTimeRef = useRef();

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
      if (concernRef.current.value && appointmentTimeRef.current.value) {
        await db.sendAppointmentRequest(
          teacheruid,
          teacherFirstName,
          teacherLastName,
          teacherPhoneno,
          teacheruserID,
          concern.current.value,
          date.current.value,
          time.current.value,
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
  const handleGetInstructorSchedule = async (email) => {
    try {
      const getSchedule = await db.getInstructorSchedule(email);
      setInstructorSchedule(getSchedule);
      console.log(getSchedule);
    } catch (error) {
      toastMessage(error.message);
    }
  };

  useEffect(() => {
    const fetchInstructorSchedule = async () => {
      if (instructor) {
        try {
          const getSchedule = await db.getInstructorSchedule(instructor.email);
          setInstructorSchedule(getSchedule);
          console.log(instructorSchedule);
        } catch (error) {
          toastMessage(
            "Error in fetching instructor schedules: ",
            error.message
          );
        } finally {
          setLoadingSchedules(false);
        }
      }
    };
    fetchInstructorSchedule();
  }, [db, show]);

  return (
    <>
      <Modal show={show} onHide={toggleShow}>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Application Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="application-form">
            <label htmlFor="concern">Describe your Concerns</label>
            <input id="concern" name="concern" type="text" ref={concernRef} />
            <label>Timeslot</label>
            {!loadingSchedules ? (
              <div>
                {instructorSchedule && instructorSchedule.length !== 0 ? (
                  instructorSchedule.map((schedule, index) => (
                    <p
                      key={index}
                    >{`${schedule.time.startTime}-${schedule.time.endTime}`}</p>
                  ))
                ) : (
                  <option value="">No schedules Available</option>
                )}
              </div>
            ) : (
              <p>Loading Schedules...</p>
            )}

            <input id="time" name="time" type="time" ref={appointmentTimeRef} />
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
            variant="primary"
            onClick={() =>
              handleRequestAppointment(
                instructor.email,
                instructor.firstName,
                instructor.lastName,
                instructor.phoneNumber,
                instructor.userID,
                concernRef,
                appointmentDateRef,
                appointmentTimeRef,
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
