import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      required: true,
      type: String,
      unique: true,
    },
    ethAddress: {
      required: true,
      type: String,
      unique: true,
    },
    displayName: {
      required: true,
      type: String,
    },
    bannerURL: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    websiteURL: {
      type: String,
      default: null,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    follows: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true, versionKey: false, collection: "User" }
);

export default mongoose.model("User", userSchema);
