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
  const facultyIdnumberRef = useRef();
  const departmentRef = useRef();
  const passwordRef = useRef();
  const confirmpasswordRef = useRef();

  const spcDepartments = [
    "College of Computer Studies",
    "College of Criminology",
    "College of Education",
    "College of Business Administration",
    "College of Engineering",
    "College of Arts and Sciences",
  ];

  const handleCreateFacultyAccount = async () => {
    try {
      await AdminCreateFacultyAccount(
        firstnameRef.current.value,
        lastnameRef.current.value,
        emailRef.current.value,
        phonenumberRef.current.value,
        facultyIdnumberRef.current.value,
        departmentRef.current.value,
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
          name="facultyIdnumber"
          placeholder="Faculty ID Number"
          type="text"
          ref={facultyIdnumberRef}
        />
        <select ref={departmentRef}>
          <option name="placeholder" value="">
            Department
          </option>
          {spcDepartments && spcDepartments.length !== 0 ? (
            spcDepartments.map((department, index) => (
              <option value={department} key={index}>
                {department}
              </option>
            ))
          ) : (
            <option value="">No Department</option>
          )}
        </select>
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
