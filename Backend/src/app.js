import express from 'express';
import cors from 'cors';
import cookie from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { User } from './Models/User.model.js';

const app = express();

const allowedOrigins = [
    'https://play-app-frontend-seven.vercel.app',
    'https://play-app-frontend-git-main-04isfour-1265s-projects.vercel.app', // Add the failing one here
    'https://play-app-frontend-n7ko9fmwr-04isfour-1265s-projects.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS Policy: This origin is not allowed'), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));

// const frontendOrigin = 'https://play-app-frontend-seven.vercel.app/';
// app.use(cors({ origin: frontendOrigin, credentials: true }));

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(express.static("public"));
app.use(cookie());


app.use(async (req, res, next) => {
	try {
		const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
		if (!token) return next();

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded || !decoded._id) return next();

		const user = await User.findById(decoded._id).select('-password -refreshToken');
		if (user) req.user = user;
	} catch (err) {

		console.warn('attachUser middleware: token ignored', err && err.message);
	}
	return next();
});
import UserRouter from "./Routes/User.route.js";
import TweetRouter from "./Routes/tweet.route.js";
import SubscriberRouter from "./Routes/Subscriber.route.js";
import DashboardRouter from "./Routes/dashboard.route.js";
import LikesRouter from "./Routes/likes.route.js";
import HealthcheckRouter from "./Routes/healthcheck.route.js";
import CommentRouter from "./Routes/Comment.route.js";
import VideoRouter from "./Routes/Video.route.js";
import PlaylistRouter from "./Routes/Playlist.route.js";
import CloudinaryRouter from "./Routes/cloudinary.route.js";
import proxyCloudinary from "./Controllers/cloudinaryProxy.controller.js";

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/tweet", TweetRouter);
app.use("/api/v1/subscriber", SubscriberRouter);
app.use("/api/v1/dashboard", DashboardRouter);
app.use("/api/v1/likes", LikesRouter);
app.use("/api/v1/healthcheck", HealthcheckRouter);
app.use("/api/v1/comment", CommentRouter);
app.use("/api/v1/video", VideoRouter);
app.use("/api/v1/playlist", PlaylistRouter);

app.use("/api/v1/media/cloudinary", proxyCloudinary);

app.get('/api/v1/debug/cookies', (req, res) => {
	return res.status(200).json({ cookies: req.cookies || {} });
});

app.get('/api/v1/debug/verify-token', (req, res) => {
	if (process.env.NODE_ENV === 'production') {
		return res.status(404).json({ success: false, message: 'Not found' });
	}
	const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
	if (!token) return res.status(400).json({ success: false, message: 'No token provided' });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		return res.status(200).json({ success: true, decoded });
	} catch (err) {
		return res.status(401).json({ success: false, error: err.message });
	}
});

app.get('/api/v1/debug/current-user', async (req, res) => {
	if (process.env.NODE_ENV === 'production') return res.status(404).json({ success: false, message: 'Not found' });
	const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
	if (!token) return res.status(400).json({ success: false, message: 'No token provided' });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded._id).select('-password -refreshToken');
		if (!user) return res.status(404).json({ success: false, message: 'User not found in DB for id ' + decoded._id });
		return res.status(200).json({ success: true, user });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
});

export default app;

app.use((err, req, res, next) => {
	console.error('Unhandled error:', err instanceof Error ? err.stack : err);

	const statusCode = err?.statusCode || err?.status || 500;
	const message = err?.message || 'Internal Server Error';
	const errorBody = err?.error || null;

	return res.status(statusCode).json({
		success: false,
		status: statusCode,
		message,
		error: errorBody,
	});
});
