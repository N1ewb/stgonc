import React, { useRef, useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import spcLogo from "../static/images/spc-logo.png";
import ccsLogo from "../static/images/ccs-logo.png";
import { useAuth } from "../context/auth/AuthContext";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Loading from "../components/Loading/Loading";
import calculateRating from "../lib/utility/CalculateRating";
import { useDB } from "../context/db/DBContext";

const ExportReport = ({ onClose, insList }) => {
  const db = useDB();
  const { currentUser } = useAuth();
  const pdfRef = useRef();
  const [signatureSrc, setSignatureSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [allRating, setAllRating] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      try {
        if (insList.length === 0) return;

        let ratedInstructors = await calculateRating(db, insList);

        const sortedIns = ratedInstructors.sort(
          (a, b) => b.avgRating - a.avgRating
        );

        const updatedInstructors = await Promise.all(
          insList.map(async (ins) => {
            const insApts = await db.getFinishedFacultyAppointment(ins.id);

            const totalConsultationHours = insApts.reduce(
              (sum, apt) => sum + (parseInt(apt.appointmentDuration) || 0),
              0
            );

            const ratingData = sortedIns.find(
              (rated) => rated.ins.userID === ins.id
            ) || {
              avgRating: "N/A",
            };

            return {
              ...ins,
              rating: ratingData.avgRating,
              totalConsultationHours,
            };
          })
        );

        console.log("Updated Instructors:", updatedInstructors);
        setAllRating(updatedInstructors);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [insList, db]);

  useEffect(() => {
    const fetchSignature = async (url) => {
      try {
        setLoading(true);
        const storage = getStorage();
        const storageRef = ref(storage, url);
        const imageUrl = await getDownloadURL(storageRef);
        setSignatureSrc(imageUrl);
      } catch (error) {
        console.error("Error fetching the signature image:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.eSignature) {
      fetchSignature(currentUser.eSignature);
    }
  }, [currentUser]);

  const handleDownloadPDF = async () => {
    if (!signatureSrc) return;
    console.log("Signature source URL:", signatureSrc);

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = signatureSrc;

    img.onload = async () => {
      if (!img.src) {
        return;
      }
      console.log("Image object", img);
      const imgElement = document.createElement("img");
      imgElement.src = signatureSrc;
      document.body.appendChild(imgElement);
      const canvas = await html2canvas(pdfRef.current, { scale: 3 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.addImage(signatureSrc, "PNG", 10, imgHeight + 10, 100, 50);
      pdf.save("document.pdf");
    };
  };

  const handlePrint = useReactToPrint({
    content: () => pdfRef.current,
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      className="max-h-full w-full flex flex-col items-center overflow-auto bg-[#00000060]"
      style={{ padding: "20px" }}
      onClick={onClose}
    >
      <div className="spacer p-20"></div>
      <div className="content flex flex-row justify-between items-start">
        <header className="p-9 fixed z-10 bg-[#320000] left-0">
          <h1 className="text-white text-3xl">Export this month's report file</h1>
          <div
            style={{ margin: "20px 0" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handlePrint} style={buttonStyle}>
              Print Preview
            </button>
            <button onClick={handleDownloadPDF} style={buttonStyle}>
              Download PDF
            </button>
          </div>
        </header>

        {/* PDF Content Preview */}
        <div
          ref={pdfRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "210mm",
            minHeight: "297mm",
            margin: "auto",
            padding: "20px",
            background: "#fff",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <header className="flex flex-row items-center justify-around p-10">
            <img src={spcLogo} width={80} alt="spc logo" />
            <h1 className="text-center text-black text-[32px]">
              St. Peter's College <br />
              <span className="text-[24px] font-light">
                {currentUser.department}
              </span>
            </h1>
            <img src={ccsLogo} alt="ccs-logo" width={80} />
          </header>
          <main className="text-center flex flex-col justify-between p-10">
            <div className="table flex-grow">
              <p>CCS Faculty’s Consultation Hours Monthly Report</p>

              <table className="min-w-full border-collapse border border-gray-200 text-[12px]">
                <thead>
                  <tr>
                    <th className="border border-gray-200 px-4 py-2">ID</th>
                    <th className="border border-gray-200 px-4 py-2">Name</th>
                    <th className="border border-gray-200 px-4 py-2">
                      Total Consultation Hours
                    </th>
                    <th className="border border-gray-200 px-4 py-2">Rating</th>
                  </tr>
                </thead>

                <tbody>
                  {allRating.length !== 0 ? (
                    allRating.map((ins) => (
                      <tr key={ins.id}>
                        <td className="border border-gray-200 px-4 py-2">
                          {ins.facultyIdnumber}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {`${ins.firstName} ${ins.lastName}`}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {ins.totalConsultationHours || 0}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {ins.rating || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="border border-gray-200 px-4 py-2"
                        colSpan="4"
                      >
                        No instructors rated
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>
          <footer className="e-signature w-full flex flex-col items-end justify-center relative p-10 [&_p]:m-0">
            <div className="w-[35%] flex flex-col items-center justify-center text-center">
              <img
                className="absolute bottom-14"
                src={signatureSrc}
                alt="e-signature"
                width={300}
              />

              <div className="line h-[1px] w-full bg-black"></div>
              <p className="font-medium">{currentUser.displayName}</p>
              <p>Dean of {currentUser.department}</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  margin: "5px",
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default ExportReport;
