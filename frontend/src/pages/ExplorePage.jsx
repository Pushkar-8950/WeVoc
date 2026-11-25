import "./ExplorePage.css";
import { useEffect, useState } from "react";

import {
    FlameIcon,
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
import { getPopularVoices } from "../api/voice.api";

const POPULAR_PAGE_SIZE = 20;

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

    const [popularVoices, setPopularVoices] =
        useState([]);

    const [popularLoading, setPopularLoading] =
        useState(true);

    const [popularLoadingMore, setPopularLoadingMore] =
        useState(false);

    const [popularError, setPopularError] =
        useState("");

    const [popularPage, setPopularPage] =
        useState(1);

    const [hasMorePopular, setHasMorePopular] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");



    const loadPopularVoices = async (
        page = 1,
        append = false
    ) => {

        try {

            if (append) {
                setPopularLoadingMore(true);
            } else {
                setPopularLoading(true);
            }

            setPopularError("");

            const response =
                await getPopularVoices(
                    page,
                    POPULAR_PAGE_SIZE
                );

            const nextVoices =
                response?.data || [];

            setPopularVoices(
                current =>
                    append
                        ? [...current, ...nextVoices]
                        : nextVoices
            );

            setPopularPage(page);
            setHasMorePopular(
                nextVoices.length === POPULAR_PAGE_SIZE
            );

        } catch (error) {

            console.error(
                "Popular voices error:",
                error
            );

            setPopularError(
                error?.message ||
                "Failed to load popular posts."
            );

        } finally {

            setPopularLoading(false);
            setPopularLoadingMore(false);

        }

    };


    useEffect(() => {

        loadPopularVoices();

    }, []);



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

        const updateVoiceLikes =
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
                            isLiked: liked,
                            likesCount:
                                liked
                                    ? currentCount + 1
                                    : Math.max(
                                        0,
                                        currentCount - 1
                                    ),
                        };

                    }
                );

        setVoices(updateVoiceLikes);
        setPopularVoices(current =>
            updateVoiceLikes(current).sort(
                (a, b) =>
                    (
                        (Number(b.likesCount) * 3) +
                        Number(b.views || 0)
                    ) -
                    (
                        (Number(a.likesCount) * 3) +
                        Number(a.views || 0)
                    ) ||
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
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




            {!search.trim() && (

                <div className="explore-popular">

                    <div className="section-lbl">
                        <FlameIcon /> Popular posts
                    </div>

                    {popularError && (

                        <div className="auth-error">
                            {popularError}
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() =>
                                    loadPopularVoices(1)
                                }
                            >
                                Retry
                            </button>
                        </div>

                    )}

                    {popularLoading ? (

                        <div className="feed-loading">
                            Loading popular posts...
                        </div>

                    ) : popularVoices.length > 0 ? (

                        <>

                            {popularVoices.map(
                                (voice, index) => (
                                    <PostCard
                                        key={voice._id}
                                        post={voice}
                                        onLikeChange={handleLikeChange}
                                        style={{
                                            animationDelay:
                                                `${(index % POPULAR_PAGE_SIZE) * 0.05}s`,
                                        }}
                                    />
                                )
                            )}

                            {hasMorePopular && (
                                <button
                                    type="button"
                                    className="btn btn-ghost explore-load-more"
                                    disabled={popularLoadingMore}
                                    onClick={() =>
                                        loadPopularVoices(
                                            popularPage + 1,
                                            true
                                        )
                                    }
                                >
                                    {popularLoadingMore
                                        ? "Loading..."
                                        : "Load more"}
                                </button>
                            )}

                        </>

                    ) : !popularError ? (

                        <div className="empty-state">
                            <div className="empty-ico">
                                <FlameIcon />
                            </div>
                            <div className="empty-title">
                                No popular posts yet
                            </div>
                            <div className="empty-sub">
                                New posts will appear here as people engage with them.
                            </div>
                        </div>

                    ) : null}

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