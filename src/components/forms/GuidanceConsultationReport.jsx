const GuidanceConsultationReport = ({
  submitForm,
  setIsFollowupFormOpen,
  submitting,
  yearLevelRef,
  ageRef,
  locationRef,
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

export default GuidanceConsultationReport;
