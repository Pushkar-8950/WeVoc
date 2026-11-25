import "./Sidebar.css";
import Avatar from "./Avatar";

import {
    BookmarkIcon,
    BrandMarkIcon,
    BellIcon,
    CommunityIcon,
    HomeIcon,
    MessageIcon,
    MicIcon,
    ProfileIcon,
    SearchIcon,
    SettingsIcon,
    UsersIcon,
} from "./Icons";

import { useApp } from "../context/AppContext";


const NAV_ITEMS = [
    {
        id: "feed",
        icon: HomeIcon,
        label: "Home",
    },
    {
        id: "explore",
        icon: SearchIcon,
        label: "Explore",
    },
    {
        id: "notifs",
        icon: BellIcon,
        label: "Notifications",
    },
    {
        id: "dms",
        icon: MessageIcon,
        label: "Messages",
    },
    {
        id: "communities",
        icon: CommunityIcon,
        label: "Communities",
    },
    {
        id: "bookmarks",
        icon: BookmarkIcon,
        label: "Saved",
    },
    {
        id: "friends",
        icon: UsersIcon,
        label: "Friends",
    },
    {
        id: "profile",
        icon: ProfileIcon,
        label: "Profile",
    },
];


export default function Sidebar() {

    const {
        page,
        navTo,
        user,
        logout,
    } = useApp();


    const handleLogout = async () => {

        try {

            await logout();

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    };


    return (

        <aside className="sidebar">




            <div
                className="sidebar-logo"
                onClick={() =>
                    navTo("feed")
                }
            >
                <span className="logo-icon">
                    <BrandMarkIcon />
                </span>
                <span className="logo-wordmark">
                    We<span className="brand-highlight">V</span>oc
                </span>
            </div>




<nav>

    <ul className="nav-list">

        {NAV_ITEMS.map(
            (item) => {

                const Icon =
                    item.icon;


                return (

                    <li
                        key={item.id}
                        className="nav-item"
                    >

                        <button
                            className={`nav-btn${
                                page === item.id
                                    ? " active"
                                    : ""
                            }`}
                            onClick={() =>
                                navTo(item.id)
                            }
                        >

                            <span className="nav-btn-icon">
                                <Icon />
                            </span>


                            <span className="nav-btn-label">
                                {item.label}
                            </span>

                        </button>

                    </li>

                );

            }
        )}




        {user?.role === "admin" && (

            <li className="nav-item">

                <button
                    className={`nav-btn${
                        page === "admin"
                            ? " active"
                            : ""
                    }`}
                    onClick={() =>
                        navTo("admin")
                    }
                >

                    <span className="nav-btn-icon">
                        <SettingsIcon />
                    </span>


                    <span className="nav-btn-label">
                        Admin Panel
                    </span>

                </button>

            </li>

        )}

    </ul>

</nav>



            <button
                className="sidebar-post-btn"
                onClick={() =>
                    navTo("feed")
                }
            >

                <MicIcon />

                <span>
                    New Voice Post
                </span>

            </button>




            <div
                className="sidebar-profile"
            >

                <div
                    onClick={() =>
                        navTo("profile")
                    }
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flex: 1,
                        minWidth: 0,
                        cursor: "pointer",
                    }}
                >

                    <Avatar
                        name={
                            user?.fullname ||
                            "User"
                        }
                        src={
                            user?.avatar
                        }
                        size="sm"
                    />


                    <div className="sidebar-profile-text">

                        <div className="sidebar-profile-name">

                            {
                                user?.fullname ||
                                "User"
                            }

                        </div>


                        <div className="sidebar-profile-handle">

                            @
                            {
                                user?.username ||
                                "user"
                            }

                        </div>

                    </div>

                </div>




<button
    type="button"
    className="sidebar-logout"
    onClick={handleLogout}
    title="Logout"
>
    Logout
</button>


            </div>

        </aside>

    );

}