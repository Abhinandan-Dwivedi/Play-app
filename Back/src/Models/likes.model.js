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
export const like = mongoose.model("like", likeSchema);