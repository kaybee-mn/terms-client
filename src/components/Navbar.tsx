import { useEffect, useState,useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileIcon from "./ProfileIcon";
import supabase from "../api/supabaseClient";
import { Session } from "react-router-dom";

export default function Navbar() {
  const active = useLocation().pathname;
  const session = useRef<any>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      session.current = s;
    });
  });
  const [userMenu, setUserMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const mobileLink = (ref: string, title: string, id: string) => {
    return (
      <Link
        id={id}
        to={ref}
        className="bg-tan-2 px-8 py-2 rounded text-tan-4 border-[0.005rem] border-transparent m-4  hover:text-green-4 hover:border-green-3 duration-200 block font-medium text-center text-xl"
      >
        {title}
      </Link>
    );
  };

  const activeLink =
    "bg-tan-2 text-green-5 rounded-md px-3 py-2 text-xl font-medium ";
  const inactiveLink =
    "text-tan-2 rounded-md px-3 py-2 text-lg font-medium hover:text-tan-3";

  return (
    <nav className="bg-green-5 fixed w-screen">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div
            className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start "
            onClick={() => {
              if (window.matchMedia("(max-width: 1023px)").matches) {
                setMobileMenu(!mobileMenu);
              }
            }}
            onMouseLeave={() => setMobileMenu(false)}
          >
            {/* logo */}
            <Link to="/" className="flex flex-shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="SimpleTerms"
              ></img>
            </Link>
            {/* Nav buttons */}
            <div className="hidden sm:ml-6 lg:block">
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className={active === "/" ? activeLink : inactiveLink}
                >
                  Home
                </Link>
                <Link
                  to="/history"
                  className={active === "/history" ? activeLink : inactiveLink}
                >
                  History
                </Link>
              </div>
            </div>
          </div>
          <ProfileIcon userMenu={userMenu} setUserMenu={setUserMenu} session={session.current} />
        </div>
      </div>
      {/* phone menu */}
      <div className="block lg:hidden" id="mobile-menu">
        <div className="">
          {mobileMenu && mobileLink("/", "Home", "")}
          {(mobileMenu || userMenu) && mobileLink("/history", "History", "")}
          {userMenu && mobileLink("/settings", "Settings", "")}
          {userMenu && mobileLink("/", "Sign Out", "signout-btn")}
        </div>
      </div>
    </nav>
  );
}
