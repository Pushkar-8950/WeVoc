import apiClient from "./apiClient";


export const getBookmarkedVoices = async () => {
    return apiClient("/bookmarks", {
        method: "GET",
    });
};


// Bookmark / unbookmark voice
export const toggleBookmark = async (voiceId) => {
    return apiClient(
        `/bookmarks/toggle/${voiceId}`,
        {
            method: "POST",
        }
    );
};


export const checkBookmark = async (voiceId) => {
    return apiClient(
        `/bookmarks/${voiceId}`,
        {
            method: "GET",
        }
    );
};