import React, { useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";

import "./admin_faculty_reg_form.css";
import { AdminCreateFacultyAccount } from "../../../../context/auth/adminCreateAccount";
import toast from "react-hot-toast";

const RegisterFacultyForm = () => {
  const toastMessage = (message) => toast(message);
  const [instructorColorCode, setInstructorColorCode] = useState();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorPickerRef = useRef(null);

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
    setIsSubmitting(true);
    try {
      if (!instructorColorCode) {
        toastMessage("Set your instructor Color Code!!!");
      }
      await AdminCreateFacultyAccount(
        firstnameRef.current.value,
        lastnameRef.current.value,
        emailRef.current.value,
        phonenumberRef.current.value,
        facultyIdnumberRef.current.value,
        departmentRef.current.value,
        passwordRef.current.value,
        confirmpasswordRef.current.value,
        instructorColorCode
      );
    } catch (error) {
      toastMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setIsColorPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="faculty-register-form-container w-full flex flex-col  items-center">
      <h2 className="text-[#720000]">Faculty Registration Form</h2>
      <div className="faculty-reg-form w-[90%] flex flex-col  [&_input]:border-solid [&_input]:border-[1px] [&_input]:border-[#740000] [&_input]:rounded-[4px] flex flex-col gap-[10px]">
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
        <select
          className="border-solid border-[1px] border-[#740000] rounded-[4px]"
          ref={departmentRef}
        >
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
        <div
          onClick={() => setIsColorPickerOpen(true)}
          className="color-picker-container relative w-full"
        >
          {isColorPickerOpen ? (
            <div
              className="color-picker-ref absolute top-0 w-fit"
              ref={colorPickerRef}
            >
              <ChromePicker
                color={instructorColorCode}
                onChangeComplete={(newColor) =>
                  setInstructorColorCode(newColor.hex)
                }
              />
            </div>
          ) : (
            <input
              className={`w-full text-${
                instructorColorCode ? instructorColorCode : "black"
              }`}
              style={{
                "::placeholder": {
                  color: instructorColorCode ? instructorColorCode : "gray",
                },
              }}
              name="Color"
              type="text"
              placeholder={
                instructorColorCode
                  ? `Instructor Color code is: ${instructorColorCode}`
                  : `Select Instructor Color Code`
              }
            />
          )}
        </div>
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
          onClick={() => handleCreateFacultyAccount()}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Register Faculty"}
        </button>
      </div>
    </div>
  );
};

export default RegisterFacultyForm;
