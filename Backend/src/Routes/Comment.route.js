import { Router } from "express";
import Authstatus from "../Middlewares/Authstatus.middleware.js";
import {
    createComment,
    deletecomment,
    updateComment,
    getVideoComments
} from "../Controllers/Comment.controller.js";

const router = Router();

router.route("/:videoId").get(getVideoComments);

router.route("/u/:videoId").post(Authstatus, createComment);
router.route("/c/:commentId").delete(Authstatus, deletecomment).patch(Authstatus, updateComment);

export default router;