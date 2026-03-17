import express from 'express';
import cors from 'cors';
import cookie from 'cookie-parser';

const app = express();

app.use (cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json({ limit: "50kb" }));
app.use( express.urlencoded({ extended: true, limit: "50kb" }) );
app.use( express.static("public") );
app.use( cookie());

import UserRouter from "./Routes/User.route.js";
import TweetRouter from "./Routes/tweet.route.js";
import SubscriberRouter from "./Routes/Subscriber.route.js";
import DashboardRouter from "./Routes/dashboard.route.js";
import LikesRouter from "./Routes/likes.route.js";
import HealthcheckRouter from "./Routes/healthcheck.route.js";
import CommentRouter from "./Routes/Comment.route.js";
import VideoRouter from "./Routes/Video.route.js";
import PlaylistRouter from "./Routes/Playlist.route.js";

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/tweet", TweetRouter);
app.use("/api/v1/subscriber", SubscriberRouter);
app.use("/api/v1/dashboard", DashboardRouter);
app.use("/api/v1/likes", LikesRouter);
app.use("/api/v1/healthcheck", HealthcheckRouter);
app.use("/api/v1/comment", CommentRouter);
app.use("/api/v1/video", VideoRouter);
app.use("/api/v1/playlist", PlaylistRouter);

export default app;