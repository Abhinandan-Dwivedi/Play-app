import mongoose, { Schema } from 'mongoose';

const viewSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
        index: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        index: true
    },
    ip: {
        type: String,
        required: false,
        index: true
    },
    date: {
        type: String, // store as YYYY-MM-DD
        required: true,
        index: true
    }
}, { timestamps: true });

// Prevent duplicate view records for same video-owner-date or video-ip-date
viewSchema.index({ video: 1, owner: 1, date: 1 }, { unique: true, sparse: true });
viewSchema.index({ video: 1, ip: 1, date: 1 }, { unique: true, sparse: true });

export const View = mongoose.model('View', viewSchema);
