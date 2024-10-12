import React, { useRef, useState } from "react";
import { useDB } from "../../../../context/db/DBContext";
import { spcDepartments } from "../../../../lib/global";
import toast from "react-hot-toast";
import { MessagingProvider } from "../../../../context/notification/NotificationContext";

const ReferalForm = ({ handleOpenForm }) => {
  const db = useDB();
  const toastMessage = (message) => toast(MessagingProvider)
  const [submitting, setSubmitting] = useState(false);
  
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef()
  const refereeRef = useRef();
  const departmentRef = useRef();
  const concernRef = useRef();
  const concernTypeRef = useRef();
  const dateRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const firstname = firstnameRef.current.value
      const lastname = lastnameRef.current.value
      const email = emailRef.current.value
      const referee = refereeRef.current.value
      const department = departmentRef.current.value
      const concern = concernRef.current.value
      const concernType = concernTypeRef.current.value
      const date = dateRef.current.value
      if(firstname && lastname && email && referee && department && concern && concernType){
        await db.makeReferal(firstname, lastname, email, referee, department, concern, concernType, date)
        toastMessage("Successfuly made referal")
      }else {
        toastMessage("Please fill in forms")
      }
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-h-[80%] overflow-auto p-5 shadow-md rounded-3xl"
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
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" ref={emailRef} />
        </div>
        <div className="group flex flex-col">
          <label htmlFor="referee">Refered By</label>
          <input type="text" id="referee" name="referee" ref={refereeRef} />
        </div>
        <div className="group flex flex-col">
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" ref={dateRef} />
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
          <select
            className="border-solid border-[1px] border-[#740000] rounded-[4px]"
            name="concernType"
            id="concernType"
            ref={concernTypeRef}
          >
            <option value=""></option>
            <option value="Academic">Academic</option>
            <option value="Career">Career</option>
            <option value="Personal">Personal</option>
          </select>
        </div>
        <div className="group flex flex-col">
          <label htmlFor="concern">Student Concern</label>
          <textarea
            className="border-solid border-[1px] border-[#740000] rounded-[4px] p-2"
            name="concern"
            id="concern"
            placeholder="Type out student concern"
            ref={concernRef}
          />
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ReferalForm;
