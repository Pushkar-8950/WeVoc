import "./RightPanel.css";
import { useEffect, useState } from "react";

import Avatar from "./Avatar";

import { useApp } from "../context/AppContext";

import {
    searchUsers,
    searchVoices,
} from "../api/search.api";

import {
    toggleFollow,
} from "../api/follow.api";

import {
    getAllVoices,
} from "../api/voice.api";

import {
    getSuggestedUsers,
} from "../api/user.api";

import {
    EyeIcon,
    HeartIcon,
    MicIcon,
    ProfileIcon,
    SearchIcon,
} from "./Icons";


export default function RightPanel() {

    const {
        navigate,
        searchQuery,
        user,
    } = useApp();



    const [following, setFollowing] = useState({});

    const [suggestedUsers, setSuggestedUsers] =
        useState([]);

    const [trendingVoices, setTrendingVoices] =
        useState([]);

    const [searchResults, setSearchResults] =
        useState([]);

    const [voiceResults, setVoiceResults] =
        useState([]);

    const [searchLoading, setSearchLoading] =
        useState(false);

    const [searchError, setSearchError] =
        useState("");

    const [panelLoading, setPanelLoading] =
        useState(true);



    useEffect(() => {

        const loadRightPanel = async () => {

            try {

                setPanelLoading(true);


                const [
                    voicesResponse,
                    suggestedResponse,
                ] = await Promise.all([

                    getAllVoices(1, 20),

                    getSuggestedUsers(),

                ]);



                const voices =
                    voicesResponse?.data?.voices || [];


                const trending = [...voices]
                    .sort((a, b) => {

                        const scoreA =
                            (a.likesCount || 0) * 3 +
                            (a.views || 0);

                        const scoreB =
                            (b.likesCount || 0) * 3 +
                            (b.views || 0);

                        return scoreB - scoreA;

                    })
                    .slice(0, 5);


                setTrendingVoices(trending);



                const suggested =
                    Array.isArray(
                        suggestedResponse?.data
                    )
                        ? suggestedResponse.data
                        : [];


                const users = suggested
                    .filter(Boolean)
                    .filter(
                        person =>
                            String(person._id) !==
                            String(user?._id)
                    )
                    .slice(0, 5);


                setSuggestedUsers(users);


            } catch (error) {

                console.error(
                    "Right panel loading error:",
                    error
                );

                setSuggestedUsers([]);
                setTrendingVoices([]);

            } finally {

                setPanelLoading(false);

            }

        };


        if (user?._id) {
            loadRightPanel();
        }

    }, [user?._id]);



    useEffect(() => {

        const query =
            searchQuery.trim();


        if (query.length <= 1) {

            setSearchResults([]);
            setVoiceResults([]);
            setSearchLoading(false);
            setSearchError("");

            return;
        }


        const timer = setTimeout(
            async () => {

                try {

                    setSearchLoading(true);
                    setSearchError("");


                    const [
                        usersResponse,
                        voicesResponse,
                    ] = await Promise.all([

                        searchUsers(query),
                        searchVoices(query),

                    ]);


                    setSearchResults(
                        Array.isArray(
                            usersResponse?.data
                        )
                            ? usersResponse.data
                            : []
                    );


                    setVoiceResults(
                        Array.isArray(
                            voicesResponse?.data
                        )
                            ? voicesResponse.data
                            : []
                    );


                } catch (error) {

                    console.error(
                        "Right panel search error:",
                        error
                    );

                    setSearchError(
                        error.message ||
                        "Failed to search"
                    );

                    setSearchResults([]);
                    setVoiceResults([]);

                } finally {

                    setSearchLoading(false);

                }

            },
            400
        );


        return () =>
            clearTimeout(timer);

    }, [searchQuery]);



    const handleFollow = async (targetUser) => {

        if (!targetUser?._id) {
            return;
        }


        if (
            user?._id &&
            String(user._id) ===
            String(targetUser._id)
        ) {
            return;
        }


        const userId =
            targetUser._id;


        try {

            const response =
                await toggleFollow(userId);


            const message =
                response?.message || "";


            const nowFollowing =
                message
                    .toLowerCase()
                    .includes("followed");


            setFollowing(previous => ({
                ...previous,
                [userId]: nowFollowing,
            }));


        } catch (error) {

            console.error(
                "Follow error:",
                error
            );

        }

    };



    const isSearching =
        searchQuery.trim().length > 1;


    const shownUsers =
        isSearching
            ? searchResults
            : suggestedUsers;



    const normalizeUser = (rawUser) => {

        return {

            ...rawUser,

            name:
                rawUser?.fullname ||
                rawUser?.name ||
                "Unknown User",

            username:
                rawUser?.username ||
                "",

            college:
                rawUser?.college ||
                "",

            avatar:
                rawUser?.avatar ||
                undefined,

        };

    };



    return (

        <aside className="right-panel">


            {!isSearching && (

                <div
                    className="rp-box rp-trending-box"
                    style={{
                        marginBottom: 16,
                    }}
                >

                    <div className="rp-box-title">
                        What's trending
                    </div>


                    {panelLoading ? (

                        <div
                            style={{
                                padding: "16px 20px",
                                fontSize: 14,
                                color: "var(--ink3)",
                            }}
                        >
                            Loading trends...
                        </div>

                    ) : trendingVoices.length === 0 ? (

                        <div
                            style={{
                                padding: "16px 20px",
                                fontSize: 14,
                                color: "var(--ink3)",
                            }}
                        >
                            No trending voices yet.
                        </div>

                    ) : (

                        trendingVoices.map(
                            (voice, index) => (

                                <div
                                    key={voice._id}
                                    className="rp-row"
                                    onClick={() =>
                                        navigate(
                                            "user",
                                            voice.owner
                                        )
                                    }
                                    style={{
                                        cursor: "pointer",
                                    }}
                                >

                                    <div
                                        style={{
                                            width: 28,
                                            fontSize: 13,
                                            fontWeight: 800,
                                            color: "var(--crimson)",
                                        }}
                                    >
                                        #{index + 1}
                                    </div>


                                    <div
                                        style={{
                                            minWidth: 0,
                                            flex: 1,
                                        }}
                                    >

                                        <div
                                            className="trend-tag"
                                            style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {voice.title}
                                        </div>


                                        <div className="trend-count">

                                            <HeartIcon />{" "}
                                            {voice.likesCount || 0}

                                            {" · "}

                                            <EyeIcon />{" "}
                                            {voice.views || 0}

                                        </div>

                                    </div>

                                </div>

                            )
                        )

                    )}

                </div>

            )}




            <div className="rp-box rp-suggestions-box">

                <div className="rp-box-title">

                    {isSearching
                        ? "Search results"
                        : "People you may know"}

                </div>




                {isSearching &&
                    searchLoading && (

                        <div
                            style={{
                                padding: "16px 20px",
                                fontSize: 14,
                                color: "var(--ink3)",
                            }}
                        >
                            Searching...
                        </div>

                    )}




                {isSearching &&
                    !searchLoading &&
                    searchError && (

                        <div
                            style={{
                                padding: "16px 20px",
                                fontSize: 14,
                                color: "var(--crimson)",
                            }}
                        >
                            {searchError}
                        </div>

                    )}




                {!searchLoading &&
                    !searchError &&
                    shownUsers.length > 0 && (

                        <>

                            {isSearching && (

                                <div
                                    style={{
                                        padding:
                                            "10px 20px 4px",
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color:
                                            "var(--ink3)",
                                    }}
                                >
                                    <ProfileIcon /> People
                                </div>

                            )}


                            {shownUsers.map(
                                rawUser => {

                                    const u =
                                        normalizeUser(
                                            rawUser
                                        );


                                    const isCurrentUser =
                                        user?._id &&
                                        String(user._id) ===
                                        String(u._id);


                                    return (

                                        <div
                                            key={u._id}
                                            className="rp-row"
                                        >

                                            <div
                                                className="suggest-row"
                                            >



                                                <Avatar
                                                    name={u.name}
                                                    src={u.avatar}
                                                    size="sm"
                                                    onClick={() =>
                                                        navigate(
                                                            "user",
                                                            u
                                                        )
                                                    }
                                                />




                                                <div
                                                    className="suggest-names"
                                                    style={{
                                                        cursor: "pointer",
                                                        minWidth: 0,
                                                    }}
                                                    onClick={() =>
                                                        navigate(
                                                            "user",
                                                            u
                                                        )
                                                    }
                                                >

                                                    <div className="suggest-name">
                                                        {u.name}
                                                    </div>


                                                    <div className="suggest-college">

                                                        @{u.username}

                                                    </div>

                                                </div>




                                                {!isCurrentUser && (

                                                    <button
                                                        className={`btn btn-sm ${
                                                            following[
                                                                u._id
                                                            ]
                                                                ? "btn-secondary"
                                                                : "btn-outline"
                                                        }`}
                                                        onClick={() =>
                                                            handleFollow(
                                                                u
                                                            )
                                                        }
                                                    >

                                                        {following[
                                                            u._id
                                                        ]
                                                            ? "Following"
                                                            : "+ Follow"}

                                                    </button>

                                                )}

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </>

                    )}




                {isSearching &&
                    !searchLoading &&
                    !searchError &&
                    voiceResults.length > 0 && (

                        <>

                            <div
                                style={{
                                    padding:
                                        "14px 20px 6px",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color:
                                        "var(--ink3)",
                                }}
                            >
                                <MicIcon /> Voices
                            </div>


                            {voiceResults
                                .slice(0, 4)
                                .map(voice => (

                                    <div
                                        key={voice._id}
                                        className="rp-row"
                                        style={{
                                            cursor: "pointer",
                                        }}
                                        onClick={() =>
                                            navigate(
                                                "user",
                                                voice.owner
                                            )
                                        }
                                    >

                                        <div className="rp-voice-mark">
                                            <MicIcon />
                                        </div>


                                        <div
                                            style={{
                                                minWidth: 0,
                                                flex: 1,
                                                marginLeft: 10,
                                            }}
                                        >

                                            <div
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 700,
                                                    color:
                                                        "var(--ink)",
                                                    overflow: "hidden",
                                                    textOverflow:
                                                        "ellipsis",
                                                    whiteSpace:
                                                        "nowrap",
                                                }}
                                            >
                                                {voice.title}
                                            </div>


                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color:
                                                        "var(--ink3)",
                                                    marginTop: 3,
                                                }}
                                            >

                                                @
                                                {
                                                    voice.owner
                                                        ?.username
                                                }

                                                {" · "}

                                                <HeartIcon />{" "}
                                                {
                                                    voice.likesCount ??
                                                    0
                                                }

                                            </div>

                                        </div>

                                    </div>

                                ))}

                        </>

                    )}




                {isSearching &&
                    !searchLoading &&
                    !searchError &&
                    searchResults.length === 0 &&
                    voiceResults.length === 0 && (

                        <div
                            style={{
                                padding: "18px 20px",
                                fontSize: 14,
                                color: "var(--ink3)",
                                textAlign: "center",
                            }}
                        >

                            <div
                                style={{
                                    fontSize: 24,
                                    marginBottom: 6,
                                }}
                            >
                                <SearchIcon />
                            </div>

                            No results found

                        </div>

                    )}




                {!isSearching &&
                    !panelLoading &&
                    shownUsers.length === 0 && (

                        <div
                            style={{
                                padding: "16px 20px",
                                fontSize: 14,
                                color: "var(--ink3)",
                            }}
                        >
                            No people to show yet.
                        </div>

                    )}

            </div>




            <p
                style={{
                    fontSize: 12,
                    color: "var(--ink4)",
                    lineHeight: 1.7,
                    padding: "8px 4px",
                }}
            >
                WeVoc · Terms · Privacy ·
                Campus Voice Platform © 2026
            </p>

        </aside>

    );

}