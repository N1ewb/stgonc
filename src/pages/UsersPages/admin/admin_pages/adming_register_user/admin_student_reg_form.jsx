import React, { useRef, useState } from "react";

import "./admin_student_reg_form.css";
import { AdminCreateStudentAccount } from "../../../../../context/auth/adminCreateAccount";
import toast from "react-hot-toast";

const RegisterStudentForm = () => {
  const toastMessage = (message) => toast(message);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef();
  const phonenumberRef = useRef();
  const studentidnumberRef = useRef();
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

  const handleCreateStudentAccount = async () => {
    setIsSubmitting(true);
    try {
      await AdminCreateStudentAccount(
        firstnameRef.current.value,
        lastnameRef.current.value,
        emailRef.current.value,
        phonenumberRef.current.value,
        studentidnumberRef.current.value,
        departmentRef.current.value,
        passwordRef.current.value,
        confirmpasswordRef.current.value
      );
    } catch (error) {
      toastMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="student-register-form-container w-full flex flex-col  items-center">
      <h2 className="text-[#720000]">Student Registration Form</h2>
      <div className="student-reg-form w-[90%] flex flex-col  [&_input]:border-solid [&_input]:border-[1px] [&_input]:border-[#740000] [&_input]:rounded-[4px] flex flex-col gap-[10px]">
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
        <select
          className="border-solid border-[1px] border-[#740000] rounded-[4px]"
          ref={departmentRef}
        >
          <option name="placeholder" value=" ">
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
        <button
          className="bg-[#740000] rounded-[4px]"
          onClick={() => handleCreateStudentAccount()}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Register Student"}
        </button>
      </div>
    </div>
  );
};

export default RegisterStudentForm;
