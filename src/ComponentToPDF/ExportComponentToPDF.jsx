import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import AdminSchedulesPage from '../pages/UsersPages/admin/admin_pages/admin_schedules/admin_schedules'; // Ensure this path is correct

const ExportToPDF = () => {
  const componentRef = useRef();

  const handleExport = () => {
    const input = componentRef.current;

    // Capture the component as a canvas and convert it to PDF
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      
      // Create the PDF in landscape mode
      const pdf = new jsPDF('landscape', 'mm', 'a4'); // 'landscape' is the orientation
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add the image to the PDF and save it
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('admin_schedule_landscape.pdf');
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
