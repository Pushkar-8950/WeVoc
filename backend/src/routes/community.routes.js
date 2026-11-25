import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";

import {
    createCommunity,
    getAllCommunities,
    getCommunityById,
    joinCommunity,
    leaveCommunity,
    getCommunityMembers,
    updateCommunity,
    deleteCommunity,
    getCommunityPosts
} from "../controllers/community.controller.js";


const router = Router();


router.use(verifyJWT);


router.post(
    "/",
    createCommunity
);


router.get(
    "/",
    getAllCommunities
);


router.get(
    "/:communityId",
    getCommunityById
);


router.post(
    "/:communityId/join",
    joinCommunity
);


router.post(
    "/:communityId/leave",
    leaveCommunity
);


router.get(
    "/:communityId/members",
    getCommunityMembers
);


router.patch(
    "/:communityId",
    updateCommunity
);


router.delete(
    "/:communityId",
    deleteCommunity
);

router.get(
    "/:communityId/posts",
    getCommunityPosts
);


export default router;