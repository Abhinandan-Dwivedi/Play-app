import AsyncHandler from '../Utils/AsyncHandler.js';
import { Playlist } from '../Models/Playlist.model.js';
import Showerror from '../Utils/ShowError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import mongoose from 'mongoose';

const Createplaylist = AsyncHandler(async (req, res) => {
    const { name , description  , } = req.body;
    if (!name || !description) {
        throw new Showerror("Name and description are required", 400);
    }
    const videoids = req.body.videos || [];
    if (!Array.isArray(videoids)) {
        throw new Showerror("Videos must be an array of video ids", 400);
    }
    for (const videoId of videoids) {
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            throw new Showerror(`Invalid video id: ${videoId}`, 400);
        }
    }
    const newplaylist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        videos: videoids
    });
    if (!newplaylist) {
        throw new Showerror("Failed to create playlist", 500);
    }
    return res.status(201).json(new ApiResponse(201, "Playlist created successfully", newplaylist));
});

const getuserplaylist = AsyncHandler(async (req, res) => {
    // allow fetching by route param or current authenticated user
    const userId = req.params?.userId || req.user?._id;
    if (!userId) {
        throw new Showerror("User id is required", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Showerror(`Invalid user id: ${userId}`, 400);
    }

    const playlists = await Playlist.find({ owner: userId }).populate('videos').sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, "User playlists fetched successfully", playlists));
});

const getuserplaylistbyid = AsyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!playlistId) {
        throw new Showerror("Playlist id is required", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new Showerror(`Invalid playlist id: ${playlistId}`, 400);
    }
    const playlist = await Playlist.findById(playlistId).populate('videos');
    if (!playlist) {
        throw new Showerror("Playlist not found", 404);
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new Showerror("You are not authorized to view this playlist", 403);
    }
    return res.status(200).json(new ApiResponse(200, "Playlist fetched successfully", playlist));
});

const addvideotoplaylist = AsyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!playlistId) {
        throw new Showerror("Playlist id is required", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new Showerror(`Invalid playlist id: ${playlistId}`, 400);
    }
    const { videoId } = req.body;
    if (!videoId) {
        throw new Showerror("Video id is required", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new Showerror(`Invalid video id: ${videoId}`, 400);
    }   
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new Showerror("Playlist not found", 404);
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new Showerror("You are not authorized to update this playlist", 403);
    }
    if (playlist.videos.includes(videoId)) {
        throw new Showerror("Video already exists in the playlist", 400);
    }
    playlist.videos.push(videoId);
    await playlist.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Video added to playlist successfully", playlist));

});

const removevideofromplaylist = AsyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!playlistId) {
        throw new Showerror("Playlist id is required", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new Showerror(`Invalid playlist id: ${playlistId}`, 400);
    }
    const { videoId } = req.body;
    if (!videoId) {
        throw new Showerror("Video id is required", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new Showerror(`Invalid video id: ${videoId}`, 400);
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new Showerror("Playlist not found", 404);
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new Showerror("You are not authorized to update this playlist", 403);
    }
    if (!playlist.videos.includes(videoId)) {
        throw new Showerror("Video does not exist in the playlist", 400);
        
    }
    playlist.videos = playlist.videos.filter(id => id.toString() !== videoId);
    await playlist.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Video removed from playlist successfully", playlist));
});

const deleteplaylist = AsyncHandler(async (req, res) => { 
    const { playlistId } = req.params;
    if (!playlistId) {
        throw new Showerror("Playlist id is required", 400);
    }  
    if (!mongoose.Types.ObjectId.isValid(playlistId)) { 
        throw new Showerror(`Invalid playlist id: ${playlistId}`, 400);
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new Showerror("Playlist not found", 404);
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new Showerror("You are not authorized to delete this playlist", 403);
    }
    await Playlist.findByIdAndDelete(playlistId);
    return res.status(200).json(new ApiResponse(200, "Playlist deleted successfully", {}));
});

const updateplaylist = AsyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!playlistId) {
        throw new Showerror("Playlist id is required", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new Showerror(`Invalid playlist id: ${playlistId}`, 400);
    }
    const { name, description } = req.body;
    if (!name || !description) {
        throw new Showerror("Name and description are required", 400);
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new Showerror("Playlist not found", 404);
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new Showerror("You are not authorized to update this playlist", 403);
    }
    playlist.name = name;
    playlist.description = description;
    await playlist.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Playlist updated successfully", playlist));
});

export {
    Createplaylist,
    getuserplaylist,
    getuserplaylistbyid,
    addvideotoplaylist,
    removevideofromplaylist,
    deleteplaylist,
    updateplaylist
}