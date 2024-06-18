import React, { useContext, createContext } from "react";

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

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const callInput = useRef();
  const [pc, setPc] = useState(new RTCPeerConnection(servers));

  const PcState = () => {
    if (pc.signalingState === "closed") {
      setPc(new RTCPeerConnection(servers));
    }
  };

  const WebcamOn = async () => {
    PcState();
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };
    try {
      localVideoRef.current.srcObject = localStream;
      remoteVideoRef.current.srcObject = remoteStream;
    } catch (error) {
      console.log(error);
    }
  };

  //Create Offer
  const CallButton = async () => {
    PcState();
    const callDoc = doc(collection(firestore, "calls"));
    const offerCandidates = collection(callDoc, "offerCandidates");
    const answerCandidates = collection(callDoc, "answerCandidates");

    callInput.current.value = callDoc.id;
    console.log(callDoc.id);

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
  };

  const AnswerCall = async () => {
    PcState();
    const callId = callInput.current.value;
    const callDoc = doc(collection(firestore, "calls"), callId);
    const answerCandidates = collection(callDoc, "answerCandidates");
    const offerCandidates = collection(callDoc, "offerCandidates");

    pc.onicecandidate = async (event) => {
      event.candidate &&
        (await addDoc(answerCandidates, event.candidate.toJSON()));
    };

    const callData = (await getDoc(callDoc)).data();

    const offerDescription = callData && callData.offer;
    await pc.setRemoteDescription(
      new RTCSessionDescription(callData && offerDescription)
    );

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription && answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await updateDoc(callDoc, { answer });

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidateData = change.doc.data(); // Access data correctly
          const candidate = new RTCIceCandidate(candidateData);
          pc.addIceCandidate(candidate);
        }
      });
    });
  };

  const hangUp = async (newCalloffer) => {
    const callId = callInput.current.value;
    const callDoc = doc(collection(firestore, "calls"), callId);
    const callOfferDoc = doc(collection(firestore, "CallOffers"), callId);
    try {
      pc.close();
      const callofferdocref = doc(firestore, "CallOffers", newCalloffer);
      const updateCallOffer = { status: "ended" };
      await updateDoc(callofferdocref, updateCallOffer);
      await deleteDoc(callDoc);
      await deleteDoc(callOfferDoc);
      pc.onicecandidate = null;

      localVideoRef.current.srcObject = null;
      remoteVideoRef.current.srcObject = null;
    } catch (error) {
      console.error("Error during hangup:", error);
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
      const callofferdocref = doc(firestore, "CallOffers", offerID);
      const updateCallOffer = { status: "answered" };
      await updateDoc(callofferdocref, updateCallOffer);
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
          }
        );
        return unsubscribe;
      }
    } catch (error) {
      console.log(error);
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
  };

  return (
    <callContext.Provider value={value}>
      {children}
      <Toaster />
    </callContext.Provider>
  );
};
