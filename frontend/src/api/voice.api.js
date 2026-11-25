import apiClient from "./apiClient";


export const publishVoice = async ({
    title,
    description,
    voiceFile,
    isAnonymous = false,
    communityId = null,
}) => {

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("voiceFile", voiceFile);
    formData.append(
        "isAnonymous",
        String(isAnonymous)
    );

    if (communityId) {
        formData.append(
            "communityId",
            communityId
        );
    }

    return apiClient(
        "/voices/publish",
        {
            method: "POST",
            body: formData,
        }
    );
};



export const getAllVoices = async (
    page = 1,
    limit = 10
) => {

    return apiClient(
        `/voices?page=${page}&limit=${limit}`,
        {
            method: "GET",
        }
    );
};


export const getVoices = getAllVoices;


export const getPopularVoices = async (
    page = 1,
    limit = 20
) => {

    return apiClient(
        `/feed/trending?page=${page}&limit=${limit}`,
        {
            method: "GET",
        }
    );
};



export const getCommunityVoices = async (
    communityId
) => {

    return apiClient(
        `/voices/community/${communityId}`,
        {
            method: "GET",
        }
    );
};



export const getVoiceById = async (
    voiceId
) => {

    return apiClient(
        `/voices/${voiceId}`,
        {
            method: "GET",
        }
    );
};



export const updateVoice = async ({
    voiceId,
    title,
    description,
}) => {

    const body = {};

    if (title !== undefined) {
        body.title = title;
    }

    if (description !== undefined) {
        body.description = description;
    }

    return apiClient(
        `/voices/${voiceId}`,
        {
            method: "PATCH",
            body: JSON.stringify(body),
        }
    );
};



export const deleteVoice = async (
    voiceId
) => {

    return apiClient(
        `/voices/${voiceId}`,
        {
            method: "DELETE",
        }
    );
};