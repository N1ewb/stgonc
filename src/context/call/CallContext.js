import React, { useContext, createContext, useEffect } from "react";

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

  const WebcamOn = () => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream || null;
    }
  };

  const toggleCamera = async () => {
    try {
      if (!localStream) {
        // If localStream doesn't exist, initialize it
        const stream = await handleWaitForLocalStream();
        setLocalStream(stream);
        pc.getSenders().forEach((sender) => {
          if (sender.track.kind === "video") {
            sender.replaceTrack(stream.getVideoTracks()[0]);
          }
        });
        WebcamOn();
        return;
      }

      const videoTrack = localStream.getVideoTracks()[0];

      if (videoTrack.enabled) {
        // Turn off the camera
        videoTrack.enabled = false;
        console.log("Camera turned off");
      } else {
        // Turn on the camera
        videoTrack.enabled = true;
        console.log("Camera turned on");
      }
    } catch (error) {
      console.error("Error toggling camera:", error);
      toastMessage("Failed to toggle camera");
    }
  };

  const toggleMic = async () => {
    try {
      if (!localStream) {
        // Initialize the localStream if it doesn't exist
        const stream = await handleWaitForLocalStream();
        setLocalStream(stream);
        // Set the audio track for the peer connection
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
          // Disable the audio track
          audioTrack.enabled = false; // Disable the track instead of stopping
          console.log("Microphone turned off");
        } else {
          // Restart the microphone
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          const newAudioTrack = stream.getAudioTracks()[0];

          // Replace the old audio track with the new one in the peer connection
          pc.getSenders().forEach((sender) => {
            if (sender.track.kind === "audio") {
              sender.replaceTrack(newAudioTrack);
            }
          });

          // Update the local stream to include the new track
          const newStream = new MediaStream([
            ...localStream.getVideoTracks(),
            newAudioTrack,
          ]);
          setLocalStream(newStream);
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

      // Get existing senders
      const existingSenders = pc.getSenders();

      getLocalStream.getTracks().forEach((track) => {
        // Check if a sender for this track already exists
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

  //Create Offer
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

  const AnswerCall = async () => {
    try {
      if (!localStream || !remoteStream) {
        PcState();
        await InitializeStreams();
      }

      const callId = callInput.current.value;
      const callDoc = doc(collection(firestore, "calls"), callId);
      const answerCandidates = collection(callDoc, "answerCandidates");
      const offerCandidates = collection(callDoc, "offerCandidates");

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await addDoc(answerCandidates, event.candidate.toJSON());
        }
      };

      let callData = (await getDoc(callDoc)).data();

      while (!callData?.offer || !callData.offer.type) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        callData = (await getDoc(callDoc)).data();
      }

      const offerDescription = new RTCSessionDescription(callData.offer);
      await pc.setRemoteDescription(offerDescription);

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await updateDoc(callDoc, { answer });

      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidateData = change.doc.data();
            const candidate = new RTCIceCandidate(candidateData);
            pc.addIceCandidate(candidate).catch(console.error);
          }
        });
      });
      console.log("Remote Video Track", remoteVideoRef.current.srcObject);
      console.log("Remote stream tracks:", remoteStream.getTracks());
      console.log("PeerConnection state:", pc.connectionState);
      console.log("ICE connection state:", pc.iceConnectionState);
    } catch (error) {
      toastMessage(error.message);
    }
  };

  const hangUp = async (newCallOffer) => {
    try {
      const callId = callInput.current.value;
      const callDoc = doc(collection(firestore, "calls"), callId);
      const callOfferDoc = doc(firestore, "CallOffers", newCallOffer);

      // Stop and close the local stream
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }

      // Stop and close the remote stream
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
        setRemoteStream(new MediaStream());
      }

      // Clear video elements
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

      // Close the peer connection if not already closed
      if (pc.signalingState !== "closed") {
        pc.close();
        pc.onicecandidate = null;
        setPc(new RTCPeerConnection(servers)); // Reset PeerConnection
      }

      if (callId) {
        const updateCallOffer = { status: "ended" };
        await updateDoc(callOfferDoc, updateCallOffer);
      }
      // Delete the call document and call offer document from Firestore
      // await Promise.all([
      //   updateDoc(doc(firestore, "CallOffers", newCallOffer), {
      //     status: "ended",
      //   }),
      //   deleteDoc(callDoc),
      //   deleteDoc(callOfferDoc),
      // ]);
    } catch (error) {
      console.error("Error during hangup:", error);
      toastMessage(error.message);
    }
  };

  const offerCall = async (receiver, caller, callID) => {
    try {
      if (auth.currentUser) {
        await addDoc(callOffersRef, {
          receiver: receiver,
          caller: caller,
          callID: callID,
          status: "calling",
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCallOffer = async (offerID) => {
    if (auth.currentUser) {
      const callofferdocref = doc(firestore, "CallOffers", offerID);
      const updateCallOffer = { status: "responded" };
      await updateDoc(callofferdocref, updateCallOffer);
    }
  };

  const answerCallOffer = async (offerID) => {
    if (auth.currentUser) {
      try {
        PcState();
        const callofferdocref = doc(firestore, "CallOffers", offerID);
        const updateCallOffer = { status: "answered" };
        await updateDoc(callofferdocref, updateCallOffer);
      } catch (error) {
        console.log("Error in answering call offer", error.message);
      }
    }
  };

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

  const value = {
    PcState,
    WebcamOn,
    toggleCamera,
    toggleMic,
    CallButton,
    AnswerCall,
    hangUp,
    localVideoRef,
    remoteVideoRef,
    callInput,
    offerCall,
    updateCallOffer,
    answerCallOffer,
    subscribeToAnsweredOfferChanges,
    subscribeToCallOfferChanges,
    subscribeToRespondedCallChanges,
    remoteStream,
    localStream,
  };

  return (
    <callContext.Provider value={value}>
      {children}
      <Toaster />
    </callContext.Provider>
  );
};
