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
      setAvatarLink: (file: File) => Promise<void>;
      avatarUrl: string;
    }
  | undefined
>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarPath, setAvatarPath] = useState<string>("");
  const { triggerAlert } = useAlert();
  const user = useRef<any>(undefined);
  useEffect(() => {
    // initialize with old path
    const init = async () => {
      // get user data
      const { data } = await supabase.auth.getSession();
      user.current = data.session?.user;

      if (!user.current) return;

      const { data: d } = await supabase
        .from("profiles")
        .select("pfp_url")
        .eq("id", user.current.id)
        .single();
      setAvatarPath(d?.pfp_url);
    };
    init();
  }, []);
//   get new signed url when path is updated
  useEffect(() => {
    const updateAvatarUrl = async () => {
      if (!avatarPath) return;

      const { data } = await supabase.storage
        .from("avatars")
        .createSignedUrl(avatarPath, 60 * 60);

      if (data?.signedUrl) {
        setAvatarUrl(`${data.signedUrl}&cb=${Date.now()}`);
      } else {
        console.warn("No signed URL for avatarPath:", avatarPath);
      }
    };

    updateAvatarUrl();
  }, [avatarPath]);

  const setAvatarLink = async (file: File) => {
    // get supabase filepath, which will always be userid/profile
    const fileExt = file.name.split(".").pop();
    const newPath = `${user.current.id}/profile.${fileExt}`;

    // upload to supabase storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(newPath, file, {
        upsert: true,
      });

    if (uploadError) {
      triggerAlert("Upload failed");
      return;
    }

    // update url in supabase table
    const { error } = await supabase
      .from("profiles")
      .update({ pfp_url: newPath })
      .eq("id", user.current.id);
    if (error) {
      triggerAlert("Profile update failed");
      return;
    }
    triggerAlert("Successfully updated image!");
    setAvatarPath(newPath);
  };

  return (
    <UserContext.Provider value={{ setAvatarLink, avatarUrl }}>
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
