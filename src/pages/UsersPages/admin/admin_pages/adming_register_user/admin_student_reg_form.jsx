import React, { useRef, useState } from "react";
import { spcDepartments } from "../../../../../lib/global";
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

  const handleCreateStudentAccount = async () => {
    setIsSubmitting(true);

    try {
      const fields = {
        firstname: firstnameRef.current.value,
        lastname: lastnameRef.current.value,
        email: emailRef.current.value,
        phonenumber: phonenumberRef.current.value,
        studentidnumber: studentidnumberRef.current.value,
        department: departmentRef.current.value,
        password: passwordRef.current.value,
        confirmpassword: confirmpasswordRef.current.value,
      };

      for (const [key, value] of Object.entries(fields)) {
        if (!value || value.trim() === "") {
          toastMessage(`Please fill in the ${key}!`);
          setIsSubmitting(false);
          return;
        }
      }

      if (fields.password !== fields.confirmpassword) {
        toastMessage("Passwords do not match!");
        setIsSubmitting(false);
        return;
      }

      await AdminCreateStudentAccount(
        fields.firstname,
        fields.lastname,
        fields.email,
        fields.phonenumber,
        fields.studentidnumber,
        fields.department,
        fields.password,
        fields.confirmpassword
      );
    } catch (error) {
      toastMessage(error.message || "An error occurred!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="student-register-form-container w-full flex flex-col  items-center">
      <h2 className="text-[#720000]">Student Registration Form</h2>
      <div className="student-reg-form w-[90%] [&_input]:border-solid [&_input]:border-[1px] [&_input]:border-[#740000] [&_input]:rounded-[4px] flex flex-col gap-[10px]">
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
