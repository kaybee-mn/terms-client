import AuthWrapper from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import supabase from "../api/supabaseClient";
import Avatar from "../components/Settings/Avatar";
import { Session } from "@supabase/supabase-js";
import Toggle from "../components/Toggle";

export default function Settings() {
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(true);
  const [avatar_url, setAvatarUrl] = useState<string>("");
  const [highContrast, setHighContrast] = useState<boolean>(false);

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    }

    getSession();
  }, []);
  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      if (!session) {
        return;
      }
      const { user } = session;
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();
      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setAvatarUrl(data.pfp_url);
          setHighContrast(data.high_contrast_theme);
        }
      }
      setLoading(false);
    }
    getProfile();
    return () => {
      ignore = true;
    };
  }, [session]);
  async function updateProfile(event: React.FormEvent, avatarUrl: string) {
    if (!session) {
      return;
    }
    event.preventDefault();
    setLoading(true);
    const { user } = session;
    const updates = {
      pfp_url: avatarUrl,
    };
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);
    if (error) {
      alert(error.message);
    } else {
      setAvatarUrl(avatarUrl);
    }
    setLoading(false);
  }
  const handleSubmit = (e: React.FormEvent) => {
    console.log("submitted");
    e.preventDefault();
    updateProfile(e, avatar_url);
  };
  return (
    <AuthWrapper>
      <div className="flex items-center justify-center text-center h-full">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-y-4 place-items-center"
        >
          <div className="rounded width-[30%] height-[30%]">
            <Avatar />
          </div>

          <span className="ml-3 text-xl font-medium text-green-5 ">
            {highContrast ? "Simplified" : "Detailed"}
          </span>
          <Toggle toggle={highContrast} setToggle={setHighContrast} />
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              value={session?.user.email}
              disabled
            />
          </div>
          <div>
            <button
              className="button block primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading ..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </AuthWrapper>
  );
}
