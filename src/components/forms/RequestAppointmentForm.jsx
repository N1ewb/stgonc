import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "./RequestAppointmentForm.css";
import { useDB } from "../../context/db/DBContext";
import { useAuth } from "../../context/auth/AuthContext";
import toast from "react-hot-toast";

const RequestAppointmentForm = ({ instructor, show, toggleShow, myInfo }) => {
  const toastMessage = (message) => toast(message);

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
    try {
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
      handleToggleShow();
      toastMessage("Appointment request sent");
    } catch (error) {
      toastMessage("Request Appoinment not sent");
    }
  };

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
            <input id="date" name="date" type="date" ref={appointmentDateRef} />
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
                concernRef.current.value,
                appointmentDateRef.current.value,
                appointmentTimeRef.current.value,
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
