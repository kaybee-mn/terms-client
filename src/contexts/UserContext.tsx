import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import supabase from "../api/supabaseClient";
import { useAlert } from "./AlertContext";

const UserContext = createContext<
  | {
      generateAvatarLink: () => Promise<string | null>;
      setAvatarLink: (newPath: string, file: File) => Promise<void>;
      avatarUrl:string;
    }
  | undefined
>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const { triggerAlert } = useAlert();
  const user = useRef<any>(undefined);
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      user.current = data.session?.user;

      const { data: d } = await supabase
        .from("profiles")
        .select("pfp_url")
        .eq("id", user.current.id)
        .single();
      setAvatarUrl(d?.pfp_url);
    };
    init();
  }, []);

  const setAvatarLink = async (newPath: string, file: File) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      return;
    }
    const user_id = data.session.user.id;
    console.log(newPath);
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(newPath, file, {
        upsert: true,
      });

    if (uploadError) {
      triggerAlert("Upload failed");
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update({ pfp_url: newPath })
      .eq("id", user_id);
    if (error) {
      triggerAlert("Profile update failed");
    } else {
      triggerAlert("Successfully updated image!");
      setAvatarUrl(newPath);
      console.log("first")
    }
  };
  const generateAvatarLink = async () => {
    const { data } = await supabase.storage
      .from("avatars")
      .createSignedUrl(avatarUrl, 60 * 60);
    if (!data?.signedUrl) {
      console.log("no public url. path:", avatarUrl);
      return null;
    }
    //   const url = URL.createObjectURL(data.publicUrl);
    return `${data.signedUrl}&cb=${Date.now()}`;
  };

  return (
    <UserContext.Provider value={{ setAvatarLink, generateAvatarLink, avatarUrl }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("no context");
  }
  return context;
};
