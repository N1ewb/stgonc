import React, {
  useContext,
  createContext,
  useEffect,
  useCallback,
} from "react";

import { useRef, useState } from "react";
import { firestore, servers } from "../../server/firebase";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  onSnapshot,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  where,
  query,
  limit,
  orderBy,
} from "firebase/firestore";

import { useAuth } from "../auth/AuthContext";

import toast, { Toaster } from "react-hot-toast";

const callContext = createContext();

export function useCall() {
  return useContext(callContext);
}

export const CallProvider = ({ children }) => {
  const callOffersRef = collection(firestore, "CallOffers");
  const auth = useAuth();
  const toastMessage = (message) => toast(message);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const callInput = useRef();
  const [pc, setPc] = useState(new RTCPeerConnection(servers));

  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [callState, setCallState] = useState("idle");

  const resetStreams = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(new MediaStream());
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  const PcState = () => {
    if (pc.signalingState === "closed") {
      setPc(new RTCPeerConnection(servers));
    }
  };

  const handleWaitForLocalStream = async () => {
    if (!localStream) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        return stream;
      } catch (error) {
        console.error("Error accessing media devices:", error);
        throw error;
      }
    }
    return localStream;
  };

  const WebcamOn = async () => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream || null;
    }
  };

  const toggleReceiverCamera = async () => {
    try {
      if (!localStream) {
        const stream = await handleWaitForLocalStream();
        setLocalStream(stream);
        pc.getReceivers().forEach((receiver) => {
          if (receiver.track.kind === "video") {
            receiver.replaceTrack(stream.getVideoTracks()[0]);
          }
        });

        WebcamOn(); // Start the camera
        console.log("Receiver's camera is now active.");
        return;
      }

      const videoTrack = localStream.getVideoTracks()[0]; // Get the video track from the stream

      if (videoTrack.enabled) {
        videoTrack.enabled = false; // Disable the track
        console.log("Receiver's camera turned off.");
      } else {
        videoTrack.enabled = true; // Enable the track
        console.log("Receiver's camera turned on.");
      }
    } catch (error) {
      console.error("Error toggling receiver's camera:", error);
      toastMessage("Failed to toggle the receiver's camera");
    }
  };

  const toggleCamera = async () => {
    try {
      if (!localStream) {
        const stream = await handleWaitForLocalStream();
        setLocalStream(stream);

        pc.getSenders().forEach((sender) => {
          if (sender.track.kind === "video") {
            sender.removeTrack(stream.getVideoTracks()[0]);
          }
        });
        WebcamOn();
        return;
      }

      const videoTrack = localStream.getVideoTracks()[0];

      if (videoTrack.enabled) {
        videoTrack.enabled = false;
        console.log("Camera turned off");
      } else {
        videoTrack.enabled = true;
        console.log("Camera turned on");
      }
    } catch (error) {
      console.error("Error toggling camera:", error);
      toastMessage("Failed to toggle camera");
    }
  };

  const toggleRecieverMic = async () => {
    try {
      if (!localStream) {
        const stream = await handleWaitForLocalStream();
        setLocalStream(stream);
        const audioTrack = stream.getAudioTracks()[0];

        pc.getReceivers().forEach((receiver) => {
          if (receiver.track.kind === "audio") {
            receiver.replaceTrack(audioTrack);
          }
        });
        return;
      }

      const audioTrack = localStream.getAudioTracks()[0];

      if (audioTrack) {
        if (audioTrack.enabled) {
          audioTrack.enabled = false;
          console.log("Microphone turned off");
        } else {
          audioTrack.enabled = true;
          console.log("Microphone turned on");
        }
      }
    } catch (error) {
      console.error("Error toggling microphone:", error);
      toastMessage("Failed to toggle microphone");
    }
  };

  const toggleMic = async () => {
    try {
      if (!localStream) {
        const stream = await handleWaitForLocalStream();
        setLocalStream(stream);
        const audioTrack = stream.getAudioTracks()[0];

        pc.getSenders().forEach((sender) => {
          if (sender.track.kind === "audio") {
            sender.replaceTrack(audioTrack);
          }
        });
        return;
      }

      const audioTrack = localStream.getAudioTracks()[0];

      if (audioTrack) {
        if (audioTrack.enabled) {
          audioTrack.enabled = false;
          console.log("Microphone turned off");
        } else {
          audioTrack.enabled = true;
          console.log("Microphone turned on");
        }
      }
    } catch (error) {
      console.error("Error toggling microphone:", error);
      toastMessage("Failed to toggle microphone");
    }
  };

  const InitializeStreams = async () => {
    try {
      PcState();
      const getLocalStream = await handleWaitForLocalStream();
      setLocalStream(getLocalStream);

      const existingSenders = pc.getSenders();

      getLocalStream.getTracks().forEach((track) => {
        const existingSender = existingSenders.find(
          (sender) => sender.track === track
        );
        if (!existingSender) {
          pc.addTrack(track, getLocalStream);
        }
      });

      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });

        if (remoteStream.getTracks().length > 0) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      localVideoRef.current.srcObject = getLocalStream;

      console.log("remote stream", remoteStream);
      console.log("local stream", getLocalStream);
    } catch (error) {
      console.log("Track initialization error", error);
    }
  };

  const CallButton = async () => {
    try {
      PcState();
      await InitializeStreams();
      const callDoc = doc(collection(firestore, "calls"));
      const offerCandidates = collection(callDoc, "offerCandidates");
      const answerCandidates = collection(callDoc, "answerCandidates");

      callInput.current.value = callDoc.id;

      pc.onicecandidate = (event) => {
        event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription && offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await setDoc(callDoc, { offer });

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentLocalDescription && data?.answer) {
          const answerDescritpion = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescritpion);
        }
      });

      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidateData = change.doc.data();
            const candidate = new RTCIceCandidate(candidateData);
            pc.addIceCandidate(candidate);
          }
        });
      });
    } catch (error) {
      toastMessage(error.message);
    }
  };

  const AnswerCall = useCallback(async () => {
    if (callState !== "idle" && callState !== "failed") return;

    setCallState("connecting");
    let retries = 3;

    while (retries > 0) {
      try {
        // Ensure local and remote streams are initialized
        if (!localStream || !remoteStream) {
          PcState();
          await InitializeStreams();
        }

        console.log("trying, ", retries);

        // Wait for callId to be defined (max wait: 15 seconds)
        const waitForCallId = async () => {
          let timeout = 15000; // 15 seconds
          const interval = 100; // Check every 100ms
          const start = Date.now();

          while (!callInput.current.value) {
            if (Date.now() - start >= timeout) {
              throw new Error("Call ID is undefined after 15 seconds");
            }
            await new Promise((resolve) => setTimeout(resolve, interval));
          }

          return callInput.current.value;
        };

        const callId = await waitForCallId();
        console.log("Received call ID:", callId);

        // Firestore references
        const callDoc = doc(collection(firestore, "calls"), callId);
        const answerCandidates = collection(callDoc, "answerCandidates");
        const offerCandidates = collection(callDoc, "offerCandidates");

        // Handle ICE candidates
        pc.onicecandidate = async (event) => {
          if (event.candidate) {
            await addDoc(answerCandidates, event.candidate.toJSON());
          }
        };

        // Wait for offer data
        let callData = (await getDoc(callDoc)).data();

        while (!callData?.offer || !callData.offer.type) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          callData = (await getDoc(callDoc)).data();
        }

        // Set remote description and create answer
        const offerDescription = new RTCSessionDescription(callData.offer);
        await pc.setRemoteDescription(offerDescription);

        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        };

        // Update call document with the answer
        await updateDoc(callDoc, { answer });

        // Listen for additional ICE candidates
        onSnapshot(offerCandidates, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const candidateData = change.doc.data();
              const candidate = new RTCIceCandidate(candidateData);
              pc.addIceCandidate(candidate).catch(console.error);
            }
          });
        });

        // Wait for ICE connection
        await new Promise((resolve, reject) => {
          pc.oniceconnectionstatechange = () => {
            console.log("ICE Connection State:", pc.iceConnectionState);
            if (
              pc.iceConnectionState === "connected" ||
              pc.iceConnectionState === "completed"
            ) {
              resolve();
            } else if (pc.iceConnectionState === "failed") {
              reject(new Error("ICE connection failed"));
            } else if (
              pc.iceConnectionState === "disconnected" ||
              pc.connectionState === "disconnected"
            ) {
              setCallState("disconnected");
            }
          };

          setTimeout(() => {
            if (
              pc.iceConnectionState !== "connected" &&
              pc.iceConnectionState !== "completed"
            ) {
              reject(new Error("ICE connection timed out"));
            }
          }, 2000);
        });

        console.log("Call connected successfully");
        return;
      } catch (error) {
        console.error(
          `Connection attempt failed, retries left: ${retries}`,
          error
        );
        retries -= 1;

        if (retries === 0) {
          setCallState("failed");
          if (error.message.includes("Call ID is undefined")) {
            toastMessage("Call ID not provided. Please enter a valid Call ID.");
          } else {
            toastMessage("Failed to connect the call. Please try again.");
          }
          return;
        }
      }
    }
  }, [callState, localStream, remoteStream, pc]);

  const hangUp = async (newCallOffer) => {
    try {
      setCallState("disconnected");
      await disconnectAllDevices();
      const callOfferDoc = doc(firestore, "CallOffers", newCallOffer);

      if (pc && pc.signalingState !== "closed") {
        pc.close();
        setPc(null);
      }

      if (newCallOffer) {
        const updateCallOffer = { status: "ended" };
        await updateDoc(callOfferDoc, updateCallOffer);
      }
    } catch (error) {
      console.error("Error during hangup:", error);
      toastMessage(error.message);
    }
  };

  const disconnectAllDevices = async () => {
    try {
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
        setLocalStream(null);
      }

      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => {
          track.stop();
        });
        setRemoteStream(new MediaStream());
      }

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      if (pc && pc.signalingState !== "closed") {
        pc.close();
        setPc(null);
      }

      console.log("Disconnected all devices");
    } catch (error) {
      console.error("Error disconnecting all devices:", error);
      toastMessage(error.message);
    }
  };

  const cancelCall = async (callId) => {
    try {
      const callDocRef = doc(firestore, "CallOffers", callId);
      await updateDoc(callDocRef, { status: "notAnswered" });
      console.log("Cancelled call (marked as notAnswered):", callId);

      await disconnectAllDevices();

      return {
        message: "Cancelled call successfully after 30 seconds",
        status: "success",
      };
    } catch (error) {
      console.error("Error in cancelling call:", error);
      return { message: "Error in cancelling call", status: "failed" };
    }
  };

  const offerCall = async (receiver, caller, callID, appointmentID) => {
    try {
      if (auth.currentUser) {
        const docRef = await addDoc(callOffersRef, {
          appointment: appointmentID,
          receiver: receiver,
          caller: caller,
          callID: callID,
          status: "calling",
          createdAt: serverTimestamp(),
        });

        console.log("Call offer created:", docRef.id);

        const timeoutId = setTimeout(async () => {
          try {
            const docSnap = await getDoc(docRef);
            const snapStatus =
              docSnap.data().status === "calling" ||
              docSnap.data().status === "responded";
            if (docSnap.exists() && snapStatus) {
              const res = await cancelCall(docRef.id);
              return {message: res.message, status: 'failed'}
            }
          } catch (error) {
            return {message: 'Error in canceling call', status: 'failed'}
          }
        }, 15000);

        const unsubscribe = onSnapshot(docRef, (snapshot) => {
          const data = snapshot.data();
          if (data && data.status === "answered") {
            console.log("Call answered. Clearing timeout.");
            clearTimeout(timeoutId);
            unsubscribe();
          }
        });
      }
      return {message: 'Offered Call', status: 'success'}
    } catch (error) {
      return {message: 'Error in offering call', status: 'failed'}
    }
  };

  const updateCallOffer = async (offerID) => {
    if (auth.currentUser) {
      const callofferdocref = doc(firestore, "CallOffers", offerID);
      const updateCallOffer = { status: "responded" };
      await updateDoc(callofferdocref, updateCallOffer);
    }
  };

  const answerCallOffer = useCallback(
    async (offerID) => {
      if (auth.currentUser) {
        try {
          PcState();
          const callofferdocref = doc(firestore, "CallOffers", offerID);
          const updateCallOffer = { status: "answered" };
          await updateDoc(callofferdocref, updateCallOffer);
          await AnswerCall();
        } catch (error) {
          console.log("Error in answering call offer", error.message);
          setCallState("failed");
        }
      }
    },
    [auth.currentUser, PcState, AnswerCall]
  );

  const subscribeToAnsweredOfferChanges = async (callback) => {
    try {
      if (auth.currentUser) {
        const unsubscribe = onSnapshot(
          query(
            callOffersRef,
            where("caller", "==", auth.currentUser.uid),
            where("status", "==", "answered"),
            orderBy("createdAt", "desc"),
            limit(1)
          ),
          (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                const doc = change.doc;
                const data = {
                  id: doc.id,
                  ...doc.data(),
                };
                callback(data);
              }
            });
          }
        );
        return unsubscribe;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subscribeToNotAnsweredOfferChanges = async (who ,callback) => {
    try {
      if (auth.currentUser) {
        const currentTimestamp = Date.now();
        const fiveSecondsAgo = currentTimestamp - 5000; 
  
        const unsubscribe = onSnapshot(
          query(
            callOffersRef,
            where(who, "==", auth.currentUser.uid),
            where("status", "==", "notAnswered"),
            where("createdAt", ">=", new Date(fiveSecondsAgo)), 
            orderBy("createdAt", "desc"),
            limit(1)
          ),
          (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                const doc = change.doc;
                const data = {
                  id: doc.id,
                  ...doc.data(),
                };
                callback(data);
              }
            });
          }
        );
        return unsubscribe;
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const subscribeToCallOfferChanges = async (callback) => {
    try {
      if (auth.currentUser) {
        const unsubscribe = onSnapshot(
          query(
            callOffersRef,
            where("receiver", "==", auth.currentUser.uid),
            where("status", "==", "calling"),
            orderBy("createdAt", "desc"),
            limit(1)
          ),
          (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                const doc = change.doc;
                const data = {
                  id: doc.id,
                  ...doc.data(),
                };
                callback(data);
              }
            });
          },
          (error) => {
            console.error("Error fetching call offers:", error);
          }
        );
        return unsubscribe;
      } else {
        console.warn("No authenticated user found.");
      }
    } catch (error) {
      console.error("Error subscribing to call offers:", error);
    }
  };

  const subscribeToRespondedCallChanges = async (callback) => {
    try {
      if (auth.currentUser) {
        const unsubscribe = onSnapshot(
          query(
            callOffersRef,
            where("receiver", "==", auth.currentUser.uid),
            where("status", "==", "responded"),
            orderBy("createdAt", "desc"),
            limit(1)
          ),
          (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                const doc = change.doc;
                const data = {
                  id: doc.id,
                  ...doc.data(),
                };
                callback(data);
              }
            });
          }
        );
        return unsubscribe;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subscribeToCallChanges = async (callback, status) => {
    try {
      if (auth.currentUser) {
        const unsubscribe = onSnapshot(
          query(
            callOffersRef,
            where("receiver", "==", auth.currentUser.uid),
            where("status", "==", status),
            orderBy("createdAt", "desc"),
            limit(1)
          ),
          (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                const doc = change.doc;
                const data = {
                  id: doc.id,
                  ...doc.data(),
                };
                callback(data);
              }
            });
          }
        );
        return unsubscribe;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subscribeToEndCallChanges = async (callback, id) => {
    try {
      if (auth.currentUser) {
        const unsubscribe = onSnapshot(
          query(callOffersRef, where("id", "==", id)),
          (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                const doc = change.doc;
                const data = {
                  id: doc.id,
                  ...doc.data(),
                };

                callback(data);
              }
            });
          }
        );
        return unsubscribe;
      }
    } catch (error) {
      console.log("Error subscribing to call end changes:", error);
    }
  };

  const ConnectionStateHandler = useCallback(() => {
    if (pc == null) return;

    const handleConnectionStateChange = () => {
      console.log("Connection State:", pc.connectionState);

      if (
        pc.connectionState === "disconnected" ||
        pc.iceConnectionState === "disconnected"
      ) {
        setCallState("disconnected");
        console.log("Call disconnected");

        return;
      }

      if (
        pc.connectionState === "connected" ||
        pc.iceConnectionState === "connected"
      ) {
        setCallState("connected");
        console.log("Call is connected");
      }

      if (
        pc.connectionState === "connecting" ||
        pc.iceConnectionState === "connecting"
      ) {
        setCallState("connecting");
        console.log("Reconnecting...");
      }
    };

    pc.onconnectionstatechange = handleConnectionStateChange;

    return () => {
      pc.onconnectionstatechange = null;
    };
  }, [callState, pc]);

  useEffect(() => {
    if (callState) {
      ConnectionStateHandler();
    }
  }, [callState, ConnectionStateHandler]);

  const value = {
    PcState,
    WebcamOn,
    toggleCamera,
    toggleReceiverCamera,
    toggleMic,
    toggleRecieverMic,
    CallButton,
    AnswerCall,
    hangUp,
    disconnectAllDevices,
    localVideoRef,
    remoteVideoRef,
    callInput,
    offerCall,
    updateCallOffer,
    answerCallOffer,
    subscribeToCallChanges,
    subscribeToNotAnsweredOfferChanges,
    subscribeToAnsweredOfferChanges,
    subscribeToCallOfferChanges,
    subscribeToRespondedCallChanges,
    subscribeToEndCallChanges,
    remoteStream,
    localStream,
    callState,
  };

  return (
    <callContext.Provider value={value}>
      {children}
      <Toaster />
    </callContext.Provider>
  );
};
