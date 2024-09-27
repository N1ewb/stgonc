import React, { useRef, useState } from "react";
import { useDB } from "../../../../context/db/DBContext";

const WalkinForm = ({ setIsFormOpen }) => {
  const db = useDB();
  const appointeeFirstNameRef = useRef();
  const appointeeLastNameRef = useRef();
  const emailRef = useRef();
  const appointeeTypeRef = useRef();
  const concernRef = useRef();
  const dateRef = useRef();
  const durationRef = useRef();
  const remarksRef = useRef();
  const [submitting, setSubmitting] = useState(false);

  async function handleWalkingAppointment(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (
        appointeeFirstNameRef.current.value &&
        appointeeLastNameRef.current.value &&
        emailRef.current.value &&
        appointeeTypeRef.current.value &&
        concernRef.current.value &&
        dateRef.current.value &&
        durationRef.current.value &&
        durationRef.current.value > 0 &&
        remarksRef.current.value
      ) {
        await db.walkinAppointment(
          appointeeFirstNameRef.current.value,
          appointeeLastNameRef.current.value,
          emailRef.current.value,
          appointeeTypeRef.current.value,
          concernRef.current.value,
          dateRef.current.value,
          durationRef.current.value,
          remarksRef.current.value
        );
      }
      appointeeFirstNameRef.current.value = "";
      appointeeLastNameRef.current.value = "";
      emailRef.current.value = "";
      appointeeTypeRef.current.value = undefined;
      concernRef.current.value = "";
      dateRef.current.value = "";
      durationRef.current.value = "";
      remarksRef.current.value = "";
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleWalkingAppointment}
      action="post"
      className="form-group flex flex-col items-center justify-center w-full md:w-3/4 lg:w-1/2 max-h-screen shadow-md rounded-3xl p-4 md:p-8 overflow-y-auto"
    >
      <div className="form-header w-full flex flex-row justify-between items-center">
        <h3 className="text-[#720000]">Input Walk-in Details</h3>
        <button
          onClick={() => setIsFormOpen(false)}
          className="text-xl text-[#720000] bg-transparent hover:bg-transparent p-0"
        >
          X
        </button>
      </div>

      <div className="name-group flex flex-col md:flex-row gap-4 w-full">
        <input
          className="border border-gray-300 rounded-lg p-2 w-full md:w-1/2 focus:ring-2 focus:ring-indigo-400"
          type="text"
          ref={appointeeFirstNameRef}
          placeholder="First Name"
        />
        <input
          className="border border-gray-300 rounded-lg p-2 w-full md:w-1/2 focus:ring-2 focus:ring-indigo-400"
          type="text"
          ref={appointeeLastNameRef}
          placeholder="Last Name"
        />
      </div>

      <div className="email-group">
        <input
          className="border border-gray-300 rounded-lg p-2 w-full md:full focus:ring-2 focus:ring-indigo-400"
          type="text"
          ref={emailRef}
          placeholder="Email"
        />
      </div>

      <select
        ref={appointeeTypeRef}
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
      >
        <option value={undefined}>Appointee Type</option>
        <option value="Student">Student</option>
        <option value="Guardian">Guardian</option>
      </select>

      <div className="group w-full flex flex-col">
        <label htmlFor="concern" className="font-semibold text-gray-600 mb-1">
          Concern
        </label>
        <textarea
          id="concern"
          name="concern"
          typeof="text"
          ref={concernRef}
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 resize-none w-full"
          rows="4"
        />
      </div>

      <div className="date-group w-full">
        <input
          type="date"
          name="date"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
          ref={dateRef}
        />
      </div>

      <div className="group w-full">
        <input
          name="duration"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
          type="number"
          ref={durationRef}
          placeholder="Duration in hours"
        />
      </div>

      <div className="group w-full flex flex-col">
        <label htmlFor="remarks" className="font-semibold text-gray-600 mb-1">
          Your Remarks
        </label>
        <textarea
          id="remarks"
          name="remarks"
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 resize-none w-full"
          rows="4"
          ref={remarksRef}
        />
      </div>

      <button
        disabled={submitting}
        type="submit"
        className="mt-4 w-full py-2 px-4 bg-[#720000] text-white rounded-lg hover:bg-[#320000] transition-colors"
      >
        {!submitting ? "Submit" : "Submitting"}
      </button>
    </form>
  );
};

export default WalkinForm;
