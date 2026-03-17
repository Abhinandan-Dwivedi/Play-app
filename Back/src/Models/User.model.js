import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, // a url link
            required: true,
            default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
        },
        coverImage: {
            type: String, // a url link
            required: false,
        },
        watchHistory:
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
);

UserSchema.pre("save", async function (req, res, next) {
    if (!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.ComparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
}

UserSchema.methods.generatetoken = function () {

    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
            process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
}
UserSchema.methods.Refresstoken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
            process.env.REFRESH_JWT_SECRET,
        {
            expiresIn: process.env.REFRESH_JWT_EXPIRES_IN
        }
    )
}

export const User = mongoose.model("User", UserSchema);