import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/auth/AuthContext";
import html2pdf from "html2pdf.js";
import * as HTMLDocx from "html-docx-js/dist/html-docx";

import spcLogo from "../static/images/spc-logo.png";
import ccsLogo from "../static/departmentLogos/ccs-logo.png";
import coeLogo from "../static/departmentLogos/coe-logo.png";
import casLogo from "../static/departmentLogos/cas-logo.png";
import cocLogo from "../static/departmentLogos/coc-logo.png";
import cedLogo from "../static/departmentLogos/ced-logo.png";
import cbaLogo from "../static/departmentLogos/cba-logo.png";
import { useDB } from "../context/db/DBContext";
import Loading from "../components/Loading/Loading";
import GeneralAppointmenteport from "./Papers/GeneralAppointmenteport";
import AdjustmentsTab from "./adjustments-tab/AdjustmentsTab";
import TabularReport from "./Papers/TabularGeneralAppointmentReport";
import GuidanceReport from "./Papers/GuidanceReport";
import GuidanceTabularReport from "./Papers/GuidanceTabularReport";

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

  const [appointee, setAppointee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [arrangementType, setArrangementType] = useState("default");
  const [isBlank, setIsBlank] = useState(false);
  const [fileType, setFileType] = useState("PDF");

  const departmentLogo = departmentLogos[currentUser.department] || spcLogo;

  // Reference to the content to export
  const contentRef = useRef();

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

  const handleDownloadPDF = () => {
    const options = {
      margin: 0.1,
      filename: `Appointment_${data.appointmentDate}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(contentRef.current).set(options).save();
  };

  const handleDownloadDocx = () => {
    const contentHtml = contentRef.current.innerHTML;
    const converted = HTMLDocx.asBlob(contentHtml);

    const link = document.createElement("a");
    link.href = URL.createObjectURL(converted);
    link.download = `Appointment_${data.appointmentDate}.docx`;
    link.click();
  };

  const handleDownload = () => {
    if (fileType === "PDF") {
      handleDownloadPDF();
    } else if (fileType === "DOCS") {
      handleDownloadDocx();
    } else {
      console.log("Unsa mani");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      // onClick={() => setCurrentAppointmentData(null)}
      className="absolute z-10 top-[15%] right-[1%] w-[81%] h-[80%]  rounded-[65px]  max-h-full bg-[#273240] flex"
    >
      <div className="file-visualizer w-[40%] h-full p-10 flex flex-col ">
        <h1 className="text-white text-3xl">
          File <span className="font-bold">Visualizer</span>
        </h1>
        <div className="informative-text text-[12px] text-white flex w-full justify-between">
          <p>
            Customize your file that work for your convenience before exporting!
          </p>{" "}
          <p>
            Paper: <span className="font-semibold">A4</span>
          </p>
        </div>

        {arrangementType === "default" ? (
          currentUser?.role === "Guidance" ? (
            <GuidanceReport
              contentRef={contentRef}
              data={data}
              appointee={data.appointee}
              isBlank={isBlank}
            />
          ) : (
            <GeneralAppointmenteport
              contentRef={contentRef}
              data={data}
              appointee={appointee}
              isBlank={isBlank}
            />
          )
        ) : currentUser?.role === "Guidance" ? (
          <GuidanceTabularReport
            contentRef={contentRef}
            data={data}
            appointee={data.appointee}
            isBlank={isBlank}
          />
        ) : (
          <TabularReport
            contentRef={contentRef}
            data={data}
            appointee={appointee}
            isBlank={isBlank}
          />
        )}
        {/* <SamplePaper /> */}
      </div>
      <div className="adjustments-tab w-[60%] flex pb-10">
        <AdjustmentsTab
          setArrangementType={setArrangementType}
          arrangementType={arrangementType}
          setIsBlank={setIsBlank}
          isBlank={isBlank}
          handleDownload={handleDownload}
          fileType={fileType}
          setFileType={setFileType}
        />
      </div>
    </div>
  );
};

export default AppointmentData;
