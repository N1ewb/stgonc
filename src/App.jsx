import React from "react";
import "./App.css";
import "react-tooltip/dist/react-tooltip.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthContext";
import { DBProvider } from "./context/db/DBContext";
import { PrivateRoutes } from "./utils/protected-routes/routes";
import { CallProvider } from "./context/call/CallContext";
import { MessagingProvider } from "./context/notification/NotificationContext";
import { StorageProvider } from "./context/storage/StorageContext";
import { ChatProvider } from "./context/chatContext/ChatContext";
import { Appointmentprovider } from "./context/appointmentContext/AppointmentContext";
import { Toaster } from "react-hot-toast";
import { PrimeReactProvider } from "primereact/api";
import { ExportProvider } from "./context/exportContext/ExportContext";
import { UserListProvider } from "./context/admin/UserListContext";

import Chatroom from "./pages/chatroom/Chatroom";
import LandingPage from "./pages/landingpage/LandingPage";
import VideoCall from "./pages/videocall/VideoCall";
import SendCallReq from "./pages/videocall/SendCallReq";
import ReceiveCallReq from "./pages/videocall/ReceiveCallReq";
import AdminRegistration from "./pages/authentication/register/admin_register/AdminRegistration";
import StudentRegister from "./pages/authentication/register/student_register/Register";
import TeacherRegister from "./pages/authentication/register/teacher_register/TeacherRegister";
import Userpage from "./pages/UsersPages/UsersProfile/Userpage";
import LoginPage from "./pages/authentication/login/Login";
import Layout from "./layouts/Layout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import GuidanceCounselorLayout from "./layouts/GuidanceCounselorLayout/GuidanceCounselorLayout";
import FacultyLayout from "./layouts/FacultyLayout/FacultyLayout";
import StudentLayout from "./layouts/StudentLayout/StudentLayout";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";
import StudentDashboard from "./pages/UsersPages/student/student-pages/dashboard/StudentDashboard";
import AdminGraphs from "./pages/UsersPages/admin/admin_pages/admin_graphs/admin_graphs";
import AdminAppointmentListPage from "./pages/UsersPages/admin/admin_pages/admin_appointments/admin_appointments_list";
import AdmingPendingRegPage from "./pages/UsersPages/admin/admin_pages/admin_pending_registratons/admin_pending_reg";
import AdminSchedulesPage from "./pages/UsersPages/admin/admin_pages/admin_schedules/admin_schedules";
import AdminUserList from "./pages/UsersPages/admin/admin_pages/admin_userlist/adminUserList";
import AdminRegisteruserPage from "./pages/UsersPages/admin/admin_pages/adming_register_user/admin_reg_user";
import TeacherGraphs from "./pages/UsersPages/faculty/faculty_pages/faculty-graphs/TeacherGraphs";
import TeacherAppointmentListPage from "./pages/UsersPages/faculty/faculty_pages/faculty-appointments/TeacherAppointmentListPage";
import TeacherAppointmentReqPage from "./pages/UsersPages/faculty/faculty_pages/faculty-appointments/TeacherAppointmentReqPage";
import TeacherSchedulePage from "./pages/UsersPages/faculty/faculty_pages/schedules-page/TeacherSchedulePage";
import AdminAppointmentReqsPage from "./pages/UsersPages/admin/admin_pages/admin_appointments/AdminAppointmentReqs";
import PendingReqMessagePage from "./pages/authentication/YourRegReqisPending/PendingReqMessagePage";
import NotificationPage from "./pages/Notifications/notifications-page/NotificationPage";
import ExportToPDF from "./ComponentToPDF/ExportComponentToPDF";
import StudentAppointments from "./pages/UsersPages/student/student-pages/student-appointments/StudentAppointments";
import StudentPendingAppointments from "./pages/UsersPages/student/student-pages/student-pending-appointments/StudentPendingAppointments";
import StudentApptArchive from "./pages/UsersPages/student/student-pages/student-appointments-archive/StudentApptArchive";
import Chatslist from "./pages/messages/Messages";
import EndCallPage from "./pages/videocall/EndCallPage";
import FacultyEndCallPage from "./pages/videocall/FacultyEndCallPage";
import StudentCounselingServices from "./pages/UsersPages/GuidanceCounselor/GuidancePages/StudentCounselingServices/StudentCounselingServices";
import GuidanceRegister from "./pages/authentication/register/guidance_register/GuidanceRegister";
import GuidanceDashboard from "./pages/UsersPages/GuidanceCounselor/GuidancePages/GuidanceDashboard";
import GuidanceAppointments from "./pages/UsersPages/GuidanceCounselor/GuidancePages/GuidanceAppointments/GuidanceAppointments";
import GuidanceAppointmentReq from "./pages/UsersPages/GuidanceCounselor/GuidancePages/GuidanceAppointments/GuidanceAppointmentReq";
import GuidanceSchedules from "./pages/UsersPages/GuidanceCounselor/GuidancePages/GuidanceSchedules";
import Referal from "./pages/UsersPages/GuidanceCounselor/GuidancePages/StudentCounselingServices/Referal";
import Walkin from "./pages/UsersPages/GuidanceCounselor/GuidancePages/StudentCounselingServices/Walkin";
import AdminWalkinLayout from "./pages/UsersPages/admin/admin_pages/admin_walkins/AdminWalkinLayout";
import WalkinApptList from "./pages/UsersPages/admin/admin_pages/admin_walkins/walkin-pages/WalkinApptList";
import WalkinForm from "./pages/UsersPages/admin/admin_pages/admin_walkins/walkin-pages/WalkinForm";
import WalkinScheduleAppt from "./pages/UsersPages/admin/admin_pages/admin_walkins/walkin-pages/WalkinScheduleAppt";
import WalkinPendingAppointment from "./pages/UsersPages/admin/admin_pages/admin_walkins/walkin-pages/WalkinPendingAppointment";
import SCSDashboard from "./pages/UsersPages/GuidanceCounselor/GuidancePages/StudentCounselingServices/SCSDashboard";
import GuidanceAppointmentDashboard from "./pages/UsersPages/GuidanceCounselor/GuidancePages/GuidanceAppointments/GuidanceAppointmentDashboard";
import GuidanceAppointmentArchive from "./pages/UsersPages/GuidanceCounselor/GuidancePages/GuidanceAppointments/GuidanceAppointmentArchive";
import DeanAppointments from "./pages/UsersPages/admin/admin_pages/admin_appointments/Dean_appointments";
import DeanAppointmentAchive from "./pages/UsersPages/admin/admin_pages/admin_appointments/DeanAppointmentAchive";
import ErrorPage from "./pages/Error/ErrorPage";
import DeanFollowupAppointments from "./pages/UsersPages/admin/admin_pages/admin_appointments/DeanFollowupAppointments";
import StudentInfoFromTGP from "./pages/UsersPages/STG-Info/StudentInfoFromTGP";
import GuidanceFollowupAppointments from "./pages/UsersPages/GuidanceCounselor/GuidancePages/GuidanceAppointments/GuidanceFollowupAppointments";
import TeacherAppointments from "./pages/UsersPages/faculty/faculty_pages/faculty-appointments/TeacherAppointments";
import TeacherAppointmentFollowups from "./pages/UsersPages/faculty/faculty_pages/faculty-appointments/TeacherAppointmentFollowups";
import TeacherAppointmentArchive from "./pages/UsersPages/faculty/faculty_pages/faculty-appointments/TeacherAppointmentArchive";
import GuidanceEndcallPage from "./pages/videocall/GuidanceEndCallPage";
import AddFollowupRecord from "./pages/UsersPages/GuidanceCounselor/GuidancePages/StudentCounselingServices/AddFollowupRecord";
import FullRecordInfo from "./pages/UsersPages/GuidanceCounselor/GuidancePages/StudentCounselingServices/FullRecordInfo";
import ResetPassword from "./pages/authentication/resetpassword/ResetPassword";
import AboutUs from "./pages/miscPages/AboutUs";
import ContactUs from "./pages/miscPages/ContactUs";
import { ReschedProvider } from "./context/appointmentContext/ReschedContext";
import NotAnsweredPage from "./pages/videocall/NotAnsweredPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/Aboutus",
          element: <AboutUs />,
        },
        {
          path: "/Contactus",
          element: <ContactUs />,
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
        {
          path: "/private",
          element: <PrivateRoutes />,
          children: [
            {
              path: "/private/Admin",
              element: <AdminLayout />,
              children: [
                {
                  path: "/private/Admin/dashboard",
                  element: <AdminGraphs />,
                },
                {
                  path: "/private/Admin/dashboard/walkins",
                  element: <AdminWalkinLayout />,
                  children: [
                    {
                      path: "/private/Admin/dashboard/walkins",
                      element: <WalkinApptList />,
                    },
                    {
                      path: "/private/Admin/dashboard/walkins/data-form",
                      element: <WalkinForm />,
                    },
                    {
                      path: "/private/Admin/dashboard/walkins/schedule-form",
                      element: <WalkinScheduleAppt />,
                    },
                    {
                      path: "/private/Admin/dashboard/walkins/pending-walkin-appointments",
                      element: <WalkinPendingAppointment />,
                    },
                  ],
                },
                {
                  path: "/private/Admin/appointments",
                  element: <DeanAppointments />,
                  children: [
                    {
                      path: "/private/Admin/appointments/list",
                      element: <AdminAppointmentListPage />,
                    },
                    {
                      path: "/private/Admin/appointments/requests",
                      element: <AdminAppointmentReqsPage />,
                    },
                    {
                      path: "/private/Admin/appointments/archive",
                      element: <DeanAppointmentAchive />,
                    },
                    {
                      path: "/private/Admin/appointments/students-info",
                      element: <StudentInfoFromTGP />,
                    },
                    {
                      path: "/private/Admin/appointments/followup",
                      element: <DeanFollowupAppointments />,
                    },
                  ],
                },
                {
                  path: "/private/Admin/dashboard/pending-registrations",
                  element: <AdmingPendingRegPage />,
                },
                {
                  path: "/private/Admin/dashboard/schedules",
                  element: <AdminSchedulesPage />,
                },
                {
                  path: "/private/Admin/dashboard/user-list",
                  element: <AdminUserList />,
                },
                {
                  path: "/private/Admin/dashboard/register-user",
                  element: <AdminRegisteruserPage />,
                },
                {
                  path: "/private/Admin/notifications",
                  element: <NotificationPage />,
                },
                {
                  path: "/private/Admin/export-components",
                  element: <ExportToPDF />,
                },
                {
                  path: "/private/Admin/messages",
                  element: <Chatslist />,
                },
              ],
            },
            {
              path: "/private/Guidance",
              element: <GuidanceCounselorLayout />,
              children: [
                {
                  path: "/private/Guidance/dashboard",
                  element: <GuidanceDashboard />,
                },
                {
                  path: "/private/Guidance/student-counseling-services",
                  element: <StudentCounselingServices />,
                  children: [
                    {
                      path: "/private/Guidance/student-counseling-services",
                      element: <SCSDashboard />,
                    },
                    {
                      path: "/private/Guidance/student-counseling-services/add-followup-record",
                      element: <AddFollowupRecord />,
                    },
                    {
                      path: "/private/Guidance/student-counseling-services/view-appointment-record",
                      element: <FullRecordInfo />,
                    },
                    {
                      path: "/private/Guidance/student-counseling-services/Walkin",
                      element: <Walkin />,
                    },
                    {
                      path: "/private/Guidance/student-counseling-services/Referal",
                      element: <Referal />,
                    },
                  ],
                },
                {
                  path: "/private/Guidance/appointments",
                  element: <GuidanceAppointmentDashboard />,
                  children: [
                    {
                      path: "/private/Guidance/appointments/list",
                      element: <GuidanceAppointments />,
                    },
                    {
                      path: "/private/Guidance/appointments/request",
                      element: <GuidanceAppointmentReq />,
                    },
                    {
                      path: "/private/Guidance/appointments/archive",
                      element: <GuidanceAppointmentArchive />,
                    },
                    {
                      path: "/private/Guidance/appointments/followup",
                      element: <GuidanceFollowupAppointments />,
                    },
                    {
                      path: "/private/Guidance/appointments/students-info",
                      element: <StudentInfoFromTGP />,
                    },
                  ],
                },

                {
                  path: "/private/Guidance/schedules",
                  element: <GuidanceSchedules />,
                },
                {
                  path: "/private/Guidance/notifications",
                  element: <NotificationPage />,
                },
              ],
            },
            {
              path: "/private/Faculty",
              element: <FacultyLayout />,
              children: [
                {
                  path: "/private/Faculty/dashboard",
                  element: <TeacherGraphs />,
                },
                {
                  path: "/private/Faculty/appointments",
                  element: <TeacherAppointments />,
                  children: [
                    {
                      path: "/private/Faculty/appointments/list",
                      element: <TeacherAppointmentListPage />,
                    },
                    {
                      path: "/private/Faculty/appointments/requests",
                      element: <TeacherAppointmentReqPage />,
                    },
                    {
                      path: "/private/Faculty/appointments/followup",
                      element: <TeacherAppointmentFollowups />,
                    },
                    {
                      path: "/private/Faculty/appointments/archive",
                      element: <TeacherAppointmentArchive />,
                    },
                    {
                      path: "/private/Faculty/appointments/students-info",
                      element: <StudentInfoFromTGP />,
                    },
                  ],
                },

                {
                  path: "/private/Faculty/schedules",
                  element: <TeacherSchedulePage />,
                },
                {
                  path: "/private/Faculty/notifications",
                  element: <NotificationPage />,
                },
                {
                  path: "/private/Faculty/messages",
                  element: <Chatslist />,
                },
              ],
            },
            {
              path: "/private/Student",
              element: <StudentLayout />,
              children: [
                {
                  path: "/private/Student/dashboard",
                  element: <StudentDashboard />,
                },
                {
                  path: "/private/Student/dashboard/appointments",
                  element: <StudentAppointments />,
                },
                {
                  path: "/private/Student/dashboard/pending-appointments",
                  element: <StudentPendingAppointments />,
                },
                {
                  path: "/private/Student/dashboard/appointments-archive",
                  element: <StudentApptArchive />,
                },
                {
                  path: "/private/Student/notifications",
                  element: <NotificationPage />,
                },
                {
                  path: "/private/Student/messages",
                  element: <Chatslist />,
                },
              ],
            },

            {
              path: "/private/VideoCall",
              element: <VideoCall />,
            },
            {
              path: "/private/SendCallReq",
              element: <SendCallReq />,
            },
            {
              path: "/private/ReceiveCallReq",
              element: <ReceiveCallReq />,
            },
            {
              path: "/private/notAnswered",
              element: <NotAnsweredPage />,
            },
            {
              path: "/private/Chatroom",
              element: <Chatroom />,
            },
            {
              path: "/private/Userpage",
              element: <Userpage />,
            },
            {
              path: "/private/end-call-page",
              element: <FacultyEndCallPage />,
            },
            {
              path: "/private/Endcallpage",
              element: <EndCallPage />,
            },
            {
              path: "/private/GuidanceEndcallPage",
              element: <GuidanceEndcallPage />,
            },
          ],
        },
        {
          path: "/auth",
          element: <AuthLayout />,
          children: [
            {
              path: "/auth/Login",
              element: <LoginPage />,
            },
            {
              path: "/auth/StudentRegistration",
              element: <StudentRegister />,
            },
            {
              path: "/auth/FacultyRegistration",
              element: <TeacherRegister />,
            },
            {
              path: "/auth/AdminRegister",
              element: <AdminRegistration />,
            },
            {
              path: "/auth/GuidanceRegister",
              element: <GuidanceRegister />,
            },
            {
              path: "/auth/PendingRequestMessage",
              element: <PendingReqMessagePage />,
            },
            {
              path: "/auth/Resetpassword",
              element: <ResetPassword />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <MessagingProvider>
        <DBProvider>
          <CallProvider>
            <StorageProvider>
              <ChatProvider>
                <Appointmentprovider>
                  <PrimeReactProvider>
                    <UserListProvider>
                      <ExportProvider>
                        <ReschedProvider>
                          <div className="App h-full w-full bg-[#320000] overflow-auto relative">
                            <RouterProvider router={router} />
                            <Toaster />
                          </div>
                        </ReschedProvider>
                      </ExportProvider>
                    </UserListProvider>
                  </PrimeReactProvider>
                </Appointmentprovider>
              </ChatProvider>
            </StorageProvider>
          </CallProvider>
        </DBProvider>
      </MessagingProvider>
    </AuthProvider>
  );
}

export default App;
