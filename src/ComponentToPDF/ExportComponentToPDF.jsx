import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import AdminSchedulesPage from "../pages/UsersPages/admin/admin_pages/admin_schedules/admin_schedules";

const ExportToPDF = () => {
  const componentRef = useRef();

  const handleExport = () => {
    const input = componentRef.current;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("admin_schedule_landscape.pdf");
    });
  };

  return (
    <div>
      {/* Reference to the component we want to export */}
      <div ref={componentRef}>
        <AdminSchedulesPage />
      </div>

      {/* Button to trigger PDF export */}
      <button onClick={handleExport}>Export to PDF (Landscape)</button>
    </div>
  );
};

export default ExportToPDF;
