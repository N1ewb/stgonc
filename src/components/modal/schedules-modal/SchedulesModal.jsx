import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";

import "./SchedulesModal.css";

const SchedulesModal = ({
  toggleShow,
  show,
  teachersList,
  toastMessage,
  setTd,
}) => {
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const handleSetTableData = () => {
    try {
      const value = JSON.parse(selectedTeacher);
      setTd(value);
      toggleShow();
      toastMessage("Schedule assigned");
    } catch (error) {
      toastMessage(error.message);
    }
  };

  return (
    <div>
      <Modal show={show} onHide={toggleShow}>
        <Modal.Header closeButton>
          <Modal.Title>Set Schedule </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="application-form">
            <form onSubmit={handleSetTableData}>
              <p>Choose the instructor you want to assign to this timeslot</p>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                required
              >
                <option value=""></option>
                {teachersList && teachersList.length !== 0 ? (
                  teachersList.map((teacher, index) => (
                    <option
                      key={index}
                      value={JSON.stringify({
                        firstName: teacher.firstName,
                        lastName: teacher.lastName,
                        userID: teacher.userID,
                        email: teacher.email,
                        phoneNumber: teacher.phoneNumber,
                        instructorColorCode: teacher.instructorColorCode,
                      })}
                    >
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))
                ) : (
                  <option value="">No instructors</option>
                )}
              </select>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => toggleShow()}>
            Close
          </Button>
          <Button
            variant="primary"
            type="submit"
            onClick={() => handleSetTableData()}
          >
            Confrm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SchedulesModal;
