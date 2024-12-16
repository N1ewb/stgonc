import React, { useEffect, useState } from "react";
import { useDB } from "../../../../context/db/DBContext";

export default function ActionLogs() {
  const db = useDB();
  const [logs, setLogs] = useState([]);
  const [expandedLogId, setExpandedLogId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = await db.subscribeToLogsChanges((callback) => {
        setLogs(callback);
      });
      return () => unsubscribe();
    };
    fetchData();
  }, [db]);

  const renderValue = (value) => {
    if (value === null) {
      return "No data";
    }
    if (typeof value === "object" && !Array.isArray(value)) {
      return (
        <ul>
          {Object.entries(value).map(([key, nestedValue], idx) => (
            <li key={idx}>
              <strong>{key}: </strong>
              {renderValue(nestedValue)}
            </li>
          ))}
        </ul>
      );
    }
    return value;
  };

  const handleLogClick = (logId) => {
    if (expandedLogId === logId) {
      setExpandedLogId(null);
    } else {
      setExpandedLogId(logId);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <header></header>
      <main className="flex-1 flex ">
        <div className="logs-container flex flex-col flex-1 gap-2 max-h-full overflow-auto">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div
                key={log.id}
                onClick={() => handleLogClick(log.id)}
                className="pb-2 shadow-md rounded-e-md p-3 cursor-pointer"
              >
                <p>
                  Action: <span>{log.action}</span>
                </p>
                <p>
                  TYPE: <span>{log.type}</span>
                </p>

                {expandedLogId === log.id && (
                  <div>
                    {Object.entries(log.details).map(([key, value], idx) => (
                      <li key={idx}>
                        <strong>{key}: </strong>
                        {renderValue(value)}
                      </li>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>You have no action logs</p>
          )}
        </div>
      </main>
    </div>
  );
}
