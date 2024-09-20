import React, { useRef, useState, useEffect } from "react";
import { ChromePicker } from "react-color";
import { useDB } from "../../../../context/db/DBContext";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";

const Legends = ({ teacher }) => {
  const db = useDB();
  const toastMessage = (message) => toast(message);
  const [editedInstructorColorCode, setEditedInstructorColorCode] = useState(
    teacher.instructorColorCode || "gray"
  );
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const colorPickerRef = useRef(null);
  const pickerButtonRef = useRef(null);

  const handleEditInstructorColor = (e) => {
    e.stopPropagation();
    setIsColorPickerOpen(!isColorPickerOpen);
  };

  const confirmColor = async () => {
    if (editedInstructorColorCode && teacher.userID) {
      try {
        await db.editInstructorColorCode(
          teacher.userID,
          editedInstructorColorCode
        );
        toastMessage("Color code changed successfully");
        setIsColorPickerOpen(false);
      } catch (error) {
        toastMessage("Error in editing instructor color: " + error.message);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target) &&
        !pickerButtonRef.current.contains(event.target)
      ) {
        setIsColorPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="instructors-legend w-full flex flex-row ">
      <div
        className={`color-picker-container  ${
          !isColorPickerOpen ? "w-0" : "w-fit"
        }`}
      >
        {isColorPickerOpen && (
          <div
            className={`color-picker-ref absolute top-[10%] -right-48 w-fit z-50`}
            ref={colorPickerRef}
            onClick={(e) => e.stopPropagation()}
          >
            <ChromePicker
              color={editedInstructorColorCode}
              onChange={(newColor) =>
                setEditedInstructorColorCode(newColor.hex)
              }
            />
            <button
              className="w-full rounded-md bg-[#720000] text-white py-2 mt-2 hover:bg-[#2b9f4a]"
              onClick={confirmColor}
            >
              Change Color Code
            </button>
          </div>
        )}
      </div>
      <div
        ref={pickerButtonRef}
        onClick={handleEditInstructorColor}
        className="teacher-legend flex flex-row items-center justify-between cursor-pointer"
      >
        <p className="m-0 w-[8rem]">{teacher.lastName}</p>
        <div
          style={{
            backgroundColor: teacher.instructorColorCode,
          }}
          className="instructorColorCode p-3 rounded-md"
        ></div>
      </div>
      <Tooltip anchorSelect=".instructorColorCode" place="top">
        Edit Color Code
      </Tooltip>
    </div>
  );
};

export default Legends;
