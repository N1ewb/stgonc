const GuidanceConsultationReport = ({
  submitForm,
  setIsFollowupFormOpen,
  modeRef,
  isResolved,
  setIsResolved,
  submitting,
  yearLevelRef,
  ageRef,
  sessionNumberRef,
  locationRef,
  consultationModeRef,
  concernTypeRef,
  observationRef,
  nonVerbalCuesRef,
  summaryRef,
  techniquesRef,
  actionPlanRef,
  evaluationRef,
  dateRef,
}) => {
  return (
    <form
      onSubmit={(e) => submitForm(e)}
      className="w-full p-10 rounded-3xl shadow-lg flex-col flex gap-4 items-center [&_div]:w-full mt-24 max-h-[85vh] overflow-auto"
    >
      <h1 className="text-[#720000]">Consultation Report</h1>

      {/* Mode of Consultation */}
      <p>Mode of Consultation</p>
      <div className="detail-group flex flex-row gap-5">
        <div className="detail-group-radio flex flex-row gap-2">
          <label htmlFor="f2f">Face to Face</label>
          <input
            type="radio"
            name="mode"
            id="f2f"
            value="Face to Face"
            ref={consultationModeRef}
          />
        </div>
        <div className="detail-group-radio flex flex-row gap-2">
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

      <div className="input-group flex justify-between">
        {/* Year Level */}
        <div className="group flex flex-col">
          <label htmlFor="yearLevel">Year Level</label>
          <input
            type="text"
            id="yearLevel"
            ref={yearLevelRef}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
        </div>

        {/* Age */}
        <div className="group flex flex-col">
          <label htmlFor="age">Age</label>
          <input
            type="text"
            id="age"
            ref={ageRef}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
        </div>
      </div>

      {/* Session Number */}
      <div className="group flex flex-col">
        <label htmlFor="sessionNumber">Session Number</label>
        <input
          type="text"
          id="sessionNumber"
          ref={sessionNumberRef}
          className="px-4 py-2 rounded-lg border border-gray-300"
        />
      </div>

      {/* Location */}
      <div className="group flex flex-col">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          ref={locationRef}
          className="px-4 py-2 rounded-lg border border-gray-300"
        />
      </div>

      {/* Concern Type */}
      <div className="group flex flex-col">
        <label htmlFor="concernType">Concern Type</label>
        <select name="concernType" id="concernType" ref={concernTypeRef}>
            <option value="Academic">Academic</option>
            <option value="Personal">Personal</option>
            <option value="Career">Career</option>
            <option value="Behavioral">Behavioral</option>
        </select>
      </div>

      {/* Observation */}
      <div className="group flex flex-col">
        <label htmlFor="observation">Observation</label>
        <textarea
          id="observation"
          ref={observationRef}
          className="px-4 py-2 rounded-lg border border-gray-300"
        />
      </div>

      {/* Non-Verbal Cues */}
      <div className="group flex flex-col">
        <label htmlFor="nonVerbalCues">Non-Verbal Cues</label>
        <textarea
          id="nonVerbalCues"
          ref={nonVerbalCuesRef}
          className="px-4 py-2 rounded-lg border border-gray-300"
        />
      </div>

      {/* Summary */}
      <div className="group flex flex-col">
        <label htmlFor="summary">Summary</label>
        <textarea
          id="summary"
          ref={summaryRef}
          className="px-4 py-2 rounded-lg border border-gray-300"
        />
      </div>

      {/* Techniques */}
      <div className="group flex flex-col">
        <label htmlFor="techniques">Techniques</label>
        <textarea
          id="techniques"
          ref={techniquesRef}
          className="px-4 py-2 rounded-lg border border-gray-300"
        />
      </div>

      {/* Action Plan */}
      <div className="group flex flex-col">
        <label htmlFor="actionPlan">Action Plan</label>
        <textarea
          id="actionPlan"
          ref={actionPlanRef}
          className="px-4 py-2 rounded-lg border border-gray-300"
        />
      </div>

      {/* Evaluation */}
      <div className="group flex flex-col">
        <label htmlFor="evaluation">Evaluation</label>
        <textarea
          id="evaluation"
          ref={evaluationRef}
          className="px-4 py-2 rounded-lg border border-gray-300"
        />
      </div>

      {/* Date */}
      <div className="group flex flex-col">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          ref={dateRef}
          className="px-4 py-2 rounded-lg border border-gray-300"
        />
      </div>

      {/* Was the matter resolved? */}
      <div className="group flex flex-col">
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
      </div>

      <div className="buttons flex flex-row w-full justify-around">
        {isResolved ? (
          isResolved === "Yes" ? (
            <button
              type="submit"
              className="px-5 py-2 rounded-sm bg-[#1ca32c] hover:bg-[#1c7d27]"
            >
              {submitting ? "Submitting..." : "Mark Finished"}
            </button>
          ) : (
            <div className=" w-full flex flex-row justify-around">
              <button
                type="submit"
                className="px-5 py-2 rounded-sm bg-[#1ca32c] hover:bg-[#1c7d27]"
              >
                {submitting ? "Submitting..." : "Mark Finished Anyway"}
              </button>
              <button
                type="button"
                onClick={() => setIsFollowupFormOpen(true)}
                className="px-5 py-2 rounded-sm bg-[#720000] hover:bg-[#320000]"
              >
                {submitting ? "Submitting..." : "Finish and Schedule Follow Up"}
              </button>
            </div>
          )
        ) : (
          ""
        )}
      </div>
    </form>
  );
};

export default GuidanceConsultationReport;
