import apiClient from "./apiClient";

export const addToHistory = async (voiceId) => {
    return apiClient(`/history/${voiceId}`, {
        method: "POST",
    });
};


export const getHistory = async () => {
    return apiClient("/history", {
        method: "GET",
    });
};


export const clearHistory = async () => {
    return apiClient("/history", {
        method: "DELETE",
    });
};