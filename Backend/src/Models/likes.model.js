import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        owner :{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
        Comment : {
            type : Schema.Types.ObjectId,
            ref : "Comment"
        },
        tweets :{
            type : Schema.Types.ObjectId,
            ref : "tweets"
        }
        
    }, {
        timestamps: true
    }
)
// Prevent duplicate likes from the same owner on the same resource
// Use partialFilterExpression to ensure the unique constraint only applies
// when the specific target field exists and is not null. This prevents
// collisions when other fields are null (e.g. owner + Comment null colliding
// for video likes).
likeSchema.index(
    { owner: 1, video: 1 },
    { unique: true, partialFilterExpression: { video: { $exists: true, $ne: null } } }
);
likeSchema.index(
    { owner: 1, Comment: 1 },
    { unique: true, partialFilterExpression: { Comment: { $exists: true, $ne: null } } }
);
likeSchema.index(
    { owner: 1, tweets: 1 },
    { unique: true, partialFilterExpression: { tweets: { $exists: true, $ne: null } } }
);

export const like = mongoose.model("like", likeSchema);