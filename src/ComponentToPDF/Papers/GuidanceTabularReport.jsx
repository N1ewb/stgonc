import React from "react";
import { useAuth } from "../../context/auth/AuthContext";

export default function GuidanceTabularReport({
  contentRef,
  data,
  appointee,
  isBlank,
}) {
  const { currentUser } = useAuth();

  const todayDate = new Date();
  const formattedDate = todayDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
      <main className="text-justify w-full text-[12px] mt-5">
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2 text-left w-1/2">Field</th>
              <th className="border border-gray-300 p-2 text-left w-1/2">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">Client Name</td>
              <td className="border border-gray-300 p-2 capitalize">
                {isBlank
                  ? ""
                  : `${appointee.firstName} ${appointee.lastName}`}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Year Level / Age</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : `${data?.yearLevel} Year / ${data?.age}`}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Date of Session</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : data?.appointmentDate || data?.date}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Faculty Name</td>
              <td className="border border-gray-300 p-2">
                {isBlank
                  ? ""
                  : `${currentUser.firstName} ${currentUser.lastName}`}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Session Number</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : data?.sessionNumber}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Mode of Consultation</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : data?.location}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Reason for Counseling</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : data?.appointmentType || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 font-semibold">Faculty's Observation</p>
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm mt-2">
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 w-1/2">Observation</td>
              <td className="border border-gray-300 p-2 w-1/2">
                {isBlank ? "" : data?.observation}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 w-1/2">Non-verbal Cues</td>
              <td className="border border-gray-300 p-2 w-1/2">
                {isBlank ? "" : data?.nonVerbalCues}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 w-1/2">Discussion Summary</td>
              <td className="border border-gray-300 p-2 w-1/2">
                {isBlank ? "" : data?.summary}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 w-1/2">Techniques Approach Used</td>
              <td className="border border-gray-300 p-2 w-1/2">
                {isBlank ? "" : data?.techniques}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 w-1/2">Action Plan/Next Steps</td>
              <td className="border border-gray-300 p-2 w-1/2">
                {isBlank ? "" : data?.actionPlan}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 w-1/2">Next Appointment</td>
              <td className="border border-gray-300 p-2 w-1/2">{isBlank ? "" : ""}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 w-1/2">Counselor's Evaluation</td>
              <td className="border border-gray-300 p-2 w-1/2">
                {isBlank ? "" : data?.evaluation}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="signatures flex w-full justify-between items-start mt-4">
          <div>
            <p className="font-semibold">Signature:</p>
          </div>
          <div>
            <p className="font-semibold">Date: {formattedDate}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
