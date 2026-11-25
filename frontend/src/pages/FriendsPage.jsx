import { useEffect, useState } from "react";

import Avatar from "../components/Avatar";
import { PlusIcon, UsersIcon } from "../components/Icons";

import { useApp } from "../context/AppContext";

import {
    getFollowers,
    getFollowing,
    toggleFollow,
} from "../api/follow.api";


export default function FriendsPage() {

    const {
        user,
        navigate,
    } = useApp();



    const [tab, setTab] =
        useState("followers");


    const [followers, setFollowers] =
        useState([]);


    const [following, setFollowing] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    const [actionLoading, setActionLoading] =
        useState(null);


    const [error, setError] =
        useState("");



    const fetchFollowers = async () => {

        if (!user?._id) {
            return;
        }


        try {

            const response =
                await getFollowers(
                    user._id
                );


            setFollowers(
                response?.data?.followers ||
                []
            );


        } catch (error) {

            console.error(
                "Failed to fetch followers:",
                error
            );


            setError(
                error.message ||
                "Failed to fetch followers"
            );

        }

    };



    const fetchFollowing = async () => {

        if (!user?._id) {
            return;
        }


        try {

            const response =
                await getFollowing(
                    user._id
                );


            setFollowing(
                response?.data?.following ||
                []
            );


        } catch (error) {

            console.error(
                "Failed to fetch following:",
                error
            );


            setError(
                error.message ||
                "Failed to fetch following"
            );

        }

    };



    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);

                setError("");


                await Promise.all([
                    fetchFollowers(),
                    fetchFollowing(),
                ]);


            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, [user?._id]);



    const handleUnfollow = async (
        userId
    ) => {

        if (actionLoading) {
            return;
        }


        try {

            setActionLoading(
                userId
            );


            await toggleFollow(
                userId
            );


            /*
             * Remove from following
             */

            setFollowing(
                (current) =>
                    current.filter(
                        (item) =>
                            item.following?._id !==
                            userId
                    )
            );


        } catch (error) {

            console.error(
                "Unfollow failed:",
                error
            );


            setError(
                error.message ||
                "Failed to unfollow user"
            );

        } finally {

            setActionLoading(
                null
            );

        }

    };



    if (loading) {

        return (

            <div className="friends-page">

                <div className="feed-loading">

                    Loading...

                </div>

            </div>

        );

    }



    const currentList =
        tab === "followers"
            ? followers
            : following;


    return (

        <div className="friends-page">




            <div className="page-title-header" style={{ marginBottom: 8 }}>

                <div className="page-title-stack">
                    <h2 className="page-top-title friends-page-title">

                        Connections

                    </h2>


                    <div className="page-top-subtitle">

                        (People you follow and people following you)

                    </div>
                </div>

            </div>




            {error && (

                <div className="auth-error">

                    {error}

                </div>

            )}




            <div className="tab-strip">


                <button
                    className={`tab-strip-btn${
                        tab === "followers"
                            ? " active"
                            : ""
                    }`}
                    onClick={() =>
                        setTab(
                            "followers"
                        )
                    }
                >

                    Followers{" "}

                    <span
                        style={{
                            marginLeft: 4,
                        }}
                    >

                        ({followers.length})

                    </span>

                </button>


                <button
                    className={`tab-strip-btn${
                        tab === "following"
                            ? " active"
                            : ""
                    }`}
                    onClick={() =>
                        setTab(
                            "following"
                        )
                    }
                >

                    Following{" "}

                    <span
                        style={{
                            marginLeft: 4,
                        }}
                    >

                        ({following.length})

                    </span>

                </button>

            </div>




            {currentList.length === 0 && (

                <div className="empty-state">

                    <div className="empty-ico">

                        {tab === "followers"
                            ? <UsersIcon />
                            : <PlusIcon />
                        }

                    </div>


                    <div className="empty-title">

                        {tab === "followers"
                            ? "No followers yet"
                            : "Not following anyone"
                        }

                    </div>


                    <div className="empty-sub">

                        {tab === "followers"
                            ? "When someone follows you, they'll appear here."
                            : "Follow people from the feed to see them here."
                        }

                    </div>

                </div>

            )}




            {currentList.map(
                (item) => {

                    /*
                     * Backend structure:
                     *
                     * followers:
                     * {
                     *    follower: {...},
                     *    followedAt: ...
                     * }
                     *
                     * following:
                     * {
                     *    following: {...},
                     *    followedAt: ...
                     * }
                     */

                    const person =
                        tab === "followers"
                            ? item.follower
                            : item.following;


                    if (!person) {
                        return null;
                    }


                    const personId =
                        person._id;


                    return (

                        <div
                            key={
                                personId
                            }
                            className="friend-row"
                        >




                            <Avatar
                                name={
                                    person.fullname
                                }
                                src={
                                    person.avatar
                                }
                                size="md"
                                onClick={() =>
                                    navigate(
                                        "user",
                                        person
                                    )
                                }
                            />




                            <div
                                className="friend-info"
                                onClick={() =>
                                    navigate(
                                        "user",
                                        person
                                    )
                                }
                                style={{
                                    cursor:
                                        "pointer",
                                }}
                            >

                                <div className="friend-name">

                                    {
                                        person.fullname
                                    }

                                </div>


                                <div className="friend-college">

                                    @
                                    {
                                        person.username
                                    }

                                </div>

                            </div>




                            {tab ===
                                "following" && (

                                <button
                                    className="btn btn-danger btn-sm"
                                    disabled={
                                        actionLoading ===
                                        personId
                                    }
                                    onClick={() =>
                                        handleUnfollow(
                                            personId
                                        )
                                    }
                                >

                                    {actionLoading ===
                                    personId
                                        ? "..."
                                        : "Unfollow"
                                    }

                                </button>

                            )}


                            {tab ===
                                "followers" && (

                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() =>
                                        navigate(
                                            "user",
                                            person
                                        )
                                    }
                                >

                                    View

                                </button>

                            )}

                        </div>

                    );

                }
            )}

        </div>

    );

}

