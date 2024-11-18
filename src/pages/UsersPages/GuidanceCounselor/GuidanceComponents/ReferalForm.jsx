import React, { useRef, useState } from "react";
import { useDB } from "../../../../context/db/DBContext";
import { spcDepartments } from "../../../../lib/global";
import toast from "react-hot-toast";

const ReferalForm = ({ handleOpenForm }) => {
  const db = useDB();
  const toastMessage = (message) => toast(message);
  const [submitting, setSubmitting] = useState(false);

  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef();
  const yearLevelRef = useRef();
  const ageRef = useRef();
  const refereeRef = useRef();
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

      const firstname = firstnameRef.current.value;
      const lastname = lastnameRef.current.value;
      const email = emailRef.current.value;
      const referee = refereeRef.current.value;
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
      const techniques = techniquesRef.current.value;
      const actionPlan = actionPlanRef.current.value;
      const evaluation = evaluationRef.current.value;

      if (
          firstname &&
          lastname &&
          email &&
          referee &&
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
        await db.makeReferal(
          firstname,
          lastname,
          email,
          referee,
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
        toastMessage("Successfully made referral");
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
        <button
          className="bg-[#720000] hover:bg-[#320000] rounded-md"
          onClick={handleOpenForm}
        >
          X
        </button>
      </div>
      <div className="input-group flex flex-col [&_input]:border-solid [&_input]:border-[1px] [&_input]:border-[#273240] [&_input]:rounded-[4px]">
        <div className="input-group flex gap-2 justify-between w-full">
          <div className="group flex flex-col w-[31%]">
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              ref={firstnameRef}
            />
          </div>
          <div className="group flex flex-col w-[31%]">
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              ref={lastnameRef}
            />
          </div>
          <div className="group flex flex-col w-[31%]">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" ref={emailRef} />
          </div>
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
          <label htmlFor="referee">Refered By</label>
          <input type="text" id="referee" name="referee" ref={refereeRef} />
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

export default ReferalForm;
