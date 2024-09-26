import React from "react";
import ConsultationReport from "../../components/forms/ConsultationReport";

const FacultyEndCallPage = () => {
  
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center ">
      <div className="f-end-page-header w-full"></div>
      <div className="f-end-page-content w-full flex items-center justify-center">
        <ConsultationReport />
      </div>
    </div>
  );
};

export default FacultyEndCallPage;
