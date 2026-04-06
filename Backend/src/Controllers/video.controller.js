import AsyncHandler from '../Utils/AsyncHandler.js';
import { Video } from '../Models/Vedio.model.js';
import Showerror from '../Utils/ShowError.js';
import { Uploadoncloudinary, deletingfilefromcloudinary } from '../Utils/cloudinary.js';
import ApiResponse from '../Utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { View } from '../Models/View.model.js';
import { User } from '../Models/User.model.js';

const uploadvideo = AsyncHandler(async (req, res) => {

    const videolocalpath = req.files?.video[0]?.path;
    const thumbnailpath = req.files?.thumbnail[0]?.path;
    if (!videolocalpath || !thumbnailpath) {
        throw new Showerror(400, "Please upload a video and thumbnail");
    }

    const { title, description, publiced } = req.body;
    if (!title || !description || !publiced) {
        throw new Showerror(400, "Title and description are required");
    }

    const videoresult = await Uploadoncloudinary(videolocalpath);
    const thumbnailresult = await Uploadoncloudinary(thumbnailpath);

    if (!videoresult || !videoresult.url || !thumbnailresult || !thumbnailresult.url) {
        throw new Showerror(500, "Cloudinary upload failed");
    }

    const video = await Video.create({
        videoFile: videoresult.url,
        thumbnail: thumbnailresult.url,
        owner: req.user._id,
        title,
        description,
        duration: videoresult.duration || 0,
        isPublished: publiced === "true" ? true : false
    })

    if (!video) {
        throw new Showerror(500, "Failed to upload video");
    }
    return res.status(201).json(new ApiResponse(201, "Video uploaded successfully", video));
})

const deletevideo = AsyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    if (!videoId) {
        throw new Showerror(400, "Video id is required");
    }

     if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new Showerror(400, "Invalid video id");
    }

    const deletedvideo = await Video.findById(videoId);
    if (!deletedvideo) {
        throw new Showerror(404, "Video not found");
    }

    if (deletedvideo.owner.toString() !== req.user._id.toString()) {
        throw new Showerror(403, "You are not authorized to delete this video");
    }

    if (deletedvideo.videoFile) {
        const publicId = deletedvideo.videoFile.split("/").pop().split(".")[0];
        await deletingfilefromcloudinary(publicId);
    }
    if (deletedvideo.thumbnail) {
        const publicId = deletedvideo.thumbnail.split("/").pop().split(".")[0];
        await deletingfilefromcloudinary(publicId);
    }

    await Video.findByIdAndDelete(videoId);

    return res.status(200).json(new ApiResponse(200, "Video deleted successfully", deletedvideo));
})

const getAllVideos = AsyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    const matchFilter = { isPublished: true };

     if (query) {
        matchFilter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }

     if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Showerror(400, "Invalid userId");
        }
        matchFilter.owner = new mongoose.Types.ObjectId(userId);
    }

     const sortOrder = sortType === "asc" ? 1 : -1;
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

     const aggregate = Video.aggregate([
        { $match: matchFilter },
         { $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner"
        } },
        { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
        { $sort: sortObj }
    ]);

    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        customLabels: {
            totalDocs: "total",
            docs: "videos"
        }
    };

    const result = await Video.aggregatePaginate(aggregate, options);

    if (!result || result.videos.length === 0) {
        return res.status(200).json(new ApiResponse(200, "No videos found", result));
    }

    return res.status(200).json(new ApiResponse(200, "Videos fetched successfully", result));
})

const getVideoById = AsyncHandler(async (req, res) => {

    const { videoId } = req.params;
    if (!videoId) {
        throw new Showerror(400, "Video id is required");
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new Showerror(400, "Invalid video id");
    }
    const videoDoc = await Video.findById(videoId).populate("owner", "username email fullname avatar");
    if (!videoDoc) {
        throw new Showerror(404, "Video not found");
    }

    // rename for clarity
    const video = videoDoc;

    if (!video.isPublished && (!req.user || video.owner._id.toString() !== req.user._id.toString())) {
        throw new Showerror(403, "You are not authorized to view this video");
    }

     const { like: LikesModel } = await import('../Models/likes.model.js');
    const { Subscription } = await import('../Models/Subscription.model.js');

    const likesCount = await LikesModel.countDocuments({ video: video._id });
    const isLiked = req.user ? !!(await LikesModel.findOne({ owner: req.user._id, video: video._id })) : false;
    const subscriberCount = await Subscription.countDocuments({ channels: video.owner._id });

    const resultObj = video.toObject ? video.toObject() : video;
    resultObj.likesCount = likesCount;
    resultObj.isLiked = isLiked;
    resultObj.subscriberCount = subscriberCount;

    return res.status(200).json(new ApiResponse(200, "Video fetched successfully", resultObj));
})

