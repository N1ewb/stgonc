import React, { useRef, useState } from "react";
import { spcDepartments } from "../../../../lib/global";
import { useDB } from "../../../../context/db/DBContext";
import toast from "react-hot-toast";

const WalkinForm = ({ handleOpenWalkinForm }) => {
  const db = useDB()
  const toastMessage = (message) => toast(message)
  const [submitting, setSubmitting] = useState(false)

  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef();
  const dateRef = useRef()
  const concernRef = useRef()
  const concernTypeRef = useRef()
  const departmentRef = useRef()
  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      setSubmitting(true)
      const firstname = firstnameRef.current.value
      const lastname = lastnameRef.current.value
      const email = emailRef.current.value
      const date = dateRef.current.value
      const concern = concernRef.current.value
      const concernType = concernTypeRef.current.value
      const department = departmentRef.current.value
      if(firstname && lastname && email && date && concern && concernType && department){
        await db.makeWalkin(firstname, lastname,email, date, concern, concernType, department)
        toastMessage("Successfuly submitted Walkin data")
      }
    }catch(error){
      toastMessage(`Error in submitting walkin data: ${error.message}`)
    }finally{
      setSubmitting(false)
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col w-full max-h-[90%] overflow-auto p-5 shadow-md rounded-3xl"'
    >
      <div className="form-header flex flex-row justify-between w-full">
        <h5>Walk-in Form</h5>
        <button onClick={handleOpenWalkinForm}>X</button>
      </div>

      <div className="input-group input-group flex flex-col [&_input]:border-solid [&_input]:border-[1px] [&_input]:border-[#740000] [&_input]:rounded-[4px]">
        <div className="group flex flex-col">
          <label htmlFor="firstname">First Name</label>
          <input type="text" id="firstname" ref={firstnameRef} />
        </div>
        <div className="group flex flex-col">
          <label htmlFor="lastname">Last Name</label>
          <input type="text" id="lastname" ref={lastnameRef} />
        </div>
        <div className="group flex flex-col">
          <label htmlFor="email">Email</label>
          <input type="text" id="email" ref={emailRef} />
        </div>
        <div className="group flex flex-col">
          <label htmlFor="date">Date</label>
          <input type="date" id="date" ref={dateRef} />
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

export default WalkinForm;
