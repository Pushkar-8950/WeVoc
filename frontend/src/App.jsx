import "./App.css";
import { AppProvider, useApp } from "./context/AppContext";
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import ExplorePage from "./pages/ExplorePage";
import NotificationsPage from "./pages/NotificationsPage";
import DmsPage from "./pages/DmsPage";
import FriendsPage from "./pages/FriendsPage";
import BookmarksPage from "./pages/BookmarksPage";
import CommunitiesPage from "./pages/CommunitiesPage";
import AdminPage from "./pages/AdminPage";
import { LockIcon } from "./components/Icons";



function PageRenderer() {

    const { page } = useApp();

    const map = {

        feed: <FeedPage />,

        profile: <ProfilePage />,

        user: <UserProfilePage />,

        explore: <ExplorePage />,

        notifs: <NotificationsPage />,

        dms: <DmsPage />,

        friends: <FriendsPage />,

        bookmarks: <BookmarksPage />,

        communities: <CommunitiesPage />,

    };

    return map[page] ?? <FeedPage />;
}



const NO_RIGHT = [
    "dms",
];



export default function App() {

    return (

        <AppProvider>

            <AppShell />

        </AppProvider>

    );
}



function AppShell() {

    const {
        user,
        authLoading,
        page,
    } = useApp();


    const [authPage, setAuthPage] =
        useState("login");



    if (authLoading) {

        return (

            <div className="auth-loading">
                Loading...
            </div>

        );

    }



    if (!user) {

        if (authPage === "register") {

            return (

                <RegisterPage
                    onLogin={() =>
                        setAuthPage("login")
                    }
                />

            );

        }

        return (

            <LoginPage
                onRegister={() =>
                    setAuthPage("register")
                }
            />

        );

    }



    /*
       IMPORTANT:

       Admin ko normal app-shell ke andar
       render nahi karna.

       Isse admin ko full viewport milega.
    */

    if (page === "admin") {

        if (user.role !== "admin") {

            return (

                <div className="admin-denied">

                    <div className="admin-denied-icon">
                        <LockIcon />
                    </div>

                    <h2>
                        Access Denied
                    </h2>

                    <p>
                        You don't have permission
                        to access the admin panel.
                    </p>

                </div>

            );

        }

        return <AdminPage />;

    }



    const showRight =
        !NO_RIGHT.includes(page);


    return (

        <div className="app-shell">

            <Sidebar />


            <main className="main-feed">

                <PageRenderer />

            </main>


            {showRight && (
                <RightPanel />
            )}

        </div>

    );

}