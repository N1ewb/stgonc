import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth/AuthContext";

import spcLogo from "../static/images/spc-logo.png";
import ccsLogo from "../static/departmentLogos/ccs-logo.png";
import coeLogo from "../static/departmentLogos/coe-logo.png";
import casLogo from "../static/departmentLogos/cas-logo.png";
import cocLogo from "../static/departmentLogos/coc-logo.png";
import cedLogo from "../static/departmentLogos/ced-logo.png";
import cbaLogo from "../static/departmentLogos/cba-logo.png";
import { useDB } from "../context/db/DBContext";
import Loading from "../components/Loading/Loading";
import { useExport } from "../context/exportContext/ExportContext";

const departmentLogos = {
  "College of Computer Studies": ccsLogo,
  "College of Engineering": coeLogo,
  "College of Arts and Sciences": casLogo,
  "College of Business Administration": cbaLogo,
  "College of Education": cedLogo,
  "College of Criminology": cocLogo,
};

const AppointmentData = ({ data }) => {
  const { currentUser } = useAuth();
  const db = useDB();
  const {setCurrentAppointmentData} = useExport()
  const [appointee, setAppointee] = useState(null);
  const [loading, setLoading] = useState(true);
  const departmentLogo = departmentLogos[currentUser.department] || spcLogo;

  useEffect(() => {
    if (data) {
      async function fetchData() {
        try {
          setLoading(true);
          const user = await db.getUser(data.appointee);
          setAppointee(user);
        } catch (error) {
          console.log("An error occurred");
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [data, db]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div onClick={() => setCurrentAppointmentData(null)} className="absolute z-10 top-0 left-0 w-full h-full max-h-full bg-[#0000005e] flex items-center justify-center overflow-auto">
      <div onClick={(e) => e.stopPropagation()} className="paper-container w-1/2 h-500px bg-white p-10">
        <header className="flex flex-row items-center justify-around p-10">
          <img src={spcLogo} width={80} alt="SPC logo" />
          <h1 className="text-center text-black text-[32px]">
            St. Peter's College <br />
            <span className="text-[24px] font-light">
              {currentUser.department}
            </span>
          </h1>
          <img
            src={departmentLogo}
            alt={`${currentUser.department} logo`}
            width={80}
          />
        </header>
        <main className="text-justify">
          <p>
            Consultation record with{" "}
            {`${appointee?.firstName} ${appointee?.lastName}`}
          </p>
          <p>
            <span>This appointment was held on </span>
            {data.appointmentDate}
          </p>
          <p>
            <span>Student's Concern: </span>
            {data.appointmentConcern}
          </p>
          <p>
            <span>Faculty's Recommendation: </span>
            {data.teacherRemarks}
          </p>
        </main>
      </div>
    </div>
  );
};

export default AppointmentData;
