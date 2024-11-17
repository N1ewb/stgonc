import React, { useEffect, useRef, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import { spcDepartments } from "../../../../../lib/global";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const FollowupRecordForm = () => {
  const db = useDB();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const appointment = queryParams.get("appointment");
  const [apptInfo, setApptInfo] = useState(null)
  const toastMessage = (message) => toast(message);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if(appointment){
      const fetchData = async () => {
        const appt = await db.getAppointment(appointment)
        setApptInfo(appt)
      }
      fetchData()
    }
  },[appointment])

  const yearLevelRef = useRef();
  const ageRef = useRef();

  const sessionNumberRef = useRef();
  const locationRef = useRef();

  const concernTypeRef = useRef();
  const observationRef = useRef();
  const nonVerbalCuesRef = useRef();
  const summaryRef = useRef();
  const techniquesRef = useRef();
  const actionPlanRef = useRef();
  const evaluationRef = useRef();

  const dateRef = useRef();

  const departmentRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setSubmitting(true);
  
      const department = departmentRef.current.value;
      const concernType = concernTypeRef.current.value;
      const date = dateRef.current.value;
  
      const yearLevel = yearLevelRef.current.value;
      const age = ageRef.current.value;
      const sessionNumber = sessionNumberRef.current.value;
      const location = locationRef.current.value;
  
      const observation = observationRef.current.value;
      const nonVerbalCues = nonVerbalCuesRef.current.value;
      const summary = summaryRef.current.value;
      const techniques = techniquesRef.current.value || '';  
      const actionPlan = actionPlanRef.current.value;
      const evaluation = evaluationRef.current.value;
  
      if (
        appointment &&
        department &&
        concernType &&
        date &&
        yearLevel &&
        age &&
        sessionNumber &&
        location &&
        observation &&
        nonVerbalCues &&
        summary &&
        techniques &&
        actionPlan &&
        evaluation
      ) {
        await db.guidanceFollowupRecord(
          appointment,
          apptInfo.appointee.firstName,
          apptInfo.appointee.lastName,
          apptInfo.appointee.email,
          apptInfo.appointmentFormat,
          department,
          concernType,
          date,
          yearLevel,
          age,
          sessionNumber,
          location,
          observation,
          nonVerbalCues,
          summary,
          techniques,
          actionPlan,
          evaluation
        );
        toastMessage("Successfully made followup record");
      } else {
        toastMessage("Please fill in forms");
      }
    } catch (error) {
      toastMessage(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-h-[98%] overflow-auto p-4 shadow-md rounded-3xl"
    >
      <div className="form-header flex flex-row justify-between w-full">
        <h5>
          <span className="font-light">Referal</span> Form
        </h5>

      </div>
      <div className="input-group flex flex-col [&_input]:border-solid [&_input]:border-[1px] [&_input]:border-[#273240] [&_input]:rounded-[4px]">
        <div className="client-info flex gap-3 [&_p]:m-0 [&_h6]:m-0 items-center w-full capitalize">
          <h6>Client Information:</h6>
          <p>{apptInfo?.appointee.firstName} {apptInfo?.appointee.lastName}</p>
          <p className="normal-case">{apptInfo?.appointee.email}</p>
        </div>

        <div className="input-group flex justify-between w-full">
          <div className="group flex flex-col w-[48%]">
            <label htmlFor="year-level">Year Level</label>
            <input
              type="text"
              name="year-level"
              id="year-level"
              ref={yearLevelRef}
            />
          </div>
          <div className="group flex flex-col w-[48%]">
            <label htmlFor="age">Age</label>
            <input type="text" name="age" id="age" ref={ageRef} />
          </div>
        </div>

        <div className="input-group flex w-full gap-3 justify-between">
          <div className="group flex flex-col w-[48%]">
            <label htmlFor="session-number">Session Number</label>
            <input
              type="text"
              name="session-number"
              id="session-number"
              ref={sessionNumberRef}
            />
          </div>

          <div className="group flex flex-col w-[48%]">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              name="location"
              id="location"
              ref={locationRef}
            />
          </div>
        </div>

        <div className="group flex flex-col">
          <label htmlFor="concernType">Reason for Counseling</label>
          <select
            className="border-solid border-[1px] border-[#273240] rounded-[4px]"
            name="concernType"
            id="concernType"
            ref={concernTypeRef}
          >
            <option value=""></option>
            <option value="Academic">Academic</option>
            <option value="Career">Career</option>
            <option value="Personal">Personal</option>
            <option value="Behavioral">Behavioral</option>
          </select>
        </div>

        {/* sheesh */}
        <div className="group flex flex-col">
          <label htmlFor="observation">Observation</label>
          <textarea
            type="text"
            name="observation"
            id="observation"
            ref={observationRef}
            className="border-solid border-[1px] border-[#273240] rounded-[4px] p-1"
          />
        </div>
        <div className="group flex flex-col">
          <label htmlFor="cues">Non Verbal Cues</label>
          <textarea
            type="text"
            name="cues"
            id="cues"
            ref={nonVerbalCuesRef}
            className="border-solid border-[1px] border-[#273240] rounded-[4px] p-1"
          />
        </div>
        <div className="group flex flex-col">
          <label htmlFor="summary">Discussion Summary</label>
          <textarea
            type="text"
            name="summary"
            id="summary"
            ref={summaryRef}
            className="border-solid border-[1px] border-[#273240] rounded-[4px] p-1"
          />
        </div>
        <div className="group flex flex-col">
          <label htmlFor="techniques">Techniques/ Approaches Used</label>
          <textarea
            type="text"
            name="techniques"
            id="techniques"
            ref={techniquesRef}
            className="border-solid border-[1px] border-[#273240] rounded-[4px] p-1"
          />
        </div>
        <div className="group flex flex-col">
          <label htmlFor="action-plan">Action Plan/ Next Steps</label>
          <textarea
            type="text"
            name="action-plan"
            id="action-plan"
            ref={actionPlanRef}
            className="border-solid border-[1px] border-[#273240] rounded-[4px] p-1"
          />
        </div>
        <div className="group flex flex-col">
          <label htmlFor="evaluation">Counselor's Evaluation</label>
          <textarea
            type="text"
            name="evaluation"
            id="evaluation"
            ref={evaluationRef}
            className="border-solid border-[1px] border-[#273240] rounded-[4px] p-1"
          />
        </div>

        {/* sheesh */}

        <div className="group flex flex-col">
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" ref={dateRef} />
        </div>
        <div className="group flex flex-col">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            className="border-solid border-[1px] border-[#273240] rounded-[4px]"
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
      </div>
      <button
        type="submit"
        className={`bg-[#720000] hover:bg-[#320000] rounded-md ${
          submitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default FollowupRecordForm;
