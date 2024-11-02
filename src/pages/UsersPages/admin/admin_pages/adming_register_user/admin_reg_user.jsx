import React, { useState } from "react";

import RegisterFacultyForm from "./admin_faculty_reg_form";
import RegisterStudentForm from "./admin_student_reg_form";

import StudentIcon from '../../../../../static/images/studentIcon.png'
import InstructorIcon from '../../../../../static/images/instructorIcon.png'

const AdminRegisteruserPage = () => {
  const [currentForm, setCurrentForm] = useState(null);

  const handleSetCurrentForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <div className="admin-register-page-container flex flex-row flex-wrap items-center justify-center h-[95%] w-full xl:flex-col text-center">
      <div className="admin-register-page-left-content flex flex-col items-center w-1/2 lg:w-full">
        <h1 className="text-6xl font-semibold text-[#740000]">
          Register User Form
        </h1>
        <div className="register-left-buttons flex gap-3  [&_button]:bg-[#320000] [&_button]:rounded-3xl [&_button]:flex [&_button]:items-center [&_button]:relative [&_span]:py-1 [&_span]:px-3">
          <button className={`hover:bg-[#720000] ${currentForm === "Faculty"? "[&_span]:text-[#320000] [&_span]:bg-white [&_span]:rounded-r-3xl " : "text-white"}`} onClick={() => handleSetCurrentForm("Faculty")}>
            <div className={`bg-white px-3 py-1 rounded-3xl outline outline-2 outline-[#320000] relative z-10`}><img  src={InstructorIcon} alt="instructor" height={30} width={30} /></div> <span className="relative right-2 z-0">Faculty</span>
          </button>
          <button className={`hover:bg-[#720000] ${currentForm === "Student"? "[&_span]:text-[#320000] [&_span]:bg-white [&_span]:rounded-r-3xl" : "text-white"}`} onClick={() => handleSetCurrentForm("Student")}>
           <div className={`bg-white px-3 py-1 rounded-3xl outline outline-2 outline-[#320000] relative z-10`}> <img src={StudentIcon} alt="student" height={30} width={30} /></div> <span className="relative right-2 z-0">Student</span> 
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
