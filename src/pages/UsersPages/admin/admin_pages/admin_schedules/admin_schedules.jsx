import React, { useEffect, useRef, useState } from "react";
import "./admin_schedules.css";
import { useAuth } from "../../../../../context/auth/AuthContext";
import { useDB } from "../../../../../context/db/DBContext";
import { auth } from "../../../../../server/firebase";
import { Tooltip } from "react-tooltip";

import toast from "react-hot-toast";

import Legends from "../../admin-components/Legends";
import ExportToPDFHOC from "../../../../../ComponentToPDF/ExportHOC";

import Export from "../../../../../static/images/export-file.png";
import Edit from "../../../../../static/images/pen.png";
import SchedulesTable from "../../admin-components/SchedulesTable";
import ConfirmDialogComponent from "../../admin-components/ConfirmDialogComponent";

const AdminSchedulesPage = () => {
  const db = useDB();
  const toastMessage = (message) => toast(message);
  const { currentUser } = useAuth();
  const [teachersList, setTeachersList] = useState([]);
  const [show, setShow] = useState(false);

  const [choosenCells, setChoosenCells] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [schedules, setSchedules] = useState();

  const exportPDFRef = useRef();
  const [fileType, setFiletype] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const toggleShow = () => {
    if (choosenCells.length !== 0) {
      setShow(!show);
    } else {
      toastMessage("Please choose a timeslot");
    }
  };

  const handleChooseCells = () => {
    try {
      setIsEditMode(!isEditMode);
      setChoosenCells([]);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const handleInstructorUpdates = (instrcutorData) => {
          setTeachersList(instrcutorData);
        };

        const unsubscribe = db.subscribeToInstructorChanges(
          handleInstructorUpdates
        );

        return () => unsubscribe();
      } catch (error) {
        toastMessage("Error in fetching instructors:", error.message);
      }
    };

    fetchInstructors();
  }, [db]);

  return (
    <ExportToPDFHOC
      fileName={`${auth.currentUser.displayName} Faculty schedule`}
      fileType={fileType}
      ref={exportPDFRef}
    >
      <div className="admin-schedules-page-container w-full h-[100%] flex flex-col justify-around items-center gap-[5px]">
        <div className="admin-schedule-header-tile flex flex-col w-full text-center text-[#740000]">
          <h1 className="w-[full] font-bold text-3xl">
            {currentUser.department}
          </h1>
          <h3 className="w-full text-2xl font-bold">
            Faculty Consultation Schedule
          </h3>
        </div>

        <div className="pt-20">
          <div className="actions-container w-full flex flex-row-reverse gap-3">
            <button
              onClick={() => setDialogVisible(true)}
              className="export-button bg-transparent  p-0"
            >
              <img src={Export} alt="Export" height={27} width={27} />
            </button>
            {!isEditMode ? (
              <button
                className="edit-button bg-transparent  p-0"
                onClick={handleChooseCells}
              >
                <img src={Edit} alt="Edit" height={25} width={25} />
              </button>
            ) : (
              <div className="flex flex-row w-[250px] justify-around [&_button]:bg-[#740000] [&_button]:w-[100px] [&_button]:rounded-[4px]">
                <button onClick={() => toggleShow()}>Select</button>
                <button onClick={() => handleChooseCells()}>Cancel</button>
              </div>
            )}
            {dialogVisible && (
              <ConfirmDialogComponent
                setFiletype={setFiletype}
                exportPDFRef={exportPDFRef}
                toastMessage={toastMessage}
                setDialogVisible={setDialogVisible}
              />
            )}
          </div>
          <div className="div flex flex-row-reverse flex-wrap w-full justify-evenly">
            <SchedulesTable
              show={show}
              teachersList={teachersList}
              toggleShow={toggleShow}
              toastMessage={toastMessage}
              schedules={schedules}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              choosenCells={choosenCells}
              setChoosenCells={setChoosenCells}
              setSchedules={setSchedules}
            />

            <div className="legends-container relative basis-[20%] md:basis-[90%] flex flex-col justify-start gap-3">
              <h5 className="text-2xl font-bold text-[#740000]">Legend</h5>
              {teachersList && teachersList.length !== 0 ? (
                teachersList.map((teacher, index) => (
                  <Legends key={index} teacher={teacher} />
                ))
              ) : (
                <p>No Instructors</p>
              )}
            </div>
          </div>
        </div>
        <Tooltip anchorSelect=".export-button" place="top">
          Export file 
        </Tooltip>
        <Tooltip anchorSelect=".edit-button" place="top">
          Edit Table
        </Tooltip>
      </div>
    </ExportToPDFHOC>
  );
};

export default AdminSchedulesPage;
