import { useEffect, useState } from "react";

import {
    MicIcon,
    ProfileIcon,
    SearchIcon,
} from "../components/Icons";
import Avatar from "../components/Avatar";
import PostCard from "../components/PostCard";

import { useApp } from "../context/AppContext";

import {
    searchUsers,
    searchVoices,
} from "../api/search.api";


export default function ExplorePage() {

    const {
        navigate
    } = useApp();


    const [search, setSearch] =
        useState("");

    const [users, setUsers] =
        useState([]);

    const [voices, setVoices] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");



    useEffect(() => {

        const query =
            search.trim();


        if (!query) {

            setUsers([]);
            setVoices([]);
            setError("");

            return;

        }


        const timer =
            setTimeout(
                async () => {

                    try {

                        setLoading(true);
                        setError("");


                        const [
                            usersResponse,
                            voicesResponse,
                        ] = await Promise.all([

                            searchUsers(
                                query
                            ),

                            searchVoices(
                                query
                            ),

                        ]);


                        setUsers(
                            usersResponse?.data ||
                            []
                        );


                        setVoices(
                            voicesResponse?.data ||
                            []
                        );


                    } catch (error) {

                        console.error(
                            "Search failed:",
                            error
                        );


                        setError(
                            error?.message ||
                            "Search failed"
                        );

                    } finally {

                        setLoading(false);

                    }

                },
                400
            );


        return () =>
            clearTimeout(timer);

    }, [search]);



    const handleLikeChange = (
        voiceId,
        liked,
        likesCount
    ) => {

        setVoices(
            currentVoices =>

                currentVoices.map(
                    voice => {

                        if (
                            voice._id !== voiceId
                        ) {

                            return voice;

                        }


                        if (
                            typeof likesCount ===
                            "number"
                        ) {

                            return {
                                ...voice,
                                isLiked: liked,
                                likesCount:
                                    Math.max(
                                        0,
                                        likesCount
                                    ),
                            };

                        }


                        const currentCount =
                            Number(
                                voice.likesCount || 0
                            );


                        return {
                            ...voice,

                            isLiked:
                                liked,

                            likesCount:
                                liked
                                    ? currentCount + 1
                                    : Math.max(
                                        0,
                                        currentCount - 1
                                    ),
                        };

                    }
                )
        );

    };



    return (

        <div className="explore-page">




            <div
                className="explore-trends"
            >

                <div
                    className="page-top-title explore-title"
                >
                    Explore
                </div>


                <div
                    className="rp-search header-search explore-search"
                >

                    <span
                        className="rp-search-icon"
                    >

                        <SearchIcon />

                    </span>


                    <input
                        placeholder="Search users or voices..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>




            {error && (

                <div className="auth-error">

                    {error}

                </div>

            )}




            {loading && (

                <div className="feed-loading">

                    Searching...

                </div>

            )}




            {!search.trim() &&
                !loading && (

                    <div className="empty-state">

                        <div className="empty-ico">

                            <SearchIcon />

                        </div>


                        <div className="empty-title">

                            Search WeVoc

                        </div>


                        <div className="empty-sub">

                            Search for users,
                            voices and campus
                            conversations.

                        </div>

                    </div>

                )}




            {!loading &&
                search.trim() &&
                users.length > 0 && (

                    <>

                        <div className="section-lbl">

                            <ProfileIcon /> People

                        </div>


                        {users.map(
                            (person) => (

                                <div
                                    key={
                                        person._id
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
                                        style={{
                                            cursor:
                                                "pointer",
                                        }}
                                        onClick={() =>
                                            navigate(
                                                "user",
                                                person
                                            )
                                        }
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


                                        {person.bio && (

                                            <div
                                                style={{
                                                    fontSize:
                                                        12,
                                                    color:
                                                        "var(--ink3)",
                                                    marginTop:
                                                        3,
                                                }}
                                            >

                                                {
                                                    person.bio
                                                }

                                            </div>

                                        )}

                                    </div>


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

                                </div>

                            )
                        )}

                    </>

                )}




            {!loading &&
                search.trim() &&
                voices.length > 0 && (

                    <>

                        <div
                            className="section-lbl"
                            style={{
                                marginTop: 20,
                            }}
                        >

                            <MicIcon /> Voices

                        </div>


                        {voices.map(
                            (voice, index) => (

                                <PostCard
                                    key={
                                        voice._id
                                    }
                                    post={
                                        voice
                                    }
                                    onLikeChange={
                                        handleLikeChange
                                    }
                                    style={{
                                        animationDelay:
                                            `${index * 0.05}s`,
                                    }}
                                />

                            )
                        )}

                    </>

                )}




            {!loading &&
                search.trim() &&
                users.length === 0 &&
                voices.length === 0 && (

                    <div className="empty-state">

                        <div className="empty-ico">

                            <SearchIcon />

                        </div>


                        <div className="empty-title">

                            Nothing found

                        </div>


                        <div className="empty-sub">

                            Try searching for
                            another user,
                            title or topic.

                        </div>

                    </div>

                )}

        </div>

    );

}