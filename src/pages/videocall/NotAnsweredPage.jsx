import React, { useEffect } from "react";

export default function NotAnsweredPage() {
  const mediaStreamRef = React.useRef(null);

  const stopMediaDevices = () => {
    if (mediaStreamRef.current) {
      const tracks = mediaStreamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      console.log("Media devices stopped.");
    }
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          devices.forEach((device) => {
            if (device.kind === "videoinput" || device.kind === "audioinput") {
              console.log(`Found device: ${device.label}`);
            }
          });
        })
        .catch((err) => {
          console.error("Error enumerating devices:", err);
        });
    } else {
      console.error("enumerateDevices not supported.");
    }

    stopMediaDevices();
  }, []);

  return (
    <div className="w-full h-screen bg-black text-white flex items-center justify-center">
      Call was Not Answered
    </div>
  );
}
