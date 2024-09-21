import React, { useRef, useEffect, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useAuth } from "../../../../context/auth/AuthContext";
import { useDB } from "../../../../context/db/DBContext";
import toast from "react-hot-toast";

const SignatureCanvasComponent = ({ setCanvasOpen }) => {
  const auth = useAuth();
  const db = useDB();
  const toastMessage = (message) => toast(message);
  const containerRef = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const signaturePadRef = useRef();

  const handleUploadESignature = async () => {
    if (auth.currentUser) {
      try {
        const signatureDataUrl = signaturePadRef.current.toDataURL("image/png");

        const response = await fetch(signatureDataUrl);
        const blob = await response.blob();
        const file = new File([blob], `${auth.currentUser.displayName}-signature.png`, { type: "image/png" });

        await db.uploadESignature(file);
        toastMessage("E signature successfully uploaded!");
        setCanvasOpen(false);
      } catch (error) {
        toastMessage(`Error uploading signature: ${error.message}`);
        console.error("Error in uploading e-signature", error);
      }
    }
  };
  useEffect(() => {
    const updateCanvasWidth = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.offsetWidth);
      }
    };

    updateCanvasWidth();
    window.addEventListener("resize", updateCanvasWidth);

    return () => {
      window.removeEventListener("resize", updateCanvasWidth);
    };
  }, []);

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();

      const ctx = signaturePadRef.current.getCanvas().getContext("2d");
      ctx.fillStyle = "rgb(248, 250, 252)";
      ctx.fillRect(
        0,
        0,
        signaturePadRef.current.getCanvas().width,
        signaturePadRef.current.getCanvas().height
      );
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md absolute -top-16 left-0 !w-full">
      <div className="flex items-center justify-between !w-full mb-4">
        <h2 className="text-lg font-semibold">Draw Your Signature</h2>
        <button
          onClick={() => setCanvasOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div
        className="border border-gray-300 rounded h-[100%] !w-full"
        ref={containerRef}
      >
        <SignatureCanvas
          ref={signaturePadRef}
          penColor="black"
          canvasProps={{
            width: canvasWidth,
            height: 200,
            className: "signature-canvas",
          }}
          backgroundColor="rgb(248, 250, 252)"
        />
      </div>
      <div className="mt-4 flex justify-end gap-3 !w-full">
        <button
          onClick={clearSignature}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
        <button className="px-4 py-2 bg-[#720000] text-white rounded hover:bg-red-800 transition-colors" onClick={(e) => handleUploadESignature(e)}>Confirm</button>
      </div>
    </div>
  );
};

export default SignatureCanvasComponent;
