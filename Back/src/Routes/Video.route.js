import { Router } from "express";
import { Upload } from "../Middlewares/multer.middleware.js";
import {
    uploadvideo,
    deletevideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    togglePublishStatus
} from "../Controllers/video.controller.js";
import Authstatus from "../Middlewares/Authstatus.middleware.js";

const router = Router();

router.route("/videoupload").post(Authstatus, Upload.fields(
    [
        {
            name: "video",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]
)
    , uploadvideo);
router.route("/videoupdate/:videoId").patch(Authstatus, Upload.single("thumbnail"), updateVideo);
router.route("/publish-status/:videoId").patch(Authstatus, togglePublishStatus);
router.route("/videodelete/:videoId").delete(Authstatus, deletevideo);
router.route("/videos").get(getAllVideos);
router.route("/videobyid/:videoId").get(getVideoById);

export default router;