import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import "./Chatmessages.css";

const Chatmessages = ({ message }) => {
  const auth = useAuth();
  const [messageClass, setMessageClass] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      const messageClass =
        message?.uid === auth.currentUser.uid ? "sent" : "received";
      setMessageClass(messageClass);
    }
  }, [auth.currentUser, message.uid]);

  return (
    <div className={`message ${messageClass}`}>
      {message.text ? (
        <p>{message.text}</p>
      ) : (
        <>
          {message.file ? (
            <>
              {message.file.fileType.startsWith("image/") ? (
                <a
                  href={message.file.fileAttachment}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  <img
                    src={message.file.fileAttachment}
                    alt="message file"
                    className="message-image"
                  />
                </a>
              ) : message.file.fileType === "application/pdf" ? (
                <iframe
                  src={message.file.fileAttachment}
                  title="PDF Document"
                  width="100%"
                  height="300px"
                />
              ) : message.file.fileType.startsWith(
                  "application/vnd.openxmlformats-officedocument"
                ) || message.file.fileType.startsWith("application/msword") ? (
                <a
                  href={message.file.fileAttachment}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Document
                </a>
              ) : message.file.fileType === "text/plain" ? (
                <a
                  href={message.file.fileAttachment}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Text File
                </a>
              ) : (
                <a
                  href={message.file.fileAttachment}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download File
                </a>
              )}
            </>
          ) : (
            <p>No file attached.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Chatmessages;
