import { createContext, ReactNode } from "react";
import supabase from "../api/supabaseClient";
import { useAlert } from "./AlertContext";

const UserContext = createContext<
  | {
      getAvatarLink: () => string;
      setAvatarLink: (newPath: string, file: File) => void;
    }
  | undefined
>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { triggerAlert } = useAlert();
  const setAvatarLink = async (newPath: string, file: File) => {
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(newPath, file, {
        upsert: true,
      });

    if (uploadError) {
      triggerAlert("Upload failed!");
      throw uploadError;
    }
  };
  const getAvatarLink = () => {
    return "link";
  };

  return (
    <UserContext.Provider value={{ setAvatarLink, getAvatarLink }}>
      {children}
    </UserContext.Provider>
  );
};
