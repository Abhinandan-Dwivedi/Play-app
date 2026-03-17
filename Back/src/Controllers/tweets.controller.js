import AsyncHandler from '../Utils/AsyncHandler.js';
import { tweets  } from '../Models/tweets.model.js';
import Showerror from '../Utils/ShowError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import mongoose from 'mongoose'; 

const Createtweet = AsyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) {
        throw new Showerror("Content is required", 400);
    }
    const newtweet = await tweets.create({
        content,
        owner: req.user._id
    });
    if (!newtweet) {
        throw new Showerror("Failed to create tweet", 500);
    }
    return res.status(201).json(new ApiResponse(201, "Tweet created successfully", newtweet));
});

const updatetweet = AsyncHandler(async (req, res) => {
    const tweetId = req.params.tweetId;
    if (!tweetId) {
        throw new Showerror("Tweet id is required", 400);
    }
    // Validate if tweetId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new Showerror("Invalid tweet id", 400);
    }
    const { content } = req.body;
    if (!content) {
        throw new Showerror("updatetweeet: Content is required", 400);
    }
    const updatedtweet = await tweets.findById(tweetId);
    if (!updatedtweet) {
        throw new Showerror("Tweet not found", 404);
    }
    if (updatedtweet.owner.toString() !== req.user._id.toString()) {
        throw new Showerror("You are not authorized to update this tweet", 403);
    }
    updatedtweet.content = content;
    await updatedtweet.save({validateBeforeSave: false});
    return res.status(200).json(new ApiResponse(200, "Tweet updated successfully", updatedtweet));

});

const deletetweet = AsyncHandler(async (req, res) => {
    const tweetId = req.params.tweetId;
    if (!tweetId) {
        throw new Showerror("deletetweet : Tweet id is required", 400);
    }
    // Validate if tweetId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new Showerror("deletetweet : Invalid tweet id", 400);
    }
    const deletedtweet = await tweets.findById(tweetId);
    if (!deletedtweet) {
        throw new Showerror(" delete : Tweet not found", 404);
    }
    if (deletedtweet.owner.toString() !== req.user._id.toString()) {
        throw new Showerror(" delete : You are not authorized to delete this tweet", 403);
    }
    await tweets.findByIdAndDelete(tweetId);
    return res.status(200).json(new ApiResponse(200, "Tweet deleted successfully", deletedtweet));
});

const getusertweets = AsyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!userId) {
        throw new Showerror("User ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Showerror("Invalid user ID", 400);
    }

    if (page < 1 || limit < 1) {
        throw new Showerror("Page and limit must be positive numbers", 400);
    }

    const skip = (page - 1) * limit;

    const usertweets = await tweets
        .find({ owner: userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

    if (!usertweets || usertweets.length === 0) {
        throw new Showerror("No tweets found for this user", 404);
    }

    const total = await tweets.countDocuments({ owner: userId });

    return res.status(200).json(
        new ApiResponse(200, "User tweets fetched successfully", {
            tweets: usertweets,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        })
    );
});
export {
    Createtweet,
    updatetweet,
    deletetweet,
    getusertweets
};