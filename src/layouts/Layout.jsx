import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import Navbar from "../components/heading/Navbar";
import { useDB } from "../context/db/DBContext";
import { useChat } from "../context/chatContext/ChatContext";
import Chatbox from "../components/Chatsbox/Chatbox";
import Loading from "../components/Loading/Loading";
import { useExport } from "../context/exportContext/ExportContext";
import AppointmentData from "../ComponentToPDF/AppointmentData";

const Layout = () => {
  const auth = useAuth();
  const db = useDB();
  const chat = useChat();
  const Export = useExport()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loadedUserInfo, setLoadedUserInfo] = useState(false);

  useEffect(() => {
    const fetchUserAndRedirect = async () => {
      try {
        setLoading(true);
        if (auth.currentUser) {
          const userRole = auth?.currentUser?.role;

          setLoadedUserInfo(true);
        } else {
          setLoadedUserInfo(false);
        }
      } catch (error) {
        setError(true);
      } finally {
        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          if (loadedUserInfo && auth.currentUser) {
            navigate(`/private/${auth.currentUser.role}/dashboard`);
          } else {
            navigate("/");
          }
        }
        setLoading(false);
        setError(false);
      }
    };

    fetchUserAndRedirect();
  }, [auth.currentUser, navigate, db]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col w-full h-auto items-center">
      <Navbar />
      <main className="w-full h-auto relative">
        <div className="outlet w-full h-auto">
          <Outlet />
        </div>
        {auth.currentUser && chat.currentChatReceiver && (
          <Chatbox
            receiver={chat.currentChatReceiver}
            auth={auth}
            db={db}
            setCurrentChatReceiver={chat.setCurrentChatReceiver}
          />
        )}
        {auth.currentUser && Export.currentAppointmentData && <AppointmentData data={Export.currentAppointmentData} />}
      </main>
    </div>
  );
};

export default Layout;
