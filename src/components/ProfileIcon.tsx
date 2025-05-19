import { Link } from "react-router-dom";

export default function ProfileIcon(props:{ userMenu: boolean, setUserMenu: any }) {
    const handleClick = () => {
        const isBelowBreakpoint = window.matchMedia('(max-width: 1023px)').matches;
        if (isBelowBreakpoint) {
          // clicked on Mobile or touch device
          props.setUserMenu(!props.userMenu);
        } else{
            // clicked on Desktop or non-touch device
            props.setUserMenu(true);
        }
      };
    const menuItemLinks = [
        { name: "Dashboard", link: "/dashboard", id: "" },
        { name: "Settings", link: "/settings", id: ""  },
        { name: "Sign Out", link: "/", id: "signout-btn"  },
        { name: "Sign In", link: "/login", id: ""  }
    ];

    return (
        <div className="absolute inset-y-0 right-0 flex items-center p-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 " onClick={() => handleClick()} onMouseEnter={() => props.setUserMenu(true)} onMouseLeave={() => props.setUserMenu(false)}
        >
            <div className="relative ml-3">
                <div>
                    <button type="button" className="flex rounded-full bg-green-5 text-sm focus:outline-none focus:ring focus:ring-green-2 focus:ring-offset-2 focus:ring-offset-green-5 p-0" id="user-menu-button" aria-expanded="false" aria-haspopup="true" onMouseEnter={() => props.setUserMenu(true)}
                    >
                        <span className="sr-only">Open user menu</span>
                        <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""></img>
                    </button>
                </div>

                {/* Profile dropdown */}
                {props.userMenu && <div className="hidden lg:block absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-tan-2 py-1 shadow-lg ring-1 ring-green-5 ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" onMouseEnter={() => props.setUserMenu(true)} onMouseLeave={() => props.setUserMenu(false)}>
                    {
                        menuItemLinks.map(({ name, link, id }) => (
                            <Link className='block px-4 py-2 text-md text-green-5 hover:text-green-3' id={id} to={link}> {name}</Link>
                        ))
                    }
                </div>}

            </div>
        </div>
    );
}
