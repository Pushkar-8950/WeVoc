import apiClient from "./apiClient";

export const getAdminDashboard = async () => {
    return apiClient("/admin/dashboard", {
        method: "GET",
    });
};


export const getAdminUsers = async (
    page = 1,
    limit = 20,
    search = ""
) => {

    const params = new URLSearchParams({
        page,
        limit,
    });

    if (search.trim()) {
        params.append("search", search.trim());
    }

    return apiClient(
        `/admin/users?${params.toString()}`,
        {
            method: "GET",
        }
    );
};


export const deleteAdminUser = async (userId) => {

    return apiClient(
        `/admin/users/${userId}`,
        {
            method: "DELETE",
        }
    );
};


export const getAdminVoices = async (
    page = 1,
    limit = 20,
    search = ""
) => {

    const params = new URLSearchParams({
        page,
        limit,
    });

    if (search.trim()) {
        params.append("search", search.trim());
    }

    return apiClient(
        `/admin/voices?${params.toString()}`,
        {
            method: "GET",
        }
    );
};


export const deleteAdminVoice = async (voiceId) => {

    return apiClient(
        `/admin/voices/${voiceId}`,
        {
            method: "DELETE",
        }
    );
};

export const getAdminUserDetails = async (userId) => {
    return apiClient(`/admin/users/${userId}`, {
        method: "GET",
    });
};