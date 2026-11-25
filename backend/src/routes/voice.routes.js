import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";

import {
    publishVoice,
    getAllVoices,
    getCommunityVoices,
    getVoiceById,
    updateVoice,
    deleteVoice
} from "../controllers/voice.controller.js";

import { upload } from "../middleware/multer.middleware.js";


const router = Router();



router.use(verifyJWT);



router.post(
    "/publish",
    upload.single("voiceFile"),
    publishVoice
);



router.get(
    "/",
    getAllVoices
);


// IMPORTANT: this must come BEFORE /:voiceId

router.get(
    "/community/:communityId",
    getCommunityVoices
);



router.get(
    "/:voiceId",
    getVoiceById
);



router.patch(
    "/:voiceId",
    updateVoice
);



router.delete(
    "/:voiceId",

    deleteVoice
);


export default router;