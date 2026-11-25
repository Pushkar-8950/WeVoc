import "./ComposeBox.css";
import { useEffect, useRef, useState } from "react";

import { publishVoice } from "../api/voice.api";
import { MicIcon, StopIcon } from "../components/Icons";


export default function ComposeBox({
    communityId = null,
    onPublished,
}) {


    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [voiceFile, setVoiceFile] =
        useState(null);

    const [audioMode, setAudioMode] =
        useState("upload");

    const [isAnonymous, setIsAnonymous] =
        useState(false);

    const [recording, setRecording] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");



    const audioInputRef =
        useRef(null);

    const mediaRecorderRef =
        useRef(null);

    const mediaStreamRef =
        useRef(null);

    const recordedChunksRef =
        useRef([]);

    const mountedRef =
        useRef(false);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
            const recorder =
                mediaRecorderRef.current;

            if (recorder && recorder.state !== "inactive") {
                recorder.ondataavailable = null;
                recorder.onstop = null;
                recorder.onerror = null;
                recorder.stop();
            }

            mediaStreamRef.current
                ?.getTracks()
                .forEach(track => track.stop());
        };
    }, []);



    const handleVoiceFile =
        (e) => {

            const file =
                e.target.files?.[0];

            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "audio/"
                )
            ) {
                setVoiceFile(null);
                e.target.value = "";

                setError(
                    "Please select a valid audio file."
                );

                return;

            }


            setVoiceFile(file);
            setError("");
            setSuccess("");

        };

    const handleAudioModeChange = (mode) => {
        if (recording || mode === audioMode) {
            return;
        }

        setAudioMode(mode);
        setVoiceFile(null);
        setError("");
        setSuccess("");

        if (audioInputRef.current) {
            audioInputRef.current.value = "";
        }
    };



    const handlePublish =
        async (e) => {

            e.preventDefault();


            setError("");
            setSuccess("");



            if (!title.trim()) {

                setError(
                    "Please enter a title."
                );

                return;

            }


            if (!description.trim()) {

                setError(
                    "Please enter a description."
                );

                return;

            }


            if (!voiceFile) {

                setError(
                    "Choose an audio file or record your voice."
                );

                return;

            }


            try {

                setLoading(true);



                await publishVoice({

                    title:
                        title.trim(),

                    description:
                        description.trim(),

                    voiceFile,

                    isAnonymous,

                    communityId,

                });



                setTitle("");
                setDescription("");
                setVoiceFile(null);
                setIsAnonymous(false);


                if (
                    audioInputRef.current
                ) {

                    audioInputRef.current.value =
                        "";

                }


                setSuccess(
                    communityId
                        ? "Voice posted in community successfully!"
                        : "Voice posted successfully!"
                );



                if (onPublished) {

                    await onPublished();

                }

            } catch (error) {

                console.error(
                    "Publish voice error:",
                    error
                );


                setError(
                    error?.message ||
                    "Failed to publish voice."
                );

            } finally {

                setLoading(false);

            }

        };



    const handleRecording = async () => {
        if (recording) {
            if (mediaRecorderRef.current?.state === "recording") {
                mediaRecorderRef.current.stop();
            }
            return;
        }

        if (
            !navigator.mediaDevices?.getUserMedia ||
            typeof MediaRecorder === "undefined"
        ) {
            setError("Audio recording is not supported in this browser.");
            return;
        }

        setError("");
        setSuccess("");
        setVoiceFile(null);

        try {
            const stream =
                await navigator.mediaDevices.getUserMedia({ audio: true });

            if (!mountedRef.current) {
                stream.getTracks().forEach(track => track.stop());
                return;
            }

            mediaStreamRef.current = stream;
            const recorder = new MediaRecorder(stream);
            recordedChunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const chunks = recordedChunksRef.current;
                recordedChunksRef.current = [];
                const mimeType =
                    recorder.mimeType ||
                    chunks[0]?.type ||
                    "audio/webm";

                stream.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
                mediaRecorderRef.current = null;

                if (!mountedRef.current) {
                    return;
                }

                setRecording(false);

                if (chunks.length === 0) {
                    setError("No audio was captured. Please try again.");
                    return;
                }

                const extension = mimeType.includes("ogg")
                    ? "ogg"
                    : mimeType.includes("mp4")
                        ? "m4a"
                        : "webm";

                setVoiceFile(
                    new File(
                        [new Blob(chunks, { type: mimeType })],
                        `voice-recording.${extension}`,
                        { type: mimeType }
                    )
                );
            };

            recorder.onerror = (event) => {
                console.error("Voice recording failed:", event.error);
                recordedChunksRef.current = [];
                recorder.onstop = null;
                stream.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
                mediaRecorderRef.current = null;

                if (!mountedRef.current) {
                    return;
                }

                setRecording(false);
                setError(
                    event.error?.message ||
                    "Recording failed. Please try again."
                );
            };

            mediaRecorderRef.current = recorder;
            recorder.start();
            setRecording(true);
        } catch (error) {
            mediaStreamRef.current
                ?.getTracks()
                .forEach(track => track.stop());
            mediaStreamRef.current = null;
            mediaRecorderRef.current = null;
            recordedChunksRef.current = [];

            if (!mountedRef.current) {
                return;
            }

            console.error("Microphone access failed:", error);
            setError(
                error?.name === "NotAllowedError"
                    ? "Allow microphone access to record audio."
                    : error?.message || "Could not start recording."
            );
        }
    };



    return (

        <form
            className="compose-box"
            onSubmit={handlePublish}
        >



            <div
                className="compose-header"
            >

                <div
                    className="compose-title"
                >

                    <MicIcon />

                    {communityId
                        ? "Post in Community"
                        : "Create post"}

                </div>

            </div>




            <input
                type="text"
                className="compose-title-input"
                placeholder="Title..."
                value={title}
                maxLength={100}
                onChange={(e) =>
                    setTitle(
                        e.target.value
                    )
                }
            />




            <textarea
                className="compose-textarea"
                placeholder={
                    communityId
                        ? "What do you want to share with your community?"
                        : "What's on your mind?"
                }
                value={description}
                maxLength={500}
                rows={4}
                onChange={(e) =>
                    setDescription(
                        e.target.value
                    )
                }
            />




            <div className="compose-audio-source">
                <div
                    className="compose-audio-modes"
                    role="group"
                    aria-label="Choose how to add audio"
                >
                    <button
                        type="button"
                        className={`compose-audio-mode${
                            audioMode === "upload"
                                ? " active"
                                : ""
                        }`}
                        aria-pressed={audioMode === "upload"}
                        disabled={recording}
                        onClick={() =>
                            handleAudioModeChange("upload")
                        }
                    >
                        <MicIcon />
                        Upload audio
                    </button>
                    <button
                        type="button"
                        className={`compose-audio-mode${
                            audioMode === "record"
                                ? " active"
                                : ""
                        }`}
                        aria-pressed={audioMode === "record"}
                        disabled={recording}
                        onClick={() =>
                            handleAudioModeChange("record")
                        }
                    >
                        <MicIcon />
                        Record audio
                    </button>
                </div>

                {audioMode === "upload" ? (
                    <div className="compose-file-row">
                        <input
                            ref={audioInputRef}
                            type="file"
                            accept="audio/*"
                            id="voice-file-input"
                            onChange={handleVoiceFile}
                            hidden
                        />
                        <label
                            htmlFor="voice-file-input"
                            className="compose-upload-button"
                        >
                            <MicIcon />
                            Choose an audio file
                        </label>
                        {voiceFile && (
                            <span className="compose-file-name">
                                {voiceFile.name}
                            </span>
                        )}
                    </div>
                ) : (
                    <div
                        className={`compose-record-row${
                            recording
                                ? " is-recording"
                                : ""
                        }`}
                    >
                        <button
                            type="button"
                            className={`rec-btn${
                                recording
                                    ? " recording"
                                    : ""
                            }`}
                            aria-pressed={recording}
                            aria-label={
                                recording
                                    ? "Stop recording"
                                    : "Start recording"
                            }
                            title={
                                recording
                                    ? "Stop recording"
                                    : "Start recording"
                            }
                            onClick={handleRecording}
                        >
                            {recording
                                ? <StopIcon />
                                : <MicIcon />}
                        </button>
                        <span aria-live="polite">
                            {recording
                                ? "Recording in progress"
                                : voiceFile
                                    ? "Recording ready"
                                    : "Record from your microphone"}
                        </span>
                        {voiceFile && (
                            <span className="compose-file-name">
                                {voiceFile.name}
                            </span>
                        )}
                    </div>
                )}
            </div>




            <label
                className={`compose-anonymous${
                    isAnonymous ? " active" : ""
                }`}
            >

                <input
                    type="checkbox"
                    checked={
                        isAnonymous
                    }
                    onChange={(e) =>
                        setIsAnonymous(
                            e.target.checked
                        )
                    }
                />

                <span>
                    Post anonymously
                </span>

            </label>




            {error && (

                <div
                    className="compose-error"
                >

                    {error}

                </div>

            )}




            {success && (

                <div
                    className="compose-success"
                >

                    {success}

                </div>

            )}




            <div
                className="compose-footer"
            >

                {communityId && (
                    <div className="compose-community-note">
                        Only this community will see this post.
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >

                    {loading
                        ? "Publishing..."
                        : communityId
                            ? "Post to Community"
                            : "Publish Post"}

                </button>

            </div>

        </form>

    );

}