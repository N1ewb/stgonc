import React, { useRef, useState } from "react";
import { useDB } from "../../../../context/db/DBContext";
import { spcDepartments } from "../../../../lib/global";

const ReferalForm = ({ handleOpenForm }) => {
  const db = useDB();

  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const refereeRef = useRef();
  const departmentRef = useRef();
  const concernRef = useRef();
  const concernTypeRef = useRef()

  const handleSubmit = async () => {};
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full p-5 shadow-md rounded-3xl"
    >
      <div className="form-header flex flex-row justify-between w-full">
        <h5>
          <span className="font-light">Referal</span> Form
        </h5>
        <button className="" onClick={handleOpenForm}>
          X
        </button>
      </div>
      <div className="input-group flex flex-col [&_input]:border-solid [&_input]:border-[1px] [&_input]:border-[#740000] [&_input]:rounded-[4px]">
        <div className="group flex flex-col">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            ref={firstnameRef}
          />
        </div>
        <div className="group flex flex-col">
          <label htmlFor="lastname">Last Name</label>
          <input type="text" id="lastname" name="lastname" ref={lastnameRef} />
        </div>
        <div className="group flex flex-col">
          <label htmlFor="referee">Refered By</label>
          <input type="text" id="referee" name="referee" ref={refereeRef} />
        </div>
        <div className="group flex flex-col">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            className="border-solid border-[1px] border-[#740000] rounded-[4px]"
            ref={departmentRef}
          >
            <option name="placeholder" value=""></option>
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
        </div>
        <div className="group flex flex-col">
            <label htmlFor="concernType">Concern Type</label>
            <select className="border-solid border-[1px] border-[#740000] rounded-[4px]" name="concernType" id="concernType" ref={concernTypeRef}>
                <option value=""></option>
                <option value="Academic">Academic</option>
                <option value="Career">Career</option>
                <option value="Personal">Personal</option>
            </select>
        </div>
        <div className="group flex flex-col">
          <label htmlFor="concern">Student Concern</label>
          <textarea className="border-solid border-[1px] border-[#740000] rounded-[4px] p-2" name="concern" id="concern" placeholder="Type out student concern" ref={concernRef} />
        </div>
        
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ReferalForm;
