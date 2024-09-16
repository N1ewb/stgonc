import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import Navbar from "../components/heading/Navbar";
import { useDB } from "../context/db/DBContext";
import { useChat } from "../context/chatContext/ChatContext";
import Chatbox from "../components/Chatsbox/Chatbox";

const Layout = () => {
  const auth = useAuth();
  const db = useDB();
  const chat = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndRedirect = async () => {
      if (auth.currentUser) {
        try {
          const user = await db.getUser(auth.currentUser.uid);
          if (user) {
            const userRole = user.role;
            console.log(userRole);
            if (userRole === "Student") {
              navigate("/private/student/dashboard");
            } else if (userRole === "Teacher") {
              navigate("/private/faculty/dashboard");
            } else if (userRole === "Admin") {
              navigate("/private/admin/dashboard");
            } else if (userRole === "GuidanceCounsellor") {
              navigate("/private/guidance-counselor/dashboard");
            } else {
              navigate("/");
            }
          } else {
            console.error("User not found or failed to fetch user details.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserAndRedirect();
  }, [auth.currentUser, navigate]);

  return (
    <div className="flex flex-col w-full h-auto">
      <Navbar />
      <main className="w-full h-auto">
        <div className="outlet w-full h-auto">
          <Outlet />
        </div>
        {chat.currentChatReceiver && (
          <Chatbox
            receiver={chat.currentChatReceiver}
            auth={auth}
            db={db}
            setCurrentChatReceiver={chat.setCurrentChatReceiver}
          />
        )}
      </main>
    </div>
  );
};

export default Layout;
