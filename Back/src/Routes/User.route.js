import { Router } from "express";
import {
    Registeruser,
    Logout,
    Login,
    changecurrentpassword,
    getcurrentuser,
    updateuserdetails,
    updateAvatarimg,
    updateCoverimg,
    getUserChannelProfile,
    getWatchHistory
  } 
from "../Controllers/userRegister.js";
import { Upload } from "../Middlewares/multer.middleware.js";
import Authstatus from "../Middlewares/Authstatus.middleware.js";

const router = Router();

router.route("/register").post(
    Upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]), Registeruser);

router.route("/login").post(Login);

router.route("/logout").post(Authstatus, Logout);

router.route("/password").patch(Authstatus, changecurrentpassword); 

router.route("/user").get(Authstatus, getcurrentuser);

router.route("/Account").patch(Authstatus, updateuserdetails);

router.route("/avatar").patch(Authstatus, Upload.single("avatar"), updateAvatarimg);

router.route("/coverimage").patch(Authstatus, Upload.single("coverImage"), updateCoverimg); 

router.route("/c/:username").get(Authstatus , getUserChannelProfile);

router.route("/history").get(Authstatus, getWatchHistory);

export default router;