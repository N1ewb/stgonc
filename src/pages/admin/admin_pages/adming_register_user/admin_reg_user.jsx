import React, { useState } from "react";

import "./admin_reg_user.css";
import RegisterFacultyForm from "./admin_faculty_reg_form";
import RegisterStudentForm from "./admin_student_reg_form";
import { Container } from "lucide-react";

const AdminRegisteruserPage = () => {
  const [currentForm, setCurrentForm] = useState();

  const handleSetCurrentForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <div className="admin-register-page-container flex flex-row flex-wrap items-center justify-center h-[95%] w-full xl:flex-col text-center">
      <div className="admin-register-page-left-content flex flex-col items-center w-1/2 lg:w-full">
        <h1 className="text-6xl font-semibold text-[#740000]">
          Register User Form
        </h1>
        <div className="register-left-buttons [&_button]:text-[#740000] [&_button]:bg-transparent">
          <button onClick={() => handleSetCurrentForm("Faculty")}>
            Faculty Member
          </button>
          <button onClick={() => handleSetCurrentForm("Student")}>
            CCS Student
          </button>
        </div>
      </div>
      <div className="admin-register-page-right-content w-1/2 lg:w-full">
        {currentForm === "Faculty" ? (
          <RegisterFacultyForm />
        ) : currentForm === "Student" ? (
          <RegisterStudentForm />
        ) : (
          <div className="no-form-container ">
            <p>Choose Who you want to register</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRegisteruserPage;
