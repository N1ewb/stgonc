const ConsultationReport = ({
  submitForm,
  dateRef,
  durationRef,
  submitting,
  setIsFollowupFormOpen,
  keyissuesRef,
  rootCauseRef,
  recommendationRef,
  expectedOutcomeRef,
  yearLevelRef,
  ageRef,
}) => {
  return (
    <form
      onSubmit={(e) => submitForm(e)}
      className="w-full p-10 rounded-3xl shadow-lg flex-col flex gap-4 items-center [&_div]:w-full mt-20 max-h-[87vh] overflow-auto"
    >
      <h1 className="text-[#720000] ">Consultation Report</h1>
      <div className="group-details flex flex-col gap-4">
        <div className="input-group w-full flex gap-3 justify-between">
          <div className="details-group flex flex-col flex-1">
            <label htmlFor="YearLevel">Year Level</label>
            <input ref={yearLevelRef} type="number" id="yearlevel" />
          </div>
          <div className="details-group flex flex-col flex-1">
            <label htmlFor="age">Age</label>
            <input ref={ageRef} type="number" id="age" />
          </div>
        </div>
        <div className="input-group flex gap-3 justify-between items-center w-full">
          <div className="detail-group flex flex-col !w-[48%]">
            <label htmlFor="date">Date of Session</label>
            <input ref={dateRef} type="date" id="date" />
          </div>
          <div className="detail-group flex flex-col !w-[48%]">
            <label htmlFor="duration">Duration (In hours)</label>
            <input
              type="number"
              list="durations"
              id="duration"
              ref={durationRef}
            />
            <datalist id="durations">
              <option value={1}>1 Hour</option>
              <option value={2}>2 Hours</option>
              <option value={3}>3 Hours</option>
            </datalist>
          </div>
        </div>
      </div>

      <div className="group flex flex-col">
        <label htmlFor="keyissues ">Key Issues</label>
        <textarea
          className="border-[1px] border-solid border-[#320000] rounded-sm p-1"
          type="text"
          id="keyissues"
          ref={keyissuesRef}
        ></textarea>
      </div>
      <div className="group flex flex-col">
        <label htmlFor="rootcause">Root Cause</label>
        <textarea
          className="border-[1px] border-solid border-[#320000] rounded-sm p-1"
          type="text"
          id="rootcause"
          ref={rootCauseRef}
        />
      </div>
      <div className="group flex flex-col">
        <label htmlFor="recommendation">Recommendation</label>
        <textarea
          className="border-[1px] border-solid border-[#320000] rounded-sm p-1"
          type="text"
          id="recommendation"
          ref={recommendationRef}
        ></textarea>
      </div>
      <div className="group flex flex-col">
        <label htmlFor="expectedoutcome">Expected Outcome</label>
        <textarea
          className="border-[1px] border-solid border-[#320000] rounded-sm p-1"
          type="text"
          id="expectedoutcome"
          ref={expectedOutcomeRef}
        />
      </div>
      {/* <div className="group flex flex-col ">
        <p>Was the matter resolved?</p>
        <div className="radio-group flex flex-row">
          <div className="flex flex-row">
            <label htmlFor="yes">Yes</label>
            <input
              onChange={(e) => setIsResolved(e.target.value)}
              type="radio"
              name="radio"
              id="yes"
              value="Yes"
            />
          </div>
          <div className="flex flex-row">
            <label htmlFor="no">No</label>
            <input
              onChange={(e) => setIsResolved(e.target.value)}
              type="radio"
              name="radio"
              id="no"
              value="No"
            />
          </div>
        </div>
      </div> */}

      <div className="buttons flex flex-row w-full justify-around">
        <div className=" w-full flex flex-row justify-around">
          {" "}
          <button
            type="submit"
            className="px-5 py-2 rounded-sm bg-[#1ca32c] hover:bg-[#1c7d27]"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
          <button
            type="button"
            onClick={() => setIsFollowupFormOpen(true)}
            className="px-5 py-2 rounded-sm bg-[#720000] hover:bg-[#320000]"
          >
            {submitting ? "Submitting..." : "Schedule Follow Up"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ConsultationReport;