const updateVideo = AsyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description, publiced } = req.body;

    if (!videoId) {
        throw new Showerror(400, "Video id is required");
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new Showerror(400, "Invalid video id");
    }

    if (!title && !description && !publiced && !req.file) {
        throw new Showerror(400, "At least one field (title, description, publiced, or thumbnail) is required to update");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new Showerror(404, "Video not found");
    }

    // Check authorization - video must belong to the current user
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new Showerror(403, "You are not authorized to update this video");
    }

    // Build update object
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (publiced !== undefined) updateFields.isPublished = publiced === "true" ? true : false;

    // Handle thumbnail update
    if (req.file) {
        const thumbnailresult = await Uploadoncloudinary(req.file.path);
        if (video.thumbnail) {
            const publicId = video.thumbnail.split("/").pop().split(".")[0];
            await deletingfilefromcloudinary(publicId);
        }
        updateFields.thumbnail = thumbnailresult?.url;
    }

    const updatedvideo = await Video.findByIdAndUpdate(videoId, { $set: updateFields }, { new: true });

    if (!updatedvideo) {
        throw new Showerror(500, "Failed to update video");
    }

    return res.status(200).json(new ApiResponse(200, "Video updated successfully", updatedvideo));
})

const togglePublishStatus = AsyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new Showerror(400, " togglePublishStatus: Video id is required");
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new Showerror(400, " togglePublishStatus: Invalid video id");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new Showerror(404, " togglePublishStatus: Video not found");
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new Showerror(403, " togglePublishStatus: You are not authorized to update this video");
    }

    video.isPublished = !video.isPublished;
    await video.save( {validationBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, `Video ${video.isPublished ? "published" : "unpublished"} successfully`, video));
})

const incrementView = AsyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new Showerror(400, "incrementView: Video id is required");
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new Showerror(400, "incrementView: Invalid video id");
    }

     const today = new Date().toISOString().slice(0, 10);

     const userId = req.user?._id || null;
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (forwarded && forwarded.split(',')[0].trim()) || req.ip || req.connection?.remoteAddress || null;

    try {
        if (userId) {
             
            await User.findByIdAndUpdate(userId, {
                $pull: { watchHistory: videoId }
            });
            await User.findByIdAndUpdate(userId, {
                $push: { watchHistory: videoId }
            });

            
            const existing = await View.findOne({ video: videoId, owner: userId, date: today });
            
            if (existing) {
                const current = await Video.findById(videoId).select('views');
                return res.status(200).json(new ApiResponse(200, 'View exists', { views: current?.views || 0 }));
            }

            await View.create({ video: videoId, owner: userId, date: today });
            const updated = await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }, { new: true });
            
            if (!updated) throw new Showerror(404, 'incrementView: Video not found');
            return res.status(200).json(new ApiResponse(200, 'View incremented', { views: updated.views }));
        }

        if (ip) {
            const existing = await View.findOne({ video: videoId, ip, date: today });
            if (existing) {
                const current = await Video.findById(videoId).select('views');
                return res.status(200).json(new ApiResponse(200, 'View exists', { views: current?.views || 0 }));
            }

            await View.create({ video: videoId, ip, date: today });
            const updated = await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }, { new: true });
            if (!updated) throw new Showerror(404, 'incrementView: Video not found');
            return res.status(200).json(new ApiResponse(200, 'View incremented', { views: updated.views }));
        }

         const updated = await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }, { new: true });
        if (!updated) throw new Showerror(404, 'incrementView: Video not found');
        return res.status(200).json(new ApiResponse(200, 'View incremented', { views: updated.views }));
    } catch (err) {
         if (err && err.code === 11000) {
            const current = await Video.findById(videoId).select('views');
            return res.status(200).json(new ApiResponse(200, 'View already recorded', { views: current?.views || 0 }));
        }
        throw err;
    }
});

export {
    uploadvideo,
    deletevideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    togglePublishStatus,
    incrementView
};

