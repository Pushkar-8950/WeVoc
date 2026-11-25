import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

import { Voice } from "../models/voice.model.js";
import { Community } from "../models/community.model.js";
import { CommunityMember } from "../models/communityMember.model.js";

import { isValidObjectId } from "mongoose";



const publishVoice = asyncHandler(async (req, res) => {

    const {
        title,
        description,
        isAnonymous,
        communityId
    } = req.body;



    if (!title?.trim()) {
        throw new ApiError(
            400,
            "Title is required"
        );
    }


    if (!description?.trim()) {
        throw new ApiError(
            400,
            "Description is required"
        );
    }



    const voiceFileLocalPath =
        req.file?.path;


    if (!voiceFileLocalPath) {
        throw new ApiError(
            400,
            "Voice file is required"
        );
    }


    let community = null;


    if (communityId) {

        if (
            !isValidObjectId(communityId)
        ) {

            throw new ApiError(
                400,
                "Invalid community id"
            );

        }


        community =
            await Community.findById(
                communityId
            );


        if (!community) {

            throw new ApiError(
                404,
                "Community not found"
            );

        }


        // Check whether current user is member

        const membership =
            await CommunityMember.findOne({

                community: communityId,

                user: req.user._id

            });


        if (!membership) {

            throw new ApiError(
                403,
                "You must join the community before posting"
            );

        }

    }



    const voiceFile =
        await uploadOnCloudinary(
            voiceFileLocalPath
        );


    if (
        !voiceFile ||
        !voiceFile.url
    ) {

        throw new ApiError(
            400,
            "Error while uploading voice"
        );

    }



    const voice =
        await Voice.create({

            title:
                title.trim(),

            description:
                description.trim(),

            voiceFile:
                voiceFile.url,

            owner:
                req.user._id,

            community:
                community
                    ? community._id
                    : null,

            duration:
                voiceFile.duration || 0,

            isAnonymous:
                isAnonymous === true ||
                isAnonymous === "true",

            isPublished:
                true

        });



    if (community) {

        await Community.findByIdAndUpdate(
            community._id,
            {
                $inc: {
                    postsCount: 1
                }
            }
        );

    }



    const createdVoice =
        await Voice.findById(
            voice._id
        )
        .populate(
            "owner",
            "fullname username avatar"
        )
        .populate(
            "community",
            "name description college icon tags"
        );



    return res.status(201).json(

        new ApiResponse(
            201,
            createdVoice,
            community
                ? "Voice posted in community successfully"
                : "Voice uploaded successfully"
        )

    );

});



const getAllVoices = asyncHandler(async (req, res) => {

    const page =
        parseInt(req.query.page) || 1;

    const limit =
        parseInt(req.query.limit) || 10;

    const skip =
        (page - 1) * limit;


    const voices =
        await Voice.aggregate([

            {
                $match: {
                    isPublished: true
                }
            },



            {
                $lookup: {

                    from: "users",

                    localField: "owner",

                    foreignField: "_id",

                    as: "owner",

                    pipeline: [

                        {
                            $project: {

                                fullname: 1,

                                username: 1,

                                avatar: 1

                            }
                        }

                    ]

                }
            },


            {
                $addFields: {

                    owner: {
                        $first: "$owner"
                    }

                }

            },



            {
                $lookup: {

                    from: "communities",

                    localField: "community",

                    foreignField: "_id",

                    as: "community",

                    pipeline: [

                        {
                            $project: {

                                name: 1,

                                description: 1,

                                college: 1,

                                icon: 1,

                                tags: 1

                            }

                        }

                    ]

                }

            },


            {
                $addFields: {

                    community: {
                        $first: "$community"
                    }

                }

            },



            {
                $lookup: {

                    from: "likes",

                    localField: "_id",

                    foreignField: "voice",

                    as: "likes"

                }

            },


            {
                $addFields: {

                    likesCount: {
                        $size: "$likes"
                    }

                }

            },


            {
                $project: {
                    likes: 0
                }

            },


            {
                $sort: {
                    createdAt: -1
                }

            },


            {
                $skip: skip
            },


            {
                $limit: limit
            }

        ]);


    const totalVoices =
        await Voice.countDocuments({
            isPublished: true
        });


    return res.status(200).json(

        new ApiResponse(
            200,
            {
                voices,
                page,
                limit,
                totalVoices,
                totalPages:
                    Math.ceil(
                        totalVoices / limit
                    )
            },
            "Voices fetched successfully"
        )

    );

});



