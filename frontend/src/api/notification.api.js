import apiClient from "./apiClient";

export const getNotifications = async () => {
    return apiClient("/notifications", {
        method: "GET",
    });
};


// Mark a single notification as read
export const markAsRead = async (notificationId) => {
    return apiClient(`/notifications/${notificationId}/read`, {
        method: "PATCH",
    });
};


export const markAllAsRead = async () => {
    return apiClient("/notifications/read-all", {
        method: "PATCH",
    });
};


export const deleteNotification = async (notificationId) => {
    return apiClient(`/notifications/${notificationId}`, {
        method: "DELETE",
    });
};