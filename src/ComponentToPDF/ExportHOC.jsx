import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Using forwardRef to allow external reference access
const ExportToPDFHOC = forwardRef(({ children, fileName }, ref) => {
  const componentRef = useRef();

  const handleExport = () => {
    const input = componentRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}.pdf`); 
    });
  };

  useImperativeHandle(ref, () => ({
    exportPDF: handleExport,
  }));

  return (
    <div>
      <div ref={componentRef}>{children}</div>
    </div>
  );
});

export default ExportToPDFHOC;
