import AsyncHandler from '../Utils/AsyncHandler.js';
import { Subscription } from '../Models/Subscription.model.js';
import { User } from '../Models/User.model.js';
import Showerror from '../Utils/ShowError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import mongoose, { isValidObjectId } from 'mongoose';

const togglesubscription = AsyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new Showerror(400, "Invalid channel ID");
    }
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new Showerror(404, "Channel not found");
    }
    const existingSubscription = await Subscription.findOne({ subscriber: req.user._id, channels: channelId });
    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id);
        return res.status(200).json(new ApiResponse(200, "Unsubscribed successfully"));
    }
    const newSubscription = await Subscription.create({ subscriber: req.user._id, channels: channelId });
    return res.status(201).json(new ApiResponse(201, "Subscribed successfully", newSubscription));     
})

const  getsubscribers = AsyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new Showerror(400, "Invalid channel ID");
    }
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new Showerror(404, "Channel not found");
    }
    const  subscribers = await Subscription.find({ channels: channelId }).populate('subscriber', 'username email');
    return res.status(200).json(new ApiResponse(200, "Subscribers retrieved successfully", subscribers));
})

const getsubscribedchannels = AsyncHandler(async (req, res) => {
    const subscribedChannels = await Subscription.find({ subscriber: req.user._id }).populate('channels', 'username email');
    return res.status(200).json(new ApiResponse(200, "Subscribed channels retrieved successfully", subscribedChannels));
})

export {
    togglesubscription,
    getsubscribers,
    getsubscribedchannels,
}
