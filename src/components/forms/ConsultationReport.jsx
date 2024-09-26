import React, { useEffect, useRef, useState } from "react";
import { useDB } from "../../context/db/DBContext";
import { useAuth } from "../../context/auth/AuthContext";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const ConsultationReport = () => {
  const db = useDB();
  const auth = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const receiver = queryParams.get("receiver");
  const toastMessage = (message) => toast(message)
  const [submitting, setSubmitting] = useState(false);
  const remarksRef = useRef();
  const dateRef = useRef();
  const durationRef = useRef();
  const modeRef = useRef();
  const radioRef = useRef();
  const agendaRef = useRef();
  const summaryRef = useRef();

  const submitForm = async (e) => {
    e.preventDefault()
    setSubmitting(true);
    const remarks = remarksRef.current.value;
    const date = dateRef.current.value;
    const duration = durationRef.current.value;
    const mode = modeRef.current.value;
    const radio = radioRef.current.value;
    const agenda = agendaRef.current.value;
    const summary = summaryRef.current.value;
    if ((remarks, date, duration, mode, radio, agenda, summary)) {
      try {
        if (auth.currentUser) {
          await db.makeReport(
            remarks,
            date,
            duration,
            mode,
            radio,
            agenda,
            summary,
            receiver
          );
          toastMessage("Report made successfuly!")
        }
      } catch (error) {
        console.error("Error in:", error);
      } finally {
        setSubmitting(false);
      }
    } else {
      console.log("failed");
    }
  };
  return (
    <form
      onSubmit={submitForm}
      className="w-1/2 p-10 rounded-3xl shadow-lg flex-col flex gap-4 items-center [&_div]:w-full mt-10"
    >
      <h1 className="text-[#720000] ">Consultation Report</h1>
      <div className="group-details flex flex-col gap-4">
        <div className="detils-group flex flex-col">
          <label htmlFor="date">Date</label>
          <input ref={dateRef} type="date" id="date" />
        </div>
        <div className="detail-group flex flex-col">
          <label htmlFor="duration">Duration (In hours)</label>
          <input type="number" id="duration" ref={durationRef} />
        </div>
        <p>Mode of Consultation</p>
        <div className="detail-group flex flex-row gap-5">
          <div className="detail-group-radio flex flex-row gap-2">
            <label htmlFor="f2f">Face to Face</label>
            <input
              type="radio"
              name="mode"
              id="f2f"
              value="Face to Face"
              ref={modeRef}
            />
          </div>
          <div className="detail-group-radio detail-group-radio flex flex-row gap-2">
            <label htmlFor="online">Online</label>
            <input
              type="radio"
              id="online"
              name="mode"
              value="Online"
              ref={modeRef}
            />
          </div>
        </div>
      </div>
      <div className="group flex flex-col">
        <label htmlFor="agenda">Agenda/Topic Discussed</label>
        <input type="text" id="agenda" ref={agendaRef} />
      </div>
      <div className="group flex flex-col">
        <label htmlFor="summary">Summary</label>
        <textarea
          className="border-[1px] border-solid border-[#320000] rounded-sm p-1"
          type="text"
          id="summary"
          ref={summaryRef}
        ></textarea>
      </div>

      <div className="group flex flex-col ">
        <p>Was the matter resolved?</p>
        <div className="radio-group flex flex-row">
          <div className="flex flex-row">
            <label htmlFor="yes">Yes</label>
            <input
              ref={radioRef}
              type="radio"
              name="radio"
              id="yes"
              value="Yes"
            />
          </div>
          <div className="flex flex-row">
            <label htmlFor="no">No</label>
            <input
              ref={radioRef}
              type="radio"
              name="radio"
              id="no"
              value="No"
            />
          </div>
        </div>
      </div>
      <div className="group flex flex-col">
        <label htmlFor="remarks">Remarks</label>
        <textarea
          className="border-[1px] border-solid border-[#320000] rounded-sm p-1"
          type="text"
          id="remarks"
          ref={remarksRef}
        />
      </div>
      <button
        type="submit"
        className="px-5 py-2 rounded-sm bg-[#720000] hover:bg-[#320000]"
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default ConsultationReport;
