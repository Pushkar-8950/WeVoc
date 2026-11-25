import apiClient from "./apiClient";

export const getSuggestedUsers = async () => {
    return apiClient("/users/suggested", {
        method: "GET",
    });
};