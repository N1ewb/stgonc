import React, { useEffect, useState } from "react";
import { useDB } from "../../../../context/db/DBContext";

export default function ActionLogs() {
  const db = useDB();
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const unsubsribe = await db.subscribeToLogsChanges((callback) => {
        setLogs(callback);
      });
      return () => unsubsribe();
    };
    fetchData();
  }, [db]);
  return (
    <div className="flex-1 flex flex-col">
      <header></header>
      <main className="flex-1 flex ">
       <div className="logs-container flex flex-col flex-1 gap-2 max-h-full overflow-auto"> {logs.length > 0 ? (
          logs.map((log) => {
            return <div key={log.id} className=" pb-2 shadow-md rounded-e-md p-3">
                <p>Action: <span>{log.action}</ span></p>
                <p>TYPE: <span>{log.type}</span></p>
            </div>;
          })
        ) : (
          <p>You have no action logs</p>
        )}</div>
      </main>
    </div>
  );
}
