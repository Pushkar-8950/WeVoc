import "./CommunitiesPage.css";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import ComposeBox from "../components/ComposeBox";
import PostCard from "../components/PostCard";
import {
    CheckIcon,
    CommunityIcon,
    GraduationCapIcon,
    LockIcon,
    MicIcon,
    PlusIcon,
} from "../components/Icons";

import {
    createCommunity,
    getCommunities,
    joinCommunity,
    leaveCommunity,
} from "../api/community.api";

import {
    getCommunityVoices,
} from "../api/voice.api";

const EMPTY_COMMUNITY_FORM = {
    name: "",
    description: "",
    college: "",
};


export default function CommunitiesPage() {

    const [communities, setCommunities] =
        useState([]);

    const [tab, setTab] =
        useState("discover");

    const [active, setActive] =
        useState(null);

    const [composerOpen, setComposerOpen] =
        useState(false);

    const [createOpen, setCreateOpen] =
        useState(false);

    const [creating, setCreating] =
        useState(false);

    const [createError, setCreateError] =
        useState("");

    const [communityForm, setCommunityForm] =
        useState(EMPTY_COMMUNITY_FORM);

    const [communityVoices, setCommunityVoices] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [voicesLoading, setVoicesLoading] =
        useState(false);

    const [error, setError] =
        useState("");



    const loadCommunities =
        async () => {

            try {

                setLoading(true);
                setError("");


                const response =
                    await getCommunities();


                setCommunities(
                    response?.data || []
                );

            } catch (error) {

                console.error(
                    "Load communities error:",
                    error
                );


                setError(
                    error?.message ||
                    "Failed to load communities."
                );

            } finally {

                setLoading(false);

            }

        };



    useEffect(() => {

        loadCommunities();

    }, []);



    const loadCommunityVoices =
        async (communityId) => {

            if (!communityId) {
                return;
            }


            try {

                setVoicesLoading(true);


                const response =
                    await getCommunityVoices(
                        communityId
                    );


                setCommunityVoices(
                    response?.data || []
                );

            } catch (error) {

                console.error(
                    "Load community voices error:",
                    error
                );


                setCommunityVoices([]);

            } finally {

                setVoicesLoading(false);

            }

        };



    const openCommunity =
        async (community) => {

            setComposerOpen(false);
            setActive(
                community
            );

            setCommunityVoices([]);

            await loadCommunityVoices(
                community._id
            );

        };



    const closeCommunity =
        () => {

            setComposerOpen(false);
            setActive(null);

            setCommunityVoices([]);

        };


    const closeCreateModal = () => {

        if (creating) {
            return;
        }

        setCreateOpen(false);
        setCreateError("");
        setCommunityForm(EMPTY_COMMUNITY_FORM);

    };


    const handleCreateCommunity = async (event) => {

        event.preventDefault();
        setCreateError("");

        try {

            setCreating(true);

            const response = await createCommunity(
                communityForm
            );

            if (!response?.data?._id) {
                throw new Error(
                    "The server did not return the created community."
                );
            }

            const createdCommunity = {
                ...response.data,
                joined: true,
            };

            setCommunities(current => [
                createdCommunity,
                ...current.filter(
                    community =>
                        community._id !== createdCommunity._id
                ),
            ]);

            setTab("joined");
            setCreateOpen(false);
            setCommunityForm(EMPTY_COMMUNITY_FORM);

        } catch (error) {

            console.error(
                "Create community error:",
                error
            );

            setCreateError(
                error?.message ||
                "Unable to create community."
            );

        } finally {

            setCreating(false);

        }

    };



    const handleJoin =
        async (communityId) => {

            try {

                await joinCommunity(
                    communityId
                );


                setCommunities(
                    current =>
                        current.map(
                            community => {

                                if (
                                    community._id !==
                                    communityId
                                ) {

                                    return community;

                                }


                                return {
                                    ...community,

                                    joined:
                                        true,

                                    membersCount:
                                        Number(
                                            community.membersCount ||
                                            community.members ||
                                            0
                                        ) + 1,
                                };

                            }
                        )
                );


                if (
                    active?._id ===
                    communityId
                ) {

                    setActive(
                        current => ({
                            ...current,
                            joined: true,
                            membersCount:
                                Number(
                                    current.membersCount ||
                                    current.members ||
                                    0
                                ) + 1,
                        })
                    );

                }

            } catch (error) {

                console.error(
                    "Join community error:",
                    error
                );


                alert(
                    error?.message ||
                    "Unable to join community."
                );

            }

        };



    const handleLeave =
        async (communityId) => {

            try {

                await leaveCommunity(
                    communityId
                );


                setCommunities(
                    current =>
                        current.map(
                            community => {

                                if (
                                    community._id !==
                                    communityId
                                ) {

                                    return community;

                                }


                                return {
                                    ...community,

                                    joined:
                                        false,

                                    membersCount:
                                        Math.max(
                                            0,
                                            Number(
                                                community.membersCount ||
                                                community.members ||
                                                0
                                            ) - 1
                                        ),
                                };

                            }
                        )
                );


                if (
                    active?._id ===
                    communityId
                ) {

                    setActive(
                        current => ({
                            ...current,
                            joined: false,
                            membersCount:
                                Math.max(
                                    0,
                                    Number(
                                        current.membersCount ||
                                        current.members ||
                                        0
                                    ) - 1
                                ),
                        })
                    );

                }

            } catch (error) {

                console.error(
                    "Leave community error:",
                    error
                );


                alert(
                    error?.message ||
                    "Unable to leave community."
                );

            }

        };



    const shownCommunities =
        tab === "joined"
            ? communities.filter(
                community =>
                    community.joined
            )
            : communities;



    if (loading) {

        return (

            <div className="page-anim">

                <div
                    className="feed-loading"
                >

                    Loading communities...

                </div>

            </div>

        );

    }



    if (active) {

        return (

            <div className="page-anim">



                <div className="feed-header">

                    <div className="feed-header-inner">

                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: 14,
                                minWidth: 0,
                            }}
                        >

                            <button
                                type="button"
                                className="back-btn"
                                onClick={
                                    closeCommunity
                                }
                            >

                                ←

                            </button>


                            <div
                                style={{
                                    minWidth: 0,
                                }}
                            >

                                <div
                                    className="feed-header-title"
                                >

                                    <CommunityIcon />{" "}

                                    {active.name}

                                </div>


                                <div
                                    style={{
                                        fontSize: 13,
                                        color:
                                            "var(--ink3)",
                                    }}
                                >

                                    {active.membersCount ??
                                        active.members ??
                                        0}{" "}
                                    members

                                    {" · "}

                                    {active.postsCount ??
                                        active.posts ??
                                        0}{" "}
                                    posts

                                </div>

                            </div>

                        </div>




                        {active.joined ? (

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    handleLeave(
                                        active._id
                                    )
                                }
                            >

                                Leave

                            </button>

                        ) : (

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() =>
                                    handleJoin(
                                        active._id
                                    )
                                }
                            >

                                Join

                            </button>

                        )}

                    </div>

                </div>




                {!active.joined && (

                    <div
                        className="empty-state"
                    >

                        <div
                            className="empty-ico"
                        >

                            <LockIcon />

                        </div>


                        <div
                            className="empty-title"
                        >

                            Join this community

                        </div>


                        <div
                            className="empty-sub"
                        >

                            Join this community
                            to share your own
                            voice posts.

                        </div>


                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                                handleJoin(
                                    active._id
                                )
                            }
                        >

                            Join Community

                        </button>

                    </div>

                )}



                {active.joined && (

                    <div className="community-detail-actions">
                        <button
                            type="button"
                            className="btn btn-primary"
                            aria-expanded={composerOpen}
                            onClick={() =>
                                setComposerOpen(open => !open)
                            }
                        >
                            <PlusIcon />
                            {composerOpen ? "Close composer" : "Add post"}
                        </button>
                    </div>

                )}


                {active.joined && composerOpen && (

                    <div className="community-compose">
                        <ComposeBox
                            communityId={active._id}
                            onPublished={() =>
                                loadCommunityVoices(active._id)
                            }
                        />
                    </div>

                )}



                <div
                    className="section-lbl"
                    style={{
                        marginTop: 20,
                    }}
                >
                    Community Voices
                </div>



                {voicesLoading ? (

                    <div
                        className="feed-loading"
                    >

                        Loading voices...

                    </div>

                ) : communityVoices.length === 0 ? (

                    <div
                        className="empty-state"
                    >

                        <div
                            className="empty-ico"
                        >

                            <MicIcon />

                        </div>


                        <div
                            className="empty-title"
                        >

                            No voices yet

                        </div>


                        <div
                            className="empty-sub"
                        >

                            Be the first to share
                            a voice in this
                            community.

                        </div>

                    </div>

                ) : (

                    communityVoices.map(
                        (voice) => (

                            <PostCard
                                key={
                                    voice._id
                                }
                                post={
                                    voice
                                }
                            />

                        )
                    )

                )}

            </div>

        );

    }



    return (

        <div className="page-anim">



            <div
                className="feed-header communities-header"
            >

                <div
                    className="feed-header-inner page-title-header"
                >

                    <div className="page-title-stack">

                        <div
                            className="page-top-title"
                        >

                            Communities

                        </div>


                        <div
                            className="page-top-subtitle"
                        >

                            (Find your campus or similar
                            communities)

                        </div>

                    </div>

                </div>


                <div
                    className="tab-strip communities-tabs"
                >

                    <button
                        type="button"
                        className={`tab-strip-btn${
                            tab === "discover"
                                ? " active"
                                : ""
                        }`}
                        onClick={() =>
                            setTab(
                                "discover"
                            )
                        }
                    >

                        Discover

                    </button>


                    <button
                        type="button"
                        className={`tab-strip-btn${
                            tab === "joined"
                                ? " active"
                                : ""
                        }`}
                        onClick={() =>
                            setTab(
                                "joined"
                            )
                        }
                    >

                        Joined (
                        {
                            communities.filter(
                                community =>
                                    community.joined
                            ).length
                        }
                        )

                    </button>

                </div>

            </div>




            {error && (

                <div
                    className="auth-error"
                >

                    {error}

                    <button
                        type="button"
                        className="btn btn-sm"
                        onClick={
                            loadCommunities
                        }
                    >

                        Retry

                    </button>

                </div>

            )}




            {shownCommunities.length === 0 ? (

                <div
                    className="empty-state"
                >

                    <div
                        className="empty-ico"
                    >

                        <CommunityIcon />

                    </div>


                    <div
                        className="empty-title"
                    >

                        No communities joined

                    </div>


                    <div
                        className="empty-sub"
                    >

                        Browse communities
                        and join the ones
                        you like.

                    </div>

                </div>

            ) : (

                shownCommunities.map(
                    (community) => (

                        <div
                            key={
                                community._id
                            }
                            className="comm-row"
                            onClick={() =>
                                openCommunity(
                                    community
                                )
                            }
                        >



                            <div
                                className="comm-icon"
                            >

                                <CommunityIcon />

                            </div>




                            <div
                                className="comm-info"
                            >

                                <div
                                    className="comm-name"
                                >

                                    {
                                        community.name
                                    }

                                </div>


                                <div
                                    className="comm-meta"
                                >

                                    {
                                        community.membersCount ??
                                        community.members ??
                                        0
                                    }{" "}
                                    members

                                    {" · "}

                                    {
                                        community.postsCount ??
                                        community.posts ??
                                        0
                                    }{" "}
                                    posts

                                </div>


                                {community.college && (

                                    <div
                                        className="comm-meta"
                                    >

                                        <GraduationCapIcon />{" "}
                                        {
                                            community.college
                                        }

                                    </div>

                                )}


                                {community.tags?.length >
                                    0 && (

                                    <div
                                        className="comm-tags"
                                    >

                                        {
                                            community.tags.map(
                                                tag => (

                                                    <span
                                                        key={
                                                            tag
                                                        }
                                                        className="comm-tag"
                                                    >

                                                        #
                                                        {tag}

                                                    </span>

                                                )
                                            )
                                        }

                                    </div>

                                )}

                            </div>




                            <button
                                type="button"
                                className={`btn btn-sm ${
                                    community.joined
                                        ? "btn-secondary"
                                        : "btn-outline"
                                }`}
                                onClick={(
                                    e
                                ) => {

                                    e.stopPropagation();


                                    if (
                                        community.joined
                                    ) {

                                        handleLeave(
                                            community._id
                                        );

                                    } else {

                                        handleJoin(
                                            community._id
                                        );

                                    }

                                }}
                            >

                                {
                                    community.joined
                                        ? <><CheckIcon /> Joined</>
                                        : "Join"
                                }

                            </button>

                        </div>

                    )
                )

            )}


            {createPortal(
                <>
                    <button
                        type="button"
                        className="community-create-fab"
                        aria-haspopup="dialog"
                        aria-expanded={createOpen}
                        onClick={() => {
                            setCreateError("");
                            setCreateOpen(true);
                        }}
                    >
                        <PlusIcon />
                        Create community
                    </button>

                    {createOpen && (
                        <div
                            className="community-modal-backdrop"
                            onMouseDown={event => {
                                if (event.target === event.currentTarget) {
                                    closeCreateModal();
                                }
                            }}
                        >
                            <section
                                className="community-create-modal"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="community-create-title"
                            >
                                <div className="community-modal-header">
                                    <h2 id="community-create-title">
                                        Create a community
                                    </h2>
                                    <button
                                        type="button"
                                        className="community-modal-close"
                                        aria-label="Close create community dialog"
                                        disabled={creating}
                                        onClick={closeCreateModal}
                                    >
                                        ×
                                    </button>
                                </div>

                                <form onSubmit={handleCreateCommunity}>
                                    <label className="community-create-field">
                                        Community name
                                        <input
                                            name="name"
                                            value={communityForm.name}
                                            onChange={event =>
                                                setCommunityForm(current => ({
                                                    ...current,
                                                    name: event.target.value,
                                                }))
                                            }
                                            maxLength={100}
                                            required
                                        />
                                    </label>

                                    <label className="community-create-field">
                                        Description
                                        <textarea
                                            name="description"
                                            value={communityForm.description}
                                            onChange={event =>
                                                setCommunityForm(current => ({
                                                    ...current,
                                                    description: event.target.value,
                                                }))
                                            }
                                            maxLength={500}
                                            rows={3}
                                            required
                                        />
                                    </label>

                                    <label className="community-create-field">
                                        College
                                        <input
                                            name="college"
                                            value={communityForm.college}
                                            onChange={event =>
                                                setCommunityForm(current => ({
                                                    ...current,
                                                    college: event.target.value,
                                                }))
                                            }
                                            maxLength={150}
                                            required
                                        />
                                    </label>

                                    {createError && (
                                        <div className="auth-error" role="alert">
                                            {createError}
                                        </div>
                                    )}

                                    <div className="community-modal-actions">
                                        <button
                                            type="button"
                                            className="btn btn-ghost"
                                            disabled={creating}
                                            onClick={closeCreateModal}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={creating}
                                        >
                                            {creating
                                                ? "Creating..."
                                                : "Create community"}
                                        </button>
                                    </div>
                                </form>
                            </section>
                        </div>
                    )}
                </>,
                document.body
            )}

        </div>

    );

}