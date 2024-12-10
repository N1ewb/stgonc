import React from "react";
import { useAuth } from "../../context/auth/AuthContext";

export default function TabularReport({ contentRef, data,report, appointee, isBlank }) {
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
          {currentUser.department} <br />
          <span className="text-[12px] font-light">Counseling Report</span>
        </p>
      </header>
      <main className="text-justify w-full text-[12px]">
        <table className="table-auto w-full border-collapse border border-gray-300 mt-5 text-sm">
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
                {isBlank ? "" : `${appointee.firstName} ${appointee.lastName}`}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Year Level / Age</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : `${report.yearLevel} Year / ${report.age}`}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Date of Session</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : report.date}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Faculty Name</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : `${currentUser.firstName} ${currentUser.lastName}`}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Session Number</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : data.sessionNumber}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Mode of Consultation</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : data.appointmentFormat}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Reason for Counseling</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : (data.appointmentType || "N/A")}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Key Issues</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : report.keyissues}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Root Cause</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : report.rootcause}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Recommendation</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : report.recommendation}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Expected Outcome</td>
              <td className="border border-gray-300 p-2">
                {isBlank ? "" : report.expectedOutcome}
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}
