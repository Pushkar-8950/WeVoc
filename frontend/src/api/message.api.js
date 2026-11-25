import apiClient from "./apiClient";



export const getConversations =
    async () => {

        return apiClient(
            "/messages/conversations",
            {
                method: "GET",
            }
        );
    };



export const getMessagesWithUser =
    async (userId) => {

        return apiClient(
            `/messages/${userId}`,
            {
                method: "GET",
            }
        );
    };



export const sendVoiceMessage =
    async (
        receiverId,
        voiceFile
    ) => {

        const formData =
            new FormData();

        formData.append(
            "voiceFile",
            voiceFile
        );

        return apiClient(
            `/messages/${receiverId}`,
            {
                method: "POST",
                body: formData,
            }
        );
    };



export const getUnreadMessageCount =
    async () => {

        return apiClient(
            "/messages/unread-count",
            {
                method: "GET",
            }
        );
    };



export const markMessagesAsRead =
    async (userId) => {

        return apiClient(
            `/messages/read/${userId}`,
            {
                method: "PATCH",
            }
        );
    };