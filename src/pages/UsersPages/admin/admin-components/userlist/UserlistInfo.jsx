import React, { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDB } from "../../../../../context/db/DBContext";

const UserlistInfo = ({ setCurrentUserInfo, currentUserInfo }) => {
  const {updateUserInfo} = useDB()
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneNumberRef = useRef();
  const studentIdRef = useRef();
  const roleRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState({});

  useEffect(() => {
    setEditedUserInfo(currentUserInfo);
  }, [currentUserInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSaveUserInfo = async () => {
    try {
      const ref = await updateUserInfo(editedUserInfo, currentUserInfo.id);
      if (ref.status === "success") {
        toast.success(ref.message);
      } else {
        toast.error(ref.message);
      }
    } catch (error) {
      toast.error("Error occured", error.message);
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUserInfo(currentUserInfo);
  };

  return (
    <div className="w-full h-auto flex flex-col p-5 ">
      <header className="flex flex-row w-full justify-between items-center pb-4 ">
        <h3 className="font-light text-[32px]">
          User <span className="font-semibold">Info</span>
        </h3>
        <button
          className="bg-[#320000] hover:bg-[#720000] rounded-sm"
          onClick={() => setCurrentUserInfo(null)}
        >
          X
        </button>
      </header>
      <main className="flex flex-row w-full justify-between items-center pt-2 text-[#320000]">
        <div className=" [&_span]:font-bold [&_span]:text-[14px] [&_p]:font-light flex flex-col gap-1">
          {!isEditing ? (
            <>
              <p className="capitalize">
                <span>Name: </span> {currentUserInfo.firstName}{" "}
                {currentUserInfo.lastName}
              </p>
              <p>
                <span>Email: </span> {currentUserInfo.email}
              </p>
              <p>
                <span>Phone Number: </span> {currentUserInfo.phoneNumber}
              </p>
              <p>
                <span>School ID Number: </span>
                {currentUserInfo.studentIdnumber ||
                  currentUserInfo.facultyIdnumber}
              </p>
              <p>
                <span>Role: </span> {currentUserInfo.role}
              </p>
            </>
          ) : (
            <>
              <input
                type="text"
                name="firstName"
                value={editedUserInfo.firstName}
                ref={firstNameRef}
                onChange={handleInputChange}
                className="border p-2 rounded-sm"
              />
              <input
                type="text"
                name="lastName"
                value={editedUserInfo.lastName}
                ref={lastNameRef}
                onChange={handleInputChange}
                className="border p-2 rounded-sm"
              />
              <input
                type="email"
                name="email"
                value={editedUserInfo.email}
                ref={emailRef}
                onChange={handleInputChange}
                className="border p-2 rounded-sm"
              />
              <input
                type="tel"
                name="phoneNumber"
                value={editedUserInfo.phoneNumber}
                ref={phoneNumberRef}
                onChange={handleInputChange}
                className="border p-2 rounded-sm"
              />
              <input
                type="text"
                name="studentIdnumber"
                value={editedUserInfo.studentIdnumber}
                ref={studentIdRef}
                onChange={handleInputChange}
                className="border p-2 rounded-sm"
              />
              <input
                type="text"
                name="role"
                value={editedUserInfo.role}
                ref={roleRef}
                onChange={handleInputChange}
                className="border p-2 rounded-sm"
              />
            </>
          )}
        </div>
        <div className="m-w-1/2 h-[250px] w-[250px] rounded-3xl bg-[#320000] shadow-inner-userlist-shadow">
          <img
            src={currentUserInfo?.photoURL}
            alt="User profile"
            className="h-[100%] max-h-[100%] rounded-3xl w-full object-cover object-center shadow-inner-userlist-shadow"
          />
        </div>
      </main>
      <div>
        {!isEditing ? (
          <button
            className="bg-[#720000] hover:bg-[#320000] text-white rounded-sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        ) : (
          <>
            <button
              className="bg-[#320000] hover:bg-[#720000] text-white rounded-sm mr-2"
              onClick={handleSaveUserInfo}
            >
              Save
            </button>
            <button
              className="bg-[#720000] hover:bg-[#320000] text-white rounded-sm"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserlistInfo;
