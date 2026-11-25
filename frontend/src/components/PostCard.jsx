import { useEffect, useState } from "react";

import Avatar from "./Avatar";
import { Waveform } from "./Waveform";

import {
    BookmarkIcon,
    HeartIcon,
    HeartOutlineIcon,
    PauseIcon,
    PlayIcon,
    ProfileIcon,
    ReplyIcon,
    ShareIcon,
    FlameIcon,
} from "./Icons";

import { useApp } from "../context/AppContext";

import { toggleVoiceLike } from "../api/like.api";

import {
    addComment,
    getVoiceComments,
    updateComment,
    deleteComment,
} from "../api/comment.api";

import {
    toggleBookmark,
    checkBookmark,
} from "../api/bookmark.api";

import { timeAgo } from "../utils/helpers";



export default function PostCard({
    post,
    style,
    className = "",
    onLikeChange,
}) {

    const {
        navigate,
        user,
    } = useApp();



    const isAnon =
        post?.isAnonymous === true;

    const author = isAnon
        ? null
        : post?.owner || post?.user;

    const displayName = isAnon
        ? null
        : author?.fullname ||
          author?.name ||
          "Unknown User";

    const displayHandle = isAnon
        ? null
        : `@${author?.username || ""}`;



    const [liked, setLiked] =
        useState(post?.isLiked === true);

    const [likeCount, setLikeCount] =
        useState(
            Number(post?.likesCount || 0)
        );

    const [likeLoading, setLikeLoading] =
        useState(false);


    // parent sends an updated post.

    useEffect(() => {

        setLiked(
            post?.isLiked === true
        );

        setLikeCount(
            Number(post?.likesCount || 0)
        );

    }, [
        post?._id,
        post?.isLiked,
        post?.likesCount,
    ]);



    const [playing, setPlaying] =
        useState(false);

    const [audio, setAudio] =
        useState(null);

    const [currentTime, setCurrentTime] =
        useState(0);

    const [audioDuration, setAudioDuration] =
        useState(0);



    useEffect(() => {

        if (!post?.voiceFile) {

            setAudio(null);
            setCurrentTime(0);
            setAudioDuration(0);

            return;
        }


        const audioElement =
            new Audio(post.voiceFile);

        audioElement.preload =
            "metadata";


        const handleLoadedMetadata = () => {

            if (
                Number.isFinite(
                    audioElement.duration
                )
            ) {

                setAudioDuration(
                    audioElement.duration
                );

            }

        };


        const handleTimeUpdate = () => {

            setCurrentTime(
                audioElement.currentTime || 0
            );

        };


        const handleEnded = () => {

            setPlaying(false);
            setCurrentTime(0);

        };


        const handleError = (error) => {

            console.error(
                "Audio loading error:",
                error
            );

            setPlaying(false);

        };


        audioElement.addEventListener(
            "loadedmetadata",
            handleLoadedMetadata
        );

        audioElement.addEventListener(
            "timeupdate",
            handleTimeUpdate
        );

        audioElement.addEventListener(
            "ended",
            handleEnded
        );

        audioElement.addEventListener(
            "error",
            handleError
        );


        setAudio(audioElement);


        return () => {

            audioElement.pause();

            audioElement.removeEventListener(
                "loadedmetadata",
                handleLoadedMetadata
            );

            audioElement.removeEventListener(
                "timeupdate",
                handleTimeUpdate
            );

            audioElement.removeEventListener(
                "ended",
                handleEnded
            );

            audioElement.removeEventListener(
                "error",
                handleError
            );

        };

    }, [post?.voiceFile]);



    const [showComments, setShowComments] =
        useState(false);

    const [comments, setComments] =
        useState([]);

    const [commentsLoading, setCommentsLoading] =
        useState(false);

    const [commentLoading, setCommentLoading] =
        useState(false);

    const [commentText, setCommentText] =
        useState("");

    const [commentError, setCommentError] =
        useState("");

    const [editingCommentId, setEditingCommentId] =
        useState(null);

    const [editText, setEditText] =
        useState("");



    const [isBkd, setIsBkd] =
        useState(false);

    const [bookmarkLoading, setBookmarkLoading] =
        useState(false);



    useEffect(() => {

        const loadBookmarkStatus =
            async () => {

                if (!post?._id) {
                    return;
                }


                try {

                    const response =
                        await checkBookmark(
                            post._id
                        );


                    setIsBkd(
                        response?.data?.bookmarked === true
                    );

                } catch (error) {

                    console.error(
                        "Bookmark status error:",
                        error
                    );

                }

            };


        loadBookmarkStatus();

    }, [post?._id]);



    const loadComments =
        async () => {

            if (!post?._id) {
                return;
            }


            try {

                setCommentsLoading(true);
                setCommentError("");


                const response =
                    await getVoiceComments(
                        post._id
                    );


                setComments(
                    response?.data || []
                );

            } catch (error) {

                console.error(
                    "Comments error:",
                    error
                );


                setCommentError(
                    error?.message ||
                    "Failed to load comments"
                );

            } finally {

                setCommentsLoading(false);

            }

        };



    const handleReply =
        async (e) => {

            e.stopPropagation();


            const next =
                !showComments;


            setShowComments(next);


            if (
                next &&
                comments.length === 0
            ) {

                await loadComments();

            }

        };



    const handleAddComment =
        async (e) => {

            e.preventDefault();
            e.stopPropagation();


            const content =
                commentText.trim();


            if (!content) {
                return;
            }


            try {

                setCommentLoading(true);
                setCommentError("");


                const response =
                    await addComment(
                        post._id,
                        content
                    );


                const newComment =
                    response?.data;


                if (newComment) {

                    setCommentText("");

                    await loadComments();

                }

            } catch (error) {

                console.error(
                    "Add comment error:",
                    error
                );


                setCommentError(
                    error?.message ||
                    "Failed to add comment"
                );

            } finally {

                setCommentLoading(false);

            }

        };



    const startEdit =
        (comment) => {

            setEditingCommentId(
                comment._id
            );

            setEditText(
                comment.content || ""
            );

        };



    const cancelEdit =
        () => {

            setEditingCommentId(null);
            setEditText("");

        };



    const handleUpdateComment =
        async (commentId) => {

            const content =
                editText.trim();


            if (!content) {
                return;
            }


            try {

                setCommentLoading(true);
                setCommentError("");


                await updateComment(
                    commentId,
                    content
                );


                setEditingCommentId(null);
                setEditText("");


                await loadComments();

            } catch (error) {

                console.error(
                    "Update comment error:",
                    error
                );


                setCommentError(
                    error?.message ||
                    "Failed to update comment"
                );

            } finally {

                setCommentLoading(false);

            }

        };



    const handleDeleteComment =
        async (commentId) => {

            const confirmed =
                window.confirm(
                    "Delete this comment?"
                );


            if (!confirmed) {
                return;
            }


            try {

                setCommentLoading(true);
                setCommentError("");


                await deleteComment(
                    commentId
                );


                await loadComments();

            } catch (error) {

                console.error(
                    "Delete comment error:",
                    error
                );


                setCommentError(
                    error?.message ||
                    "Failed to delete comment"
                );

            } finally {

                setCommentLoading(false);

            }

        };



    const handleLike =
        async (e) => {

            e.stopPropagation();


            if (
                likeLoading ||
                !post?._id
            ) {
                return;
            }



            const previousLiked =
                liked;

            const previousCount =
                likeCount;



            const optimisticLiked =
                !previousLiked;


            const optimisticCount =
                optimisticLiked
                    ? previousCount + 1
                    : Math.max(
                        0,
                        previousCount - 1
                    );


            setLiked(
                optimisticLiked
            );

            setLikeCount(
                optimisticCount
            );


            try {

                setLikeLoading(true);


                const response =
                    await toggleVoiceLike(
                        post._id
                    );


                // formats

                const serverLiked =
                    response?.data?.liked ??
                    response?.data?.isLiked;


                const likedNow =
                    typeof serverLiked === "boolean"
                        ? serverLiked
                        : optimisticLiked;


                // Get server count if backend sends it

                const serverCount =
                    response?.data?.likesCount ??
                    response?.data?.likeCount;


                setLiked(
                    likedNow
                );


                if (
                    typeof serverCount === "number"
                ) {

                    setLikeCount(
                        Math.max(
                            0,
                            serverCount
                        )
                    );

                } else {

                    setLikeCount(
                        (count) => {

                            // as our optimistic state,
                            // keep count.

                            if (
                                likedNow ===
                                optimisticLiked
                            ) {

                                return count;

                            }


                            // Backend state differs.
                            // original state.

                            if (
                                likedNow &&
                                !previousLiked
                            ) {

                                return (
                                    previousCount + 1
                                );

                            }


                            if (
                                !likedNow &&
                                previousLiked
                            ) {

                                return Math.max(
                                    0,
                                    previousCount - 1
                                );

                            }


                            return previousCount;

                        }
                    );

                }



                if (onLikeChange) {

                    onLikeChange(
                        post._id,
                        likedNow,
                        typeof serverCount === "number"
                            ? serverCount
                            : undefined
                    );

                }

            } catch (error) {

                console.error(
                    "Like error:",
                    error
                );



                setLiked(
                    previousLiked
                );

                setLikeCount(
                    previousCount
                );

            } finally {

                setLikeLoading(false);

            }

        };



    const handlePlay =
        async (e) => {

            e.stopPropagation();


            if (!audio) {
                return;
            }


            try {

                if (playing) {

                    audio.pause();

                    setPlaying(false);

                } else {

                    await audio.play();

                    setPlaying(true);

                }

            } catch (error) {

                console.error(
                    "Audio playback error:",
                    error
                );

                setPlaying(false);

            }

        };



    const handleBookmark =
        async (e) => {

            e.stopPropagation();


            if (
                bookmarkLoading ||
                !post?._id
            ) {
                return;
            }


            const previousBookmark =
                isBkd;



            setIsBkd(
                !previousBookmark
            );


            try {

                setBookmarkLoading(true);


                const response =
                    await toggleBookmark(
                        post._id
                    );


                const bookmarkedNow =
                    response?.data?.bookmarked;


                if (
                    typeof bookmarkedNow ===
                    "boolean"
                ) {

                    setIsBkd(
                        bookmarkedNow
                    );

                }

            } catch (error) {

                console.error(
                    "Bookmark error:",
                    error
                );



                setIsBkd(
                    previousBookmark
                );

            } finally {

                setBookmarkLoading(false);

            }

        };



    const goUser =
        (e) => {

            e.stopPropagation();


            if (
                !isAnon &&
                author?._id
            ) {

                navigate(
                    "user",
                    author
                );

            }

        };



    const handleShare =
        async (e) => {

            e.stopPropagation();


            try {

                const url =
                    `${window.location.origin}/voice/${post._id}`;


                if (
                    navigator.share
                ) {

                    await navigator.share({

                        title:
                            post.title ||
                            "WeVoc Voice",

                        text:
                            post.description ||
                            "Check out this voice on WeVoc",

                        url,

                    });

                } else {

                    await navigator.clipboard
                        .writeText(url);


                    alert(
                        "Voice link copied!"
                    );

                }

            } catch (error) {

                // is not an actual error.

                console.log(
                    "Share cancelled"
                );

            }

        };



    const formatDuration =
        (seconds) => {

            if (
                seconds === undefined ||
                seconds === null ||
                isNaN(seconds) ||
                !Number.isFinite(seconds)
            ) {

                return "0:00";

            }


            const mins =
                Math.floor(
                    seconds / 60
                );


            const secs =
                Math.floor(
                    seconds % 60
                );


            return `${mins}:${secs
                .toString()
                .padStart(2, "0")}`;

        };



    const commentCount =
        showComments
            ? comments.length
            : (
                post?.commentsCount ||
                post?.commentCount ||
                0
            );



    const score =
        post?.score ??
        (
            (post?.views || 0) +
            likeCount * 5
        );



    return (

        <article
            className={`post-card${
                className
                    ? ` ${className}`
                    : ""
            }`}
            style={style}
        >



            <Avatar
                name={
                    isAnon
                        ? "?"
                        : displayName
                }
                src={
                    isAnon
                        ? undefined
                        : author?.avatar
                }
                size="md"
                onClick={
                    isAnon
                        ? undefined
                        : goUser
                }
            />




            <div className="post-body-col">




                <div className="post-header">

                    <div className="post-meta">

                        {isAnon ? (

                            <span className="anon-pill">

                                <ProfileIcon />

                                Anonymous

                            </span>

                        ) : (

                            <>

                                <span
                                    className="post-name"
                                    onClick={goUser}
                                >
                                    {displayName}
                                </span>


                                <span className="post-handle">
                                    {displayHandle}
                                </span>


                                <span className="post-sep">
                                    ·
                                </span>

                            </>

                        )}


                        <span className="post-time">

                            {post?.createdAt
                                ? timeAgo(
                                    post.createdAt
                                )
                                : ""
                            }

                        </span>

                    </div>


                    <button
                        type="button"
                        className="post-more-btn"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        ···
                    </button>

                </div>




                {post?.title && (

                    <div className="post-title-box">

                        {post.title}

                    </div>

                )}




                {post?.description && (

                    <p className="post-text">

                        {post.description}

                    </p>

                )}




                <div className="audio-player">

                    <button
                        type="button"
                        className="play-btn"
                        onClick={handlePlay}
                        disabled={!audio}
                    >

                        {playing
                            ? <PauseIcon />
                            : <PlayIcon />
                        }

                    </button>


                    <Waveform
                        playing={playing}
                    />


                    <span className="audio-dur">

                        {formatDuration(
                            currentTime
                        )}

                        {" / "}

                        {formatDuration(
                            audioDuration ||
                            post?.duration
                        )}

                    </span>

                </div>




                <div className="post-actions">




                    <button
                        type="button"
                        className="act-btn act-reply"
                        onClick={
                            handleReply
                        }
                    >

                        <span className="act-ico">

                            <ReplyIcon />

                        </span>


                        <span className="act-num">

                            {commentCount}

                        </span>

                    </button>




                    <button
                        type="button"
                        className={`act-btn${
                            liked
                                ? " liked"
                                : ""
                        }`}
                        onClick={
                            handleLike
                        }
                        disabled={
                            likeLoading
                        }
                        aria-label={
                            liked
                                ? "Unlike voice"
                                : "Like voice"
                        }
                    >

                        <span className="act-ico">

                            {liked
                                ? <HeartIcon
                                    fill="currentColor"
                                    stroke="currentColor"
                                />
                                : <HeartOutlineIcon
                                    fill="none"
                                    stroke="currentColor"
                                />
                            }

                        </span>


                        <span className="act-num">

                            {likeCount}

                        </span>

                    </button>




                    <button
                        type="button"
                        className={`act-btn${
                            isBkd
                                ? " liked"
                                : ""
                        }`}
                        onClick={
                            handleBookmark
                        }
                        disabled={
                            bookmarkLoading
                        }
                        title={
                            isBkd
                                ? "Remove bookmark"
                                : "Save voice"
                        }
                    >

                        <span
                            className="act-ico"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "center",
                            }}
                        >

                            <BookmarkIcon
                                fill={
                                    isBkd
                                        ? "currentColor"
                                        : "none"
                                }
                                stroke="currentColor"
                                strokeWidth={
                                    isBkd
                                        ? "1.6"
                                        : "1.8"
                                }
                            />

                        </span>

                    </button>




                    <button
                        type="button"
                        className="act-btn act-share"
                        onClick={
                            handleShare
                        }
                    >

                        <span className="act-ico">

                            <ShareIcon />

                        </span>

                    </button>




                    <div className="score-badge">

                        <FlameIcon />

                        {score}

                    </div>

                </div>




                {showComments && (

                    <div
                        style={{
                            marginTop: 12,
                        }}
                    >



                        <form
                            onSubmit={
                                handleAddComment
                            }
                            style={{
                                display: "flex",
                                gap: 8,
                                marginBottom: 12,
                            }}
                        >

                            <input
                                className="field"
                                type="text"
                                placeholder="Write a comment..."
                                value={
                                    commentText
                                }
                                onChange={(e) =>
                                    setCommentText(
                                        e.target.value
                                    )
                                }
                                disabled={
                                    commentLoading
                                }
                            />


                            <button
                                type="submit"
                                className="btn btn-primary btn-sm"
                                disabled={
                                    commentLoading ||
                                    !commentText.trim()
                                }
                            >

                                {commentLoading
                                    ? "..."
                                    : "Send"
                                }

                            </button>

                        </form>




                        {commentError && (

                            <div
                                className="auth-error"
                                style={{
                                    marginBottom: 10,
                                }}
                            >

                                {commentError}

                            </div>

                        )}




                        {commentsLoading && (

                            <div
                                className="empty-sub"
                                style={{
                                    padding:
                                        "10px 0",
                                }}
                            >
                                Loading comments...
                            </div>

                        )}




                        {!commentsLoading &&
                            comments.length === 0 && (

                                <div
                                    className="empty-sub"
                                    style={{
                                        padding:
                                            "10px 0",
                                    }}
                                >
                                    No comments yet.
                                    Be the first to comment.
                                </div>

                            )}




                        {!commentsLoading &&
                            comments.map(
                                (comment) => {

                                    const commentOwner =
                                        comment.owner;


                                    const isOwner =
                                        user?._id &&
                                        commentOwner?._id &&
                                        String(
                                            user._id
                                        ) ===
                                        String(
                                            commentOwner._id
                                        );


                                    return (

                                        <div
                                            key={
                                                comment._id
                                            }
                                            style={{
                                                display:
                                                    "flex",
                                                gap: 10,
                                                padding:
                                                    "10px 0",
                                                borderBottom:
                                                    "1px solid var(--border)",
                                            }}
                                        >

                                            <Avatar
                                                name={
                                                    commentOwner?.fullname ||
                                                    "User"
                                                }
                                                src={
                                                    commentOwner?.avatar
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    navigate(
                                                        "user",
                                                        commentOwner
                                                    )
                                                }
                                            />


                                            <div
                                                style={{
                                                    flex: 1,
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        gap: 8,
                                                    }}
                                                >

                                                    <div>

                                                        <strong>

                                                            {
                                                                commentOwner?.fullname ||
                                                                "Unknown User"
                                                            }

                                                        </strong>


                                                        <span
                                                            style={{
                                                                marginLeft:
                                                                    6,
                                                                color:
                                                                    "var(--ink3)",
                                                                fontSize:
                                                                    12,
                                                            }}
                                                        >
                                                            @
                                                            {
                                                                commentOwner?.username
                                                            }
                                                        </span>

                                                    </div>


                                                    {isOwner && (

                                                        <div
                                                            style={{
                                                                display:
                                                                    "flex",
                                                                gap: 5,
                                                            }}
                                                        >

                                                            <button
                                                                type="button"
                                                                className="btn btn-ghost btn-sm"
                                                                onClick={() =>
                                                                    startEdit(
                                                                        comment
                                                                    )
                                                                }
                                                                disabled={
                                                                    commentLoading
                                                                }
                                                            >
                                                                Edit
                                                            </button>


                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() =>
                                                                    handleDeleteComment(
                                                                        comment._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    commentLoading
                                                                }
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    )}

                                                </div>




                                                {editingCommentId ===
                                                comment._id ? (

                                                    <div
                                                        style={{
                                                            marginTop:
                                                                8,
                                                            display:
                                                                "flex",
                                                            gap: 8,
                                                        }}
                                                    >

                                                        <input
                                                            className="field"
                                                            value={
                                                                editText
                                                            }
                                                            onChange={(e) =>
                                                                setEditText(
                                                                    e.target.value
                                                                )
                                                            }
                                                        />


                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() =>
                                                                handleUpdateComment(
                                                                    comment._id
                                                                )
                                                            }
                                                            disabled={
                                                                commentLoading ||
                                                                !editText.trim()
                                                            }
                                                        >
                                                            Save
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="btn btn-ghost btn-sm"
                                                            onClick={
                                                                cancelEdit
                                                            }
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>

                                                ) : (

                                                    <p
                                                        style={{
                                                            margin:
                                                                "5px 0 0",
                                                        }}
                                                    >

                                                        {
                                                            comment.content
                                                        }

                                                    </p>

                                                )}


                                                <div
                                                    style={{
                                                        fontSize:
                                                            11,
                                                        color:
                                                            "var(--ink3)",
                                                        marginTop:
                                                            4,
                                                    }}
                                                >

                                                    {comment.createdAt
                                                        ? timeAgo(
                                                            comment.createdAt
                                                        )
                                                        : ""
                                                    }

                                                </div>

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                    </div>

                )}

            </div>

        </article>

    );

}