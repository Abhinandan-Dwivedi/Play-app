import { Router } from "express";
import Authstatus from "../Middlewares/Authstatus.middleware.js";
import {
    togglevideolike,
    togglecommentlike,
    toggletweetlike,
    getlikedvideos
} from "../Controllers/likes.controller.js";

const router = Router();
router.use(Authstatus);
router.route("/video/:videoId").post(togglevideolike);
router.route("/comment/:commentId").post(togglecommentlike);
router.route("/tweet/:tweetId").post(toggletweetlike);
router.route("/videos").get(getlikedvideos);

export default router;
