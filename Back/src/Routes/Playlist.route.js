import { Router } from "express";
import Authstatus from "../Middlewares/Authstatus.middleware.js";
import {
    Createplaylist,
    getuserplaylist,
    getuserplaylistbyid,
    addvideotoplaylist,
    removevideofromplaylist,
    deleteplaylist,
    updateplaylist
} from "../Controllers/Playlist.controller.js";

const router = Router();
router.use(Authstatus);

router.route("/").post(Createplaylist);
router.route("/:playlistaid")
    .get(getuserplaylistbyid)
    .patch(updateplaylist)
    .delete(deleteplaylist);

router.route("/user/:userId").get(getuserplaylist);
router.route("/add/:playlistId/:videoId").patch(addvideotoplaylist);
router.route("/remove/:playlistId/:videoId").patch(removevideofromplaylist);

export default router;