const getCommunityVoices = asyncHandler(
    async (req, res) => {

        const {
            communityId
        } = req.params;


        if (
            !isValidObjectId(
                communityId
            )
        ) {

            throw new ApiError(
                400,
                "Invalid community id"
            );

        }


        const community =
            await Community.findById(
                communityId
            );


        if (!community) {

            throw new ApiError(
                404,
                "Community not found"
            );

        }


        const voices =
            await Voice.find({

                community: communityId,

                isPublished: true

            })
            .populate(
                "owner",
                "fullname username avatar"
            )
            .populate(
                "community",
                "name description college icon tags"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json(

            new ApiResponse(
                200,
                voices,
                "Community voices fetched successfully"
            )

        );

    }
);



const getVoiceById = asyncHandler(
    async (req, res) => {

        const {
            voiceId
        } = req.params;


        if (
            !isValidObjectId(
                voiceId
            )
        ) {

            throw new ApiError(
                400,
                "Invalid voice id"
            );

        }


        const voice =
            await Voice.findByIdAndUpdate(
                voiceId,
                {
                    $inc: {
                        views: 1
                    }
                },
                {
                    new: true
                }
            )
            .populate(
                "owner",
                "fullname username avatar"
            )
            .populate(
                "community",
                "name description college icon tags"
            );


        if (!voice) {

            throw new ApiError(
                404,
                "Voice not found"
            );

        }


        return res.status(200).json(

            new ApiResponse(
                200,
                voice,
                "Voice fetched successfully"
            )

        );

    }
);



const updateVoice = asyncHandler(
    async (req, res) => {

        const {
            voiceId
        } = req.params;


        if (
            !isValidObjectId(
                voiceId
            )
        ) {

            throw new ApiError(
                400,
                "Invalid voice id"
            );

        }


        const {
            title,
            description
        } = req.body;


        const voice =
            await Voice.findById(
                voiceId
            );


        if (!voice) {

            throw new ApiError(
                404,
                "Voice not found"
            );

        }


        if (
            voice.owner.toString() !==
            req.user._id.toString()
        ) {

            throw new ApiError(
                403,
                "You are not allowed to update this voice"
            );

        }


        const updatedVoice =
            await Voice.findByIdAndUpdate(

                voiceId,

                {
                    $set: {

                        title:
                            title?.trim() ||
                            voice.title,

                        description:
                            description?.trim() ||
                            voice.description

                    }
                },

                {
                    new: true
                }

            )
            .populate(
                "owner",
                "fullname username avatar"
            )
            .populate(
                "community",
                "name description college icon tags"
            );


        return res.status(200).json(

            new ApiResponse(
                200,
                updatedVoice,
                "Voice updated successfully"
            )

        );

    }
);



const deleteVoice = asyncHandler(
    async (req, res) => {

        const {
            voiceId
        } = req.params;


        if (
            !isValidObjectId(
                voiceId
            )
        ) {

            throw new ApiError(
                400,
                "Invalid voice id"
            );

        }


        const voice =
            await Voice.findById(
                voiceId
            );


        if (!voice) {

            throw new ApiError(
                404,
                "Voice not found"
            );

        }


        if (
            voice.owner.toString() !==
            req.user._id.toString()
        ) {

            throw new ApiError(
                403,
                "You are not allowed to delete this voice"
            );

        }


        if (voice.community) {

            await Community.findByIdAndUpdate(
                voice.community,
                {
                    $inc: {
                        postsCount: -1
                    }
                }
            );

        }


        await Voice.findByIdAndDelete(
            voiceId
        );


        return res.status(200).json(

            new ApiResponse(
                200,
                {},
                "Voice deleted successfully"
            )

        );

    }
);


export {
    publishVoice,
    getAllVoices,
    getCommunityVoices,
    getVoiceById,
    updateVoice,
    deleteVoice
};