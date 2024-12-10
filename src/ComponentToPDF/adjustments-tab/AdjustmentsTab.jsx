import { useState } from "react";
import BG from "../../static/images/adjustments-tab-bg.png";
import download from "../../static/images/download.png";
import { useExport } from "../../context/exportContext/ExportContext";

export default function AdjustmentsTab({arrangementType, setArrangementType, isBlank, setIsBlank, handleDownload, fileType, setFileType}) {
  const { setCurrentAppointmentData } = useExport();  
  
  
  

  return (
    <div className="flex flex-col w-full h-full items-start [&_p]:text-[#273240]">
      <div className="flex relative">
        <img src={BG} alt="bg" className="w-full h-auto rounded-tr-[65px]" />
        <button className="absolute right-10 top-10 "  onClick={() => setCurrentAppointmentData(null)}>X</button>
      </div>
      <main className="w-full h-full bg-white p-8 flex flex-col gap-8">
        <h1 className="asd uppercase text-[20px] text-[#273240]">
          adjustments <span className="font-semibold">tab</span>
        </h1>
        <div className="row flex gap-20  w-full">
          <div className="col flex-1 pr-10 flex flex-col gap-4">
            <div className="file-type flex-1 flex flex-col justify-start items-start">
              <h2 className="text-[16px] text-[#273240]">
                <span className="font-semibold">FILE</span> TYPE
              </h2>
              <p>
                Choose a <span className="font-semibold">File</span> export
                format
              </p>
              <div className="buttons bg-[#ECECEC] w-full p-2 rounded-2xl flex justify-between [&_button]:text-[15px] [&_button]:w-[150px] [&_button]:rounded-md [&_button]:font-semibold">
                <button
                  onClick={() => setFileType("PDF")}
                  className={` px-3 py-1 ${
                    fileType === "PDF"
                      ? "bg-white text-[#360000]"
                      : "bg-transparent text-[#157AFF]"
                  }`}
                >
                  PDF
                </button>
                <button
                  onClick={() => setFileType("DOCS")}
                  className={` px-3 py-1 ${
                    fileType === "DOCS"
                      ? "bg-white text-[#360000]"
                      : "bg-transparent text-[#157AFF]"
                  }`}
                >
                  DOCS
                </button>
              </div>
            </div>

            <div className="content-arrangement flex-1 flex flex-col justify-start items-start">
              <h2 className="text-[16px] text-[#273240]">
                Content <span className="font-semibold">Arranagement</span>
              </h2>
              <p className="text-[8px]">
                This will allow you to choose between table based report or text
                type format.
              </p>
              <div className="buttons bg-[#ECECEC] w-full p-2 rounded-2xl flex justify-between [&_button]:text-[12px] [&_button]:w-[150px] [&_button]:rounded-md [&_button]:font-semibold">
                <button
                  onClick={() => setArrangementType("default")}
                  className={` px-3 py-1 ${
                    arrangementType === "default"
                      ? "bg-white text-[#157AFF] "
                      : "bg-transparent text-[#360000]"
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => setArrangementType("tabular")}
                  className={` px-3 py-1 ${
                    arrangementType === "tabular"
                      ? "bg-white text-[#157AFF]"
                      : "bg-transparent  text-[#360000]"
                  }`}
                >
                  Tabular
                </button>
              </div>
            </div>

            <div className="print-with-blankcontent flex-1 flex flex-col justify-start items-start">
              <h2 className="text-[16px] text-[#273240]">
                Print with <span className="font-semibold">Blank Content</span>
              </h2>
              <p className="text-[8px] text-start">
                This will allow you to print out the provided form{" "}
                <span className="font-semibold">without</span> the actual
                details extracted from the report. Giving you flexibility to do
                it <span className="font-semibold">manually</span>.
              </p>
              <div className="buttons bg-[#ECECEC] w-full p-2 rounded-2xl flex justify-between [&_button]:text-[12px] [&_button]:w-[150px] [&_button]:rounded-md [&_button]:font-semibold">
                <button
                  onClick={() => setIsBlank(false)}
                  className={` px-3 py-1 ${
                    !isBlank
                      ? "bg-white text-[#157AFF] "
                      : "bg-transparent text-[#360000]"
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => setIsBlank(true)}
                  className={` px-3 py-1 ${
                    isBlank
                      ? "bg-white text-[#157AFF] "
                      : "bg-transparent text-[#360000]"
                  }`}
                >
                  Blank Print
                </button>
              </div>
            </div>
          </div>
          <div className="col flex-1 flex flex-col items-start pl-10">
            <h1 className="uppercase text-[14px]">nothing to adjust?</h1>
            <p className="uppercase text-start text-[8px]">
              Download the file report by clicking the{" "}
              <span className="font-semibold">“download file”</span> button
            </p>
            <button onClick={handleDownload} className="bg-[#157AFF] text-[14px] px-8 py-2 rounded-2xl flex gap-5 items-center">
              DOWNLOAD FILE
              <div className="bg-[#4CAF50] rounded-md px-4 py-1">
                <img
                  src={download}
                  alt="download-icon"
                  height={20}
                  width={30}
                />
              </div>{" "}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
