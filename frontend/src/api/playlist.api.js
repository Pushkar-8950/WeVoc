import apiClient from "./apiClient";

export const createPlaylist = async ({ name, description }) => {
    return apiClient("/playlists", {
        method: "POST",
        body: JSON.stringify({
            name,
            description,
        }),
    });
};


// Get all playlists of current user
export const getUserPlaylists = async () => {
    return apiClient("/playlists", {
        method: "GET",
    });
};


export const getPlaylistById = async (playlistId) => {
    return apiClient(`/playlists/${playlistId}`, {
        method: "GET",
    });
};


export const addVoiceToPlaylist = async (playlistId, voiceId) => {
    return apiClient(`/playlists/${playlistId}/voices/${voiceId}`, {
        method: "POST",
    });
};


export const removeVoiceFromPlaylist = async (playlistId, voiceId) => {
    return apiClient(`/playlists/${playlistId}/voices/${voiceId}`, {
        method: "DELETE",
    });
};


export const updatePlaylist = async ({
    playlistId,
    name,
    description,
}) => {
    return apiClient(`/playlists/${playlistId}`, {
        method: "PATCH",
        body: JSON.stringify({
            name,
            description,
        }),
    });
};


export const deletePlaylist = async (playlistId) => {
    return apiClient(`/playlists/${playlistId}`, {
        method: "DELETE",
    });
};