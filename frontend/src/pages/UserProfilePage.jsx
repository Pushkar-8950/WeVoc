import "./UserProfilePage.css";
import { useEffect, useState } from "react";

import Avatar from "../components/Avatar";
import PostCard from "../components/PostCard";

import { useApp } from "../context/AppContext";

import {
    toggleFollow,
    getUserProfile,
} from "../api/follow.api";

import { getAllVoices } from "../api/voice.api";

import { fmtDate } from "../utils/helpers";
import {
    CalendarIcon,
    MessageIcon,
    MicIcon,
    ProfileIcon,
    WarningIcon,
} from "../components/Icons";



export default function UserProfilePage() {

    const {
        pageData: selectedUser,
        goBack,
        navigate,
    } = useApp();



    const [user, setUser] =
        useState(selectedUser || null);

    const [loading, setLoading] =
        useState(true);

    const [followLoading, setFollowLoading] =
        useState(false);

    const [error, setError] =
        useState("");



    const [posts, setPosts] =
        useState([]);

    const [postsLoading, setPostsLoading] =
        useState(false);



    const [tab, setTab] =
        useState("posts");



    const loadProfile = async () => {

        if (!selectedUser?._id) {
            setLoading(false);
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response =
                await getUserProfile(
                    selectedUser._id
                );

            if (response?.data) {

                setUser(
                    response.data
                );

            }

        } catch (error) {

            console.error(
                "Profile error:",
                error
            );

            setError(
                error?.message ||
                "Failed to load profile"
            );

        } finally {

            setLoading(false);

        }
    };



    const loadPosts = async () => {

        if (!selectedUser?._id) {
            return;
        }

        try {

            setPostsLoading(true);

            const response =
                await getAllVoices(
                    1,
                    100
                );

            const voices =
                response?.data?.voices || [];

            const userPosts =
                voices.filter(
                    (voice) => {

                        const ownerId =
                            voice?.owner?._id;

                        return (
                            ownerId &&
                            String(ownerId) ===
                            String(
                                selectedUser._id
                            )
                        );

                    }
                );

            setPosts(
                userPosts
            );

        } catch (error) {

            console.error(
                "Posts error:",
                error
            );

        } finally {

            setPostsLoading(false);

        }
    };



    useEffect(() => {

        loadProfile();
        loadPosts();

    }, [selectedUser?._id]);



    const handleFollow = async () => {

        if (
            !user?._id ||
            followLoading
        ) {
            return;
        }

        try {

            setFollowLoading(true);

            const response =
                await toggleFollow(
                    user._id
                );

            const message =
                response?.message || "";

            const messageLower =
                message.toLowerCase();

            const isNowFollowing =
                messageLower.includes("followed") &&
                !messageLower.includes("unfollowed");

            setUser(
                (current) => {

                    if (!current) {
                        return current;
                    }

                    return {

                        ...current,

                        isFollowing:
                            isNowFollowing,

                        followersCount:
                            Math.max(
                                0,
                                (
                                    current.followersCount ||
                                    0
                                ) +
                                (
                                    isNowFollowing
                                        ? 1
                                        : -1
                                )
                            ),

                    };

                }
            );

        } catch (error) {

            console.error(
                "Follow error:",
                error
            );

            alert(
                error?.message ||
                "Unable to follow user"
            );

        } finally {

            setFollowLoading(false);

        }
    };



    const handleMessage = () => {

        if (!user?._id) {
            return;
        }

        /*
         * IMPORTANT:
         * DmsPage expects pageData to be
         * the actual user object.
         *
         * So we pass user directly.
         */

        navigate(
            "dms",
            user
        );

    };



    if (!selectedUser) {

        return (

            <div className="empty-state">

                <div className="empty-ico">
                    <ProfileIcon />
                </div>

                <div className="empty-title">
                    User not found
                </div>

            </div>

        );

    }



    if (loading && !user) {

        return (

            <div className="empty-state">

                <div className="empty-ico">
                    <ProfileIcon />
                </div>

                <div className="empty-title">
                    Loading profile...
                </div>

            </div>

        );

    }



    if (error && !user) {

        return (

            <div className="empty-state">

                <div className="empty-ico">
                    <WarningIcon />
                </div>

                <div className="empty-title">
                    Failed to load profile
                </div>

                <div className="empty-sub">
                    {error}
                </div>

                <button
                    className="btn btn-primary btn-sm"
                    style={{
                        marginTop: 12,
                    }}
                    onClick={loadProfile}
                >
                    Try again
                </button>

            </div>

        );

    }



    return (

        <div className="page-anim">



            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 12,
                }}
            >

                <button
                    className="btn btn-ghost btn-sm"
                    onClick={goBack}
                    type="button"
                >
                    ←
                </button>

                <div>

                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: 18,
                        }}
                    >
                        {user.fullname}
                    </div>

                    <div
                        style={{
                            fontSize: 13,
                            color: "var(--ink3)",
                        }}
                    >
                        @{user.username}
                    </div>

                </div>

            </div>




            <div className="profile-info-wrap">



                <div className="profile-avatar-bump">

                    <Avatar
                        name={
                            user.fullname
                        }
                        src={
                            user.avatar
                        }
                        size="2xl"
                    />

                </div>




                <div
                    className="profile-title-row"
                >

                    <div>

                        <div className="profile-name">
                            {user.fullname}
                        </div>

                        <div className="profile-handle">
                            @{user.username}
                        </div>

                    </div>




                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >



                        <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={handleMessage}
                        >
                            <MessageIcon /> Message
                        </button>




                        <button
                            type="button"
                            className={
                                user.isFollowing
                                    ? "btn btn-secondary btn-sm"
                                    : "btn btn-primary btn-sm"
                            }
                            onClick={handleFollow}
                            disabled={followLoading}
                        >

                            {followLoading
                                ? "..."
                                : user.isFollowing
                                    ? "Following"
                                    : "Follow"
                            }

                        </button>

                    </div>

                </div>




                {user.bio && (

                    <div className="profile-bio">
                        {user.bio}
                    </div>

                )}




                <div
                    className="profile-meta-row"
                >

                    <div className="profile-meta-item">

                        <CalendarIcon /> Joined{" "}

                        {user.createdAt
                            ? fmtDate(
                                user.createdAt
                            )
                            : "Recently"
                        }

                    </div>

                </div>




                <div
                    className="profile-stats-row"
                >

                    <div className="stat-link">

                        <span className="stat-count">
                            {posts.length}
                        </span>

                        <span className="stat-word">
                            Posts
                        </span>

                    </div>


                    <div className="stat-link">

                        <span className="stat-count">
                            {user.followersCount || 0}
                        </span>

                        <span className="stat-word">
                            Followers
                        </span>

                    </div>


                    <div className="stat-link">

                        <span className="stat-count">
                            {user.followingCount || 0}
                        </span>

                        <span className="stat-word">
                            Following
                        </span>

                    </div>

                </div>

            </div>




            <div className="tab-strip">

                <button
                    className={
                        `tab-strip-btn${
                            tab === "posts"
                                ? " active"
                                : ""
                        }`
                    }
                    onClick={() =>
                        setTab("posts")
                    }
                    type="button"
                >
                    Posts
                </button>


                <button
                    className={
                        `tab-strip-btn${
                            tab === "about"
                                ? " active"
                                : ""
                        }`
                    }
                    onClick={() =>
                        setTab("about")
                    }
                    type="button"
                >
                    About
                </button>

            </div>




            {tab === "posts" && (

                <>

                    {postsLoading ? (

                        <div className="empty-state">

                            <div className="empty-ico">
                                <MicIcon />
                            </div>

                            <div className="empty-title">
                                Loading posts...
                            </div>

                        </div>

                    ) : posts.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-ico">
                                <MicIcon />
                            </div>

                            <div className="empty-title">
                                No posts yet
                            </div>

                            <div className="empty-sub">
                                This user hasn't published
                                any voices yet.
                            </div>

                        </div>

                    ) : (

                        posts.map(
                            (post) => (

                                <PostCard
                                    key={
                                        post._id
                                    }
                                    post={
                                        post
                                    }
                                />

                            )
                        )

                    )}

                </>

            )}




            {tab === "about" && (

                <div className="empty-state">

                    <div className="empty-ico">
                        <ProfileIcon />
                    </div>

                    <div className="empty-title">
                        About {user.fullname}
                    </div>

                    <div
                        className="empty-sub"
                        style={{
                            maxWidth: 450,
                            margin: "0 auto",
                        }}
                    >

                        @{user.username}

                        {user.bio && (
                            <>
                                <br />
                                <br />
                                {user.bio}
                            </>
                        )}

                    </div>

                </div>

            )}

        </div>

    );

}