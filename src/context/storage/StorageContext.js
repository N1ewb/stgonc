import { ref, uploadBytes } from "firebase/storage";
import { createContext } from "react";
import { storage } from "../../server/firebase";
import { v4 } from "uuid";

const storageContext = createContext();

export function useStorage() {
  return useContext(storageContext);
}

export function StorageProvider({ children }) {
  const UploadImage = async (userRef, imageName) => {
    const imageStorageRef = ref(storage, `images/${imageName + v4()}`);
    uploadBytes(imageStorageRef, imageName).then(() => {});
  };

  const value = {
    UploadImage,
  };

  return (
    <StorageProvider.Provider value={value}>
      {children}
    </StorageProvider.Provider>
  );
}
