import { Router } from 'express';
import Authstatus from '../Middlewares/Authstatus.middleware.js';
import {
    Createtweet,
    updatetweet,
    deletetweet,
    getusertweets
} from '../Controllers/tweets.controller.js';

const router = Router();
router.use(Authstatus);
router.route("/").post(Createtweet);
router.route("/:tweetId").put(updatetweet).delete(deletetweet);
router.route("/:userId").get(getusertweets);

export default router;