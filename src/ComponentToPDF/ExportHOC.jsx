import React, { useRef, forwardRef, useImperativeHandle } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ExportToPDFHOC = forwardRef(({ children, fileName, fileType }, ref) => {
  const componentRef = useRef();

  const ORIENTATION = "landscape";
  const UNIT = "mm";
  const FORMAT = "a4";

  const handleExport = () => {
    const input = componentRef.current;

    const canvasOptions = {
      scale: 3,
      useCORS: true,
    };

    html2canvas(input, canvasOptions).then((canvas) => {
      const imgData = canvas.toDataURL(`image/${fileType}`);
      const pdf = new jsPDF(ORIENTATION, UNIT, FORMAT);

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, fileType.toUpperCase(), 0, 0, imgWidth, imgHeight);
      pdf.save(`${fileName}.${fileType}`);
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
