import React, { useEffect, useState } from "react";
import Close from "../../static/images/close-dark.png";
import { useAppointment } from "../../context/appointmentContext/AppointmentContext";
import { useDB } from "../../context/db/DBContext";
import { useReschedDialog } from "../../context/appointmentContext/ReschedContext";
import toast from "react-hot-toast";

const AppointmentInfo = ({ positiveClick, negativeClick }) => {
  const db = useDB();
  const { currentAppointment, setCurrentAppointment } = useAppointment();
  const { handleToggleReschedDialog } = useReschedDialog();
  const [appointee, setAppointee] = useState(null);
  const [status, setStatus] = useState(null);

  const handleGetUser = async (uid) => {
    try {
      const user = await db.getUser(uid);
      setAppointee(user);
    } catch (error) {
      console.log(`Error in retrieving user data: ${error.message}`);
    }
  };

  const handleAcceptResched = async () => {
    try {
      const res = await db.acceptResched(
        currentAppointment.id,
        currentAppointment.appointee
      );
      if (res.status === "success") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error in accepting new schedule");
    }
  };

  useEffect(() => {
    if (currentAppointment?.appointee) {
      handleGetUser(currentAppointment.appointee);
      setStatus(currentAppointment.appointmentStatus);
    }
  }, [currentAppointment?.appointee]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // negativeClick({
  //   id: currentAppointment.id,
  //   receiver: appointee?.userID || appointee,
  //   reason: "Bala ka jan",
  // })

  if (!currentAppointment) {
    return null;
  }

  return (
    <div className="appointment-info w-full h-full flex flex-col text-[#320000]">
      <div className="appointment-info-header  w-full flex flex-row justify-between items-center p-2 rounded-md border-b-[1px] border-solid border-[#d1d1d1d1] mb-5">
        <h3 className="capitalize m-0">
          <span className="font-semibold">
            {status && status === "Accepted"
              ? "Appointment"
              : status === "Pending"
              ? "Request"
              : status === "Followup"
              ? "Follow Up"
              : status === "Finished"
              ? "Finished"
              : "No"}
          </span>{" "}
          <span className="font-light">Information</span>
        </h3>
        <button
          className="bg-transparent font-bold text-[#320000]"
          onClick={() => setCurrentAppointment(null)}
        >
          <img src={Close} alt="close" height={20} width={20} />
        </button>
      </div>
      <div className="appointment-info-body [&_span]:text-[13px] capitalize">
        {currentAppointment?.isRescheduled && (
          <p className="p-3 bg-[#7200007a] flex-1 rounded-md text-white text-center">
            {`${appointee?.firstName} ${appointee?.lastName} `} Appealed to
            reschedule appointment on{" "}
            {formatDate(currentAppointment.newSched.appointmentDate)},{" "}
            {currentAppointment.newSched.appointmentsTime.appointmentStartTime}{" "}
            - {currentAppointment.newSched.appointmentsTime.appointmentEndTime}
          </p>
        )}

        <p>
          <span className="text-[#320000] font-bold ">Student Name:</span>{" "}
          {`${appointee?.firstName} ${appointee?.lastName} `}
        </p>
        <p>
          <span className="text-[#320000] font-bold ">
            Student Phone Number:
          </span>{" "}
          {appointee?.phoneNumber}
        </p>
        <p>
          <span className="text-[#320000] font-bold">Student Concern:</span>
          <br></br>
          {currentAppointment.appointmentConcern}
        </p>
        {status && status === "Cancelled" && (
          <p className="p-5 bg-[#9a24247d] rounded-md text-white font-semibold">
            This student cancelled their counselling appointment
          </p>
        )}
        <div className="flex flex-row gap-3">
          <p className="capitalize">
            <span className="text-[#320000] font-bold">Type:</span>{" "}
            {currentAppointment.appointmentType}
          </p>
          <p>
            <span className="text-[#320000] font-bold">Date:</span>{" "}
            {formatDate(currentAppointment.appointmentDate)}
          </p>
          <p>
            <span className="text-[#320000] font-bold">Time:</span>{" "}
            {`${currentAppointment.appointmentsTime.appointmentStartTime}:00 - ${currentAppointment.appointmentsTime.appointmentEndTime}:00`}
          </p>
        </div>
      </div>
      {status && (
        <div className="appointment-info-footer w-full flex flex-row items-end justify-end gap-3">

          {status === "Pending" && (
            <>
              {!currentAppointment.isRescheduled ? (
                <>
                  <button
                    className="m-0 py-2 px-5 bg-[#57a627] rounded-md"
                    onClick={() =>
                      positiveClick({
                        id: currentAppointment.id,
                        receiver: appointee?.userID || appointee,
                        date: Date.now(),
                      })
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="m-0 py-2 px-5 bg-[#720000] rounded-md"
                    onClick={() =>
                      handleToggleReschedDialog(currentAppointment)
                    }
                  >
                    Re-Sched
                  </button>{" "}
                </>
              ) : (
                <>
                  <button
                    className="m-0 py-2 px-5 bg-[#57a627] rounded-md"
                    onClick={handleAcceptResched}
                  >
                    Accept New Schedule
                  </button>
                  <button
                    className="m-0 py-2 px-5 bg-[#720000] rounded-md"
                    onClick={() =>
                      handleToggleReschedDialog(currentAppointment)
                    }
                  >
                    Re-Sched
                  </button>
                </>
              )}
            </>
          )}
          {status === "Accepted" && !currentAppointment.isRescheduled && (
            <>
              <button
                className="m-0 py-2 px-5 bg-[#57a627] rounded-md"
                onClick={() =>
                  positiveClick({
                    id: currentAppointment.id,
                    receiver: appointee?.userID || appointee,
                    date: Date.now(),
                  })
                }
              >
                Finish
              </button>
              <button
                className="m-0 py-2 px-5 bg-[#720000] rounded-md"
                onClick={() => handleToggleReschedDialog(currentAppointment)}
              >
                Re-Sched
              </button>
            </>
          )}
          {status === "Followup" && (
            <>
              <button
                className="m-0 py-2 px-5 bg-[#57a627] rounded-md"
                onClick={() =>
                  positiveClick({
                    id: currentAppointment.id,
                    receiver: appointee?.userID || appointee,
                    date: Date.now(),
                  })
                }
              >
                Finish
              </button>
              <button
                className="m-0 py-2 px-5 bg-[#720000] rounded-md"
                onClick={() => handleToggleReschedDialog(currentAppointment)}
              >
                Re-Sched
              </button>
            </>
          )}
          {status === "Cancelled" && (
            <button className="m-0 py-2 px-5 bg-gray-500 rounded-md">
              Dismissed
            </button>
          )}
          {status === "Finished" && (
            <p className="text-green-600 font-semibold">
              Appointment Completed
            </p>
          )}
          {status === "Re-Scheduled" && (
            <button className="m-0 py-2 px-5 bg-[#57a627] rounded-md">
              View New Schedule
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentInfo;
