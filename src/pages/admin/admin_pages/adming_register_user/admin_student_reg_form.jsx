import React, { useRef, useState } from "react";

import "./admin_student_reg_form.css";
import { AdminCreateStudentAccount } from "../../../../context/auth/adminCreateAccount";
import toast from "react-hot-toast";

const RegisterStudentForm = () => {
  const toastMessage = (message) => toast(message);

  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef();
  const phonenumberRef = useRef();
  const studentidnumberRef = useRef();
  const passwordRef = useRef();
  const confirmpasswordRef = useRef();

  const handleCreateStudentAccount = async () => {
    try {
      await AdminCreateStudentAccount(
        firstnameRef.current.value,
        lastnameRef.current.value,
        emailRef.current.value,
        phonenumberRef.current.value,
        studentidnumberRef.current.value,
        passwordRef.current.value,
        confirmpasswordRef.current.value
      );
    } catch (error) {
      toastMessage(error);
    }
  };

  return (
    <div className="register-form-container">
      <h2>Student Registration Form</h2>
      <div className="student-reg-form">
        <input
          name="firstname"
          placeholder="First Name"
          type="text"
          ref={firstnameRef}
        />
        <input
          name="lastname"
          placeholder="Last Name"
          type="text"
          ref={lastnameRef}
        />
        <input name="email" placeholder="Email" type="email" ref={emailRef} />
        <input
          name="phonenumber"
          placeholder="Phone Number"
          type="tel"
          ref={phonenumberRef}
        />
        <input
          name="studentidnumber"
          placeholder="Student ID Number"
          type="text"
          ref={studentidnumberRef}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          ref={passwordRef}
        />
        <input
          name="confirm-password"
          placeholder="Confirm Password"
          type="password"
          ref={confirmpasswordRef}
        />
        <button onClick={() => handleCreateStudentAccount()}>
          Register Student
        </button>
      </div>
    </div>
  );
};

export default RegisterStudentForm;
