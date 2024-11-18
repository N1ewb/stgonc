import React from "react";
import { useAuth } from "../../context/auth/AuthContext";

export default function GuidanceTabularReport({ contentRef, data, appointee, isBlank }) {
  const { currentUser } = useAuth();

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
          <p className="font-semibold">Client Information</p>
          <table className="table-auto w-full text-gray-800">
            <tbody>
              <tr>
                <td className="font-bold">Client Name:</td>
                <td>{isBlank ? "" : `${appointee.firstName} ${appointee.lastName}`}</td>
              </tr>
              <tr>
                <td className="font-bold">Year Level / Age:</td>
                <td>{isBlank ? "" : `${data?.yearLevel} Year / ${data?.age}`}</td>
              </tr>
              <tr>
                <td className="font-bold">Date of Session:</td>
                <td>{isBlank ? "" : data?.appointmentDat || data?.date}</td>
              </tr>
              <tr>
                <td className="font-bold">Faculty Name:</td>
                <td>{isBlank ? "" : `${currentUser.firstName} ${currentUser.lastName}`}</td>
              </tr>
              <tr>
                <td className="font-bold">Session Number:</td>
                <td>{isBlank ? "" : data?.sessionNumber}</td>
              </tr>
              <tr>
                <td className="font-bold">Mode of Consultation:</td>
                <td>{isBlank ? "" : data?.location}</td>
              </tr>
            </tbody>
          </table>

          <p className="mt-4">
            <span className="font-semibold">Reason for Counseling:</span>
            <span>{isBlank ? "" : data.appointmentType || "N/A"}</span>
          </p>
        </div>

        <div className="observations mt-4">
          <p className="font-semibold">Faculty's Observation</p>
          <table className="table-auto w-full text-gray-800">
            <tbody>
              <tr>
                <td className="font-bold">Observation:</td>
                <td>{isBlank ? "" : data?.observation}</td>
              </tr>
              <tr>
                <td className="font-bold">Non-verbal Cues:</td>
                <td>{isBlank ? "" : data?.nonVerbalCues}</td>
              </tr>
              <tr>
                <td className="font-bold">Discussion Summary:</td>
                <td>{isBlank ? "" : data?.summary}</td>
              </tr>
              <tr>
                <td className="font-bold">Techniques Approach Used:</td>
                <td>{isBlank ? "" : data?.techniques}</td>
              </tr>
              <tr>
                <td className="font-bold">Action Plan/Next Steps:</td>
                <td>{isBlank ? "" : data?.actionPlan}</td>
              </tr>
              <tr>
                <td className="font-bold">Next Appointment:</td>
                <td>{isBlank ? "" : ""}</td>
              </tr>
              <tr>
                <td className="font-bold">Counselor's Evaluation:</td>
                <td>{isBlank ? "" : data?.evaluation}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="signatures flex w-full justify-between items-start mt-4">
          <div>
            <p className="font-semibold">Signature:</p>
          </div>
          <div>
            <p className="font-semibold">Date: {data?.appointmentDate}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
