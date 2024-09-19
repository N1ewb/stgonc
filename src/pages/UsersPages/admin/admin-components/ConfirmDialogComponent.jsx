import React, { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";

const ConfirmDialogComponent = ({
  setFiletype,
  exportPDFRef,
  toastMessage,
  setDialogVisible,
}) => {
  const handleExport = () => {
    const ExportAsPNG = () => {
      setFiletype("png");
      setTimeout(() => {
        if (exportPDFRef.current) {
          exportPDFRef.current.exportPDF();
          toastMessage(`Exported file as PNG`);
        }
      }, 100);
    };

    const ExportAsPDF = () => {
      setFiletype("pdf");
      setTimeout(() => {
        if (exportPDFRef.current) {
          exportPDFRef.current.exportPDF();
          toastMessage(`Exported file as PDF`);
        }
      }, 100);
    };

    const ExportAsJPEG = () => {
      setFiletype("jpeg");
      setTimeout(() => {
        if (exportPDFRef.current) {
          exportPDFRef.current.exportPDF();
          toastMessage(`Exported file as JPEG`);
        }
      }, 100);
    };

    confirmAlert({
      title: "Export Item",
      message: "Choose Filetype",
      buttons: [
        {
          label: "png",
          onClick: () => ExportAsPNG(),
        },
        {
          label: "pdf",
          onClick: () => ExportAsPDF(),
        },
        {
          label: "jpeg",
          onClick: () => ExportAsJPEG(),
        },
        {
          label: "Cancel",
          onClick: () => setDialogVisible(false),
        },
      ],
    });
    setDialogVisible(false);
  };
  useEffect(() => {
    handleExport();
  }, []);
  return <div>{""}</div>;
};

export default ConfirmDialogComponent;
