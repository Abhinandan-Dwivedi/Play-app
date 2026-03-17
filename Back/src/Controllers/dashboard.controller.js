import AsyncHandler from '../Utils/AsyncHandler.js';
import { Subscription } from '../Models/Subscription.model.js';
import { User } from '../Models/User.model.js';
import { Video } from '../Models/Vedio.model.js';
import { like as likes } from '../Models/likes.model.js';
import Showerror from '../Utils/ShowError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import mongoose, { isValidObjectId } from 'mongoose';

const getChannelStats = AsyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { channelid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(channelid)) {
        throw new Showerror(400, "Invalid channel ID");
    }
    const channel = await User.findById(channelid);
    if (!channel) {
        throw new Showerror(404, "Channel not found");
    }
    const totalSubscribers = await Subscription.countDocuments({ channels: channelid });
    const totalVideos = await Video.countDocuments({ owner: channelid });

    const totalViews = await Video.aggregate([
        { $match: { owner: mongoose.Types.ObjectId(channelid) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalLikes = await likes.countDocuments(
        {
          video: { $in: await Video.find({ owner: channelid }).select('_id') }
        });
    const stats = {
        totalSubscribers,
        totalVideos,
        totalViews: totalViews[0] ? totalViews[0].totalViews : 0,
        totalLikes
    }
    return res.status(200).json(new ApiResponse(200, "Channel stats retrieved successfully", stats));
})

const getchannelvedios = AsyncHandler(async (req, res) => {
    const { channelid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(channelid)) {
        throw new Showerror(400, "Invalid channel ID");
    }
    const channel = await User.findById(channelid);
    if (!channel) {
        throw new Showerror(404, "Channel not found");
    }
    const videos = await Video.find({ owner: channelid });
    return res.status(200).json(new ApiResponse(200, "Channel videos retrieved successfully", videos));
})
export {
    getChannelStats,
    getchannelvedios
}