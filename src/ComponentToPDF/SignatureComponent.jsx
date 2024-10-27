import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const SignatureComponent = React.forwardRef((props, reference) => {
  const { currentUser } = useAuth();
  const [signatureSrc, setSignatureSrc] = useState("");

  useEffect(() => {
    const fetchImage = async (url) => {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, url);
        const imageUrl = await getDownloadURL(storageRef);
        setSignatureSrc(imageUrl);
      } catch (error) {
        console.error("Error fetching the image:", error);
      }
    };

    if (currentUser && currentUser.eSignature) {
      fetchImage(currentUser.eSignature);
    }
  }, [currentUser]);

  return (
    <div ref={reference}>
      {signatureSrc && <img src={signatureSrc} alt="e-signature" width={300} />}
    </div>
  );
});

export default SignatureComponent;
