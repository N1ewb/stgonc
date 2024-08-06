import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "./RequestAppointmentForm.css";

const RequestAppointmentForm = ({ instructor, show, toggleShow }) => {
  const handleToggleShow = () => {
    toggleShow();
  };

  const concernRef = useRef();

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
              // handleRequestAppointment(
              //   instructor.email,
              //   instructor.firstName,
              //   instructor.lastName,
              //   instructor.phoneNumber,
              //   instructor.userID,
              //   2021,
              //   true,
              //   myInfo.phoneNumber,
              //   myInfo && myInfo.studentIdnumber
              // )
              console.log("Appointment set")
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
