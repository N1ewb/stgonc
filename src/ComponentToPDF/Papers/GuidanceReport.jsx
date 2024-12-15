import React from "react";
import { useAuth } from "../../context/auth/AuthContext";

export default function GuidanceReport({
  contentRef,
  data,
  appointee,
  report,
  isBlank,
}) {
  const { currentUser } = useAuth();
  const todayDate = new Date();

  const formattedDate = todayDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const reportData = report || data;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="paper-container w-full h-full bg-white p-10"
      ref={contentRef}
    >
      <header className="flex flex-col items-center justify-around px-10 w-full">
        <p className="text-center text-black text-[14px]">
          St. Peter's College <br />
          <span className="text-[12px] font-light">
            Sabayle St. Iligan City
          </span>
        </p>
        <p className="text-center text-black text-[14px]">
          {currentUser.department} Office <br />
          <span className="text-[12px] font-light">Counseling Report</span>
        </p>
      </header>
      <main className="text-justify w-full text-[12px]">
        <div className="client-information">
          <p>Client Information</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-800">
            <li>
              Client Name:{" "}
              <span className="font-bold text-gray-600 capitalize">
                {isBlank ? "" : `${appointee.firstName} ${appointee.lastName}`}
              </span>
            </li>
            <li>
              Year Level / Age:{" "}
              <span className="font-bold text-gray-600">
                {isBlank ? "" : `${reportData?.yearLevel} Year / ${reportData?.age}`}
              </span>
            </li>
            <li>
              Date of Session:{" "}
              <span className="font-bold text-gray-600">
                {isBlank ? "" : reportData?.appointmentDate || reportData?.date}
              </span>
            </li>
            <li>
              Faculty Name:{" "}
              <span className="font-bold text-gray-600">
                {isBlank
                  ? ""
                  : `${currentUser.firstName} ${currentUser.lastName}`}
              </span>
            </li>
            <li>
              Session Number:{" "}
              <span className="font-bold text-gray-600">
                {isBlank ? "" : reportData?.sessionNumber}
              </span>
            </li>
            <li>
              Location:{" "}
              <span className="font-bold text-gray-600">
                {isBlank ? "" : reportData?.location}
              </span>
            </li>
          </ul>

          <p>
            Reason for Counseling:{" "}
            <span>{isBlank ? "" : reportData.appointmentType || "N/A"}</span>
          </p>
        </div>
        <div className="observations [&_p]:font-semibold [&_span]:font-normal">
          <p>Faculty's Observation</p>
          <div className="fields">
            <p>
              Observation: <span>{isBlank ? "" : reportData?.observation}</span>
            </p>
            <p>
              Non-verbal Cues: <span>{isBlank ? "" : reportData?.nonVerbalCues}</span>
            </p>
            <p>
              Discussion Summary: <span>{isBlank ? "" : reportData?.summary}</span>
            </p>
            <p>
              Techniques Approach Used:{" "}
              <span>{isBlank ? "" : reportData?.techniques}</span>
            </p>
            <p>
              Action Plan/ Next Steps:{" "}
              <span>{isBlank ? "" : reportData?.actionPlan}</span>
            </p>
            <p>
              Next Appointment: <span>{isBlank ? "" : ""}</span>
            </p>
            <p>
              Counselors Evaluation:{" "}
              <span>{isBlank ? "" : reportData?.evaluation}</span>
            </p>
          </div>
          <div className="signatures flex w-full justify-between items-start [&_p]:w-1/2">
            <p>Signature:</p>
            <p>Date: {formattedDate}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
