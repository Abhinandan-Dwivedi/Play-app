import { Router } from "express";
import { Upload } from "../Middlewares/multer.middleware.js";
import {
    uploadvideo,
    deletevideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    togglePublishStatus,
    incrementView
} from "../Controllers/video.controller.js";
import Authstatus from "../Middlewares/Authstatus.middleware.js";

const router = Router();

if (process.env.NODE_ENV !== 'production') {
    router.post('/videoupload-debug', Upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]), (req, res) => {
        return res.status(200).json({
            debug: true,
            headers: req.headers,
            cookies: req.cookies || {},
            files: Object.keys(req.files || {}),
            fields: req.body || {}
        });
    });
}

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
router.route("/views/:videoId").post(Authstatus, incrementView);

export default router;