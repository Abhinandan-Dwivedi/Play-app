import AsyncHandler from '../Utils/AsyncHandler.js';
import { Comment } from '../Models/Comment.model.js';
import Showerror from '../Utils/ShowError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const createComment = AsyncHandler(async (req, res) => {
    const { content } = req.body;
    const videoId = req.params.videoId;
    const tweetsId = req.params.tweetsId;
    if (!content) {
        throw new Showerror(400, "Content is required");
    }
    if (!videoId && !tweetsId) {
        throw new Showerror(400, " createComment: Video id or Tweets id is required");
    }
    if (videoId && !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new Showerror(400, "Invalid video id");
    }
    if (tweetsId && !mongoose.Types.ObjectId.isValid(tweetsId)) {
        throw new Showerror(400, "Invalid tweets id");
    }
    const commentdata = { content, owner: req.user._id };
    if (videoId) commentdata.video = videoId;
    if (tweetsId) commentdata.tweets = tweetsId;

    const comment = await Comment.create({
        ...commentdata
    });

    return res.status(201).json(new ApiResponse(201, "Comment created successfully", comment));
})

const deletecomment = AsyncHandler(async (req, res) => {
    const commentId = req.params;
    if (!commentId) {
        throw new Showerror(400, "deletecomment : Comment id is required");
    }
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Showerror(400, "Invalid comment id");
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new Showerror(404, "deletecomment : Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new Showerror(403, "You are not authorized to delete this comment");
    }
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json(new ApiResponse(200, "Comment deleted successfully", null));
})

const updateComment = AsyncHandler(async (req, res) => {
    const commentId = req.params;
    const { content } = req.body;
    if (!commentId) {
        throw new Showerror(400, "updateComment : Comment id is required");
    }
    if (!content) {
        throw new Showerror(400, "updateComment : Content is required");
    }
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Showerror(400, "Invalid comment id");
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new Showerror(404, "updateComment : Comment not found");
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new Showerror(403, "You are not authorized to update this comment");
    }
    comment.content = content;
    await comment.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Comment updated successfully", comment));

})

const getVideoComments = AsyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!videoId) {
        throw new Showerror(400, "getVideoComments : Video id is required");
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new Showerror(400, "Invalid video id");
    }

    const aggregate = Comment.aggregate([
        { $match: { video: new mongoose.Types.ObjectId(videoId) } },
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        { $unwind: "$owner" },
        {
            $project: {
                content: 1,
                createdAt: 1,
                "owner.name": 1,
                "owner.avatar": 1
            }
        }
    ]);

    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        customLabels: {
            totalDocs: "total",
            docs: "comments"
        }
    };

    const result = await Comment.aggregatePaginate(aggregate, options);

    if (!result || result.comments.length === 0) {
        return res.status(200).json(new ApiResponse(200, "No comments found", result));
    }

    return res.status(200).json(new ApiResponse(200, "Comments fetched successfully", result));
})

export {
    createComment,
    deletecomment,
    updateComment,
    getVideoComments
}    