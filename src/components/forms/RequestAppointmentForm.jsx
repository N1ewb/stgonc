import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "./RequestAppointmentForm.css";
import { useDB } from "../../context/db/DBContext";
import { useAuth } from "../../context/auth/AuthContext";

const RequestAppointmentForm = ({ instructor, show, toggleShow, myInfo }) => {
  const handleToggleShow = () => {
    toggleShow();
  };

  const db = useDB();
  const auth = useAuth();

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
    await db.sendAppointmentRequest(
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
    );
  };

  return (
    <>
      <Modal show={show} onHide={toggleShow}>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Application Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="application-form">
            <label for="concern">Describe your Concerns</label>
            <input id="concern" name="concern" type="text" ref={concernRef} />
            <input id="date" name="date" type="date" ref={appointmentDateRef} />
            <input id="time" name="time" type="time" ref={appointmentTimeRef} />
            <label for="image">Picture of Yourself right now this moment</label>
            <input id="image" name="image" type="file" />
          </form>
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
                concernRef.current.value,
                appointmentDateRef.current.value,
                appointmentTimeRef.current.value,
                true,
                myInfo.phoneNumber,
                myInfo && myInfo.studentIdnumber
              )
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RequestAppointmentForm;
