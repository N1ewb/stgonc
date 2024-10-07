import React, { useState } from "react";
import SchedulesTable from "../GuidanceComponents/SchedulesTable";

const GuidanceSchedules = () => {
  return (
    <div className="w-full h-[100%] flex flex-col">
      <div className="header w-full justify-start">
        <h1 className="w-full">
          <span className="font-light">Your</span> Schedule
        </h1>
      </div>
      <p className="text-[#aeaeae]">
        PS: Paqocktuah Mandates 6 hours of Consultation per week
      </p>
      <div className="content">
        <SchedulesTable />
      </div>
    </div>
  );
};

export default GuidanceSchedules;
