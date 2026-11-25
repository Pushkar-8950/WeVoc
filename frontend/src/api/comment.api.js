import apiClient from "./apiClient";

export const addComment = async (voiceId, content) => {
    return apiClient(`/comments/voice/${voiceId}`, {
        method: "POST",
        body: JSON.stringify({
            content,
        }),
    });
};


// Get all comments of a voice
export const getVoiceComments = async (voiceId) => {
    return apiClient(`/comments/voice/${voiceId}`, {
        method: "GET",
    });
};


export const updateComment = async (commentId, content) => {
    return apiClient(`/comments/${commentId}`, {
        method: "PATCH",
        body: JSON.stringify({
            content,
        }),
    });
};


export const deleteComment = async (commentId) => {
    return apiClient(`/comments/${commentId}`, {
        method: "DELETE",
    });
};