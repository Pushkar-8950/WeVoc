import { Router } from "express";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import {
    sendVoiceMessage,
    getConversations,
    getMessagesWithUser,
    getUnreadMessageCount,
    markMessagesAsRead,
} from "../controllers/message.controller.js";

const router = Router();



router.use(verifyJWT);



router.get(
    "/conversations",
    getConversations
);



router.get(
    "/unread-count",
    getUnreadMessageCount
);



router.patch(
    "/read/:userId",
    markMessagesAsRead
);



router.get(
    "/:userId",
    getMessagesWithUser
);



router.post(
    "/:receiverId",
    upload.single("voiceFile"),
    sendVoiceMessage
);


export default router;