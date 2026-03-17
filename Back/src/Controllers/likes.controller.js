import AsyncHandler from '../Utils/AsyncHandler.js';
import { like as likes } from '../Models/likes.model.js';
import Showerror from '../Utils/ShowError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import mongoose from 'mongoose';

const togglevideolike = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new Showerror(400, "Invalid video ID");
    }

    const existingLike = await likes.findOne({ owner: req.user._id, video: videoId });
    if (existingLike) {
        await likes.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, "Video unliked successfully"));
    }
    // create a like
    const newLike = await likes.create({ owner: req.user._id, video: videoId });
    return res.status(201).json(new ApiResponse(201, "Video liked successfully", newLike));

})

const togglecommentlike = AsyncHandler(async (req, res) => {
    const {commentId} = req.params
    if( !mongoose.Types.ObjectId.isValid(commentId)){
        throw new Showerror(400, "Invalid comment ID");
    }
    const existingLike = await likes.findOne({ owner: req.user._id, Comment: commentId });
    if (existingLike) {
        await likes.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, "Comment unliked successfully"));
    }

    const newLike = await likes.create({ owner: req.user._id, Comment: commentId });
    return res.status(201).json(new ApiResponse(201, "Comment liked successfully", newLike));

})

const toggletweetlike = AsyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new Showerror(400, "Invalid tweet ID");
    }

    const existingLike = await likes.findOne({ owner: req.user._id, tweets: tweetId });
    if (existingLike) {
        await likes.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, "Tweet unliked successfully"));
    }

    const newLike = await likes.create({ owner: req.user._id, tweets: tweetId });
    return res.status(201).json(new ApiResponse(201, "Tweet liked successfully", newLike));
     
}
)

const getlikedvideos = AsyncHandler(async (req, res) => {
    const likedVideos = await likes.find({ owner: req.user._id, video: { $ne: null } }).populate('video');
    return res.status(200).json(new ApiResponse(200, "Liked videos retrieved successfully", likedVideos));
});


export { togglevideolike,
    togglecommentlike,
    toggletweetlike,
    getlikedvideos
 };