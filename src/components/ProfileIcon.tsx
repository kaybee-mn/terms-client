import { Link, useNavigate } from "react-router-dom";
import supabase from "../api/supabaseClient";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { useUser } from "../contexts/UserContext";

export default function ProfileIcon(props: {
  userMenu: boolean;
  setUserMenu: any;
  session: Session | undefined;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const navigate = useNavigate();
  const { generateAvatarLink, avatarUrl: pfpUrl } = useUser();
  const handleClick = () => {
    const isBelowBreakpoint = window.matchMedia("(max-width: 1023px)").matches;
    if (isBelowBreakpoint) {
      // clicked on Mobile or touch device
      props.setUserMenu(!props.userMenu);
    } else {
      // clicked on Desktop or non-touch device
      props.setUserMenu(true);
    }
  };
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error Logging Out: ", error);
    } else {
      // Logged out alert
    }
    navigate("/");
  };
  async function downloadImage() {
    try {
      const newVal = await generateAvatarLink();
      console.log(newVal);
      newVal ? setAvatarUrl(newVal) : setAvatarUrl("");
    } catch (error) {
      console.log("Error downloading image");
    }
  }
  useEffect(() => {
    downloadImage();
  }, [pfpUrl]);

  function MenuItem(props: { text: string }) {
    return (
      <Link
        className="block px-4 py-2 text-md text-green-5 hover:text-green-3"
        to={`/${props.text}`}
        onClick={props.text === "Logout" ? handleLogout : undefined}
      >
        {props.text}
      </Link>
    );
  }

  return (
    <div
      className="absolute inset-y-0 right-0 flex items-center p-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 "
      onClick={() => handleClick()}
      onMouseEnter={() => props.setUserMenu(true)}
      onMouseLeave={() => props.setUserMenu(false)}
    >
      <div className="relative ml-3">
        <div>
          <button
            type="button"
            className="flex rounded-full bg-green-5 text-sm focus:outline-none focus:ring focus:ring-green-2 focus:ring-offset-2 focus:ring-offset-green-5 p-0"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
            onMouseEnter={() => props.setUserMenu(true)}
            onClick={
              !props.session
                ? () => {
                    navigate("/history");
                  }
                : undefined
            }
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="h-8 w-8 rounded-full"
              src={avatarUrl || "/default_pfp.webp"}
              alt=""
            ></img>
          </button>
        </div>

        {/* Profile dropdown */}
        {props.userMenu && props.session && (
          <div
            className="hidden lg:block absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-tan-2 py-1 shadow-lg ring-1 ring-green-5 ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
            onMouseEnter={() => props.setUserMenu(true)}
            onMouseLeave={() => props.setUserMenu(false)}
          >
            <MenuItem text="History" />
            <MenuItem text="Settings" />
            <MenuItem text="Logout" />
          </div>
        )}
      </div>
    </div>
  );
}
