import { Router } from "express";
import Authstatus from "../Middlewares/Authstatus.middleware.js";
import {
    getChannelStats,
    getchannelvedios
} from "../Controllers/dashboard.controller.js";

const router = Router();
router.use(Authstatus);
router.route("/stats/:channelId").get(getChannelStats);
router.route("/videos/:channelId").get(getchannelvedios);

export default router;