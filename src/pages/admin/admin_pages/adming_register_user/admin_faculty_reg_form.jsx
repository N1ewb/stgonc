import React, { useRef } from "react";

import "./admin_faculty_reg_form.css";
import { AdminCreateFacultyAccount } from "../../../../context/auth/adminCreateAccount";
import toast from "react-hot-toast";

const RegisterFacultyForm = () => {
  const toastMessage = (message) => toast(message);

  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef();
  const phonenumberRef = useRef();
  const studentidnumberRef = useRef();
  const passwordRef = useRef();
  const confirmpasswordRef = useRef();

  const handleCreateFacultyAccount = async () => {
    try {
      await AdminCreateFacultyAccount(
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
    <div className="register-form-cotnainer">
      <h2>Faculty Registration Form</h2>
      <div className="faculty-reg-form">
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
          placeholder="Faculty ID Number"
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
        <button onClick={() => handleCreateFacultyAccount()}>
          Register Faculty
        </button>
      </div>
    </div>
  );
};

export default RegisterFacultyForm;
