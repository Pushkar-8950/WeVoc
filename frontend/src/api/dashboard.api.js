import apiClient from "./apiClient";

export const getDashboard = async () => {
    return apiClient("/dashboard", {
        method: "GET",
    });
};