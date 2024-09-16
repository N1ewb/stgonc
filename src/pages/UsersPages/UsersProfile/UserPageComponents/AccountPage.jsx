import React, { useEffect, useState } from "react";
import { auth } from "../../../../server/firebase";
import DefaultProfile from "../../../../static/images/default-profile.png";
import CameraIcon from "../../../../static/images/camera-light.png";
import toast from "react-hot-toast";

const AccountPage = ({ useAuth, db, user }) => {
  const [photoURL, setPhotoURL] = useState("");
  const toastMessage = (message) => toast(message);
  const handleChangePhoto = async (event) => {
    const file = event.target.files[0];
    if (file && useAuth.currentUser) {
      try {
        await db.changeUserProfile(file);
        setPhotoURL(file);
        toastMessage("Profile photo updated successfully");
      } catch (err) {
        console.error("Error updating profile photo:", err.message);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setPhotoURL(user.photoURL || DefaultProfile);
      } else {
        setPhotoURL(DefaultProfile);
      }
    });
    return () => unsubscribe();
  }, [photoURL]);

  return (
    <div className="account-page-container shadow-md rounded-[20px] pt-10 pb-5 px-1 bg-[#f4f4f4] w-full flex flex-col gap-2 [&_p]:m-0">
      <p className="w-full px-3 text-2xl">
        General Account Details <br></br>
        <span className="text-[#828282] text-sm">Mange user profile</span>
      </p>

      <div className="div shadow-md rounded-[20px]  bg-white w-full flex flex-row gap-5 mb-10 p-4">
        <div className="profile flex flex-col gap-3 items-start relative">
          <div className="profile-wrapper bg-[#720000] rounded-full p-[2px]">
            <img
              className="w-[150px] h-[150px] rounded-full object-cover"
              src={photoURL}
              alt="profile picture"
            />
          </div>

          <div className="absolute top-[74%] right-0">
            <input
              id="change-profile"
              name="change-profile"
              type="file"
              className="hidden"
              onChange={(e) => handleChangePhoto(e)}
            />
            <label
              htmlFor="change-profile"
              className=" text-white p-2 rounded-full cursor-pointer  bg-[#720000]"
            >
              <img
                src={CameraIcon}
                alt="Change PFP"
                className="h-[25px] w-[25px]"
              />
            </label>
          </div>
        </div>
        <div className="div flex flex-row flex-wrap gap-5 w-3/4 [&_div]:w-[45%]">
          <div className="email">
            <p>Email Address</p>
            <p className="text-sm">{user?.email}</p>
          </div>
          <div className="role">
            <p>Role</p>
            <p className="text-sm">
              {user?.role === "Admin" ? "Dean" : user?.role}
            </p>
          </div>
          <div className="phone-number">
            <p>Phone Number</p>
            <p className="text-sm  ">{user?.phoneNumber}</p>
          </div>
        </div>
      </div>
      <div className="personal-details shadow-md rounded-[20px]  bg-white w-full flex flex-col gap-4 p-4">
        <div className="firstname ">
          <p>Firstname</p>
          <p className="text-sm border-solid border-[#bbbaba] border-[1px] rounded-md py-1 px-3">
            {user?.firstName}
          </p>
        </div>
        <div className="lastname ">
          <p>Lastname</p>
          <p className="text-sm border-solid border-[#bbbaba] border-[1px] rounded-md py-1 px-3">
            {user?.lastName}
          </p>
        </div>

        <div className="school-id-number">
          <p>SPC ID Number</p>
          <p className="text-sm border-solid border-[#bbbaba] border-[1px] rounded-md py-1 px-3">
            {user?.facultyIdnumber || user?.studentIdnumber}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
