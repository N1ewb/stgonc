import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/auth/AuthContext";
// import Col from "react-bootstrap/Col";
// import Nav from "react-bootstrap/Nav";
// import Row from "react-bootstrap/Row";
// import Tab from "react-bootstrap/Tab";
import DefaultProfile from "../../../static/images/default-profile.png";
import "./Userpage.css";
import { useDB } from "../../../context/db/DBContext";
import { useStorage } from "../../../context/storage/StorageContext";
import AccountPage from "./UserPageComponents/AccountPage";
import PasswordPage from "./UserPageComponents/PasswordPage";
import NotificationPage from "./UserPageComponents/NotificationPage";
import HelpPage from "./UserPageComponents/HelpPage";

const Userpage = () => {
  const auth = useAuth();
  const db = useDB();
  const storage = useStorage();
  const [user, setUser] = useState();
  const [currentPage, setCurrentPage] = useState("Account");

  // const handleUploadImage = async (event) => {
  //   const file = event.target.files[0];
  //   if (file && auth.currentUser) {
  //     try {
  //       setLoading(true);
  //       const { imageId } = await storage.UploadImage(
  //         file,
  //         auth.currentUser.uid
  //       );
  //       setUploadedImageId(imageId);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const fetchImage = async () => {
  //     if (uploadedImageId) {
  //       try {
  //         setLoading(true);
  //         const data = await storage.RetrieveImage(uploadedImageId);
  //         setImageData(data);
  //         setError(null);
  //       } catch (err) {
  //         setError(err.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   fetchImage();
  // }, [uploadedImageId, storage]);

  const handleGetUser = async () => {
    if (auth.currentUser) {
      const user = await db.getUser(auth.currentUser.uid);
      setUser(user);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      handleGetUser();
    }
  }, []);

  return (
    <div className="Userpage-container w-full overflow-auto h-full bg-white">
      <div className="flex w-full flex-row h-[100%]">
        <div className="account-details-sidebar-container flex flex-col gap-3 basis-1/5  [&_button]:w-[80%] [&_button]:rounded-md text-center ">
          <button
            className={`hover:bg-[#320000] hover:text-white ${
              currentPage === "Account"
                ? "bg-[#720000] text-white"
                : "bg-transparent text-black "
            } `}
            onClick={() => setCurrentPage("Account")}
          >
            Account
          </button>
          <button
            className={`hover:bg-[#320000] hover:text-white ${
              currentPage === "Password"
                ? "bg-[#720000] text-white"
                : "bg-transparent text-black"
            } `}
            onClick={() => setCurrentPage("Password")}
          >
            Password
          </button>
          <button
            className={`hover:bg-[#320000] hover:text-white ${
              currentPage === "Help"
                ? "bg-[#720000] text-white"
                : "bg-transparent text-black"
            } `}
            onClick={() => setCurrentPage("Help")}
          >
            Help
          </button>
        </div>
        <div className="account-details-main-content-container h-[100%] basis-4/5">
          {currentPage === "Account" ? (
            <AccountPage user={user} useAuth={auth} db={db} />
          ) : currentPage === "Password" ? (
            <PasswordPage />
          ) : currentPage === "Notification" ? (
            <NotificationPage />
          ) : currentPage === "Help" ? (
            <HelpPage />
          ) : (
            "Page not found"
          )}
        </div>
      </div>
    </div>
  );
};

export default Userpage;
