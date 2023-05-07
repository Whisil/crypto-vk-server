import mongoose from "mongoose";

const Schema = mongoose.Schema;

const likeSchema = new Schema(
  {
    likedPost: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    likedBy: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { versionKey: false, collection: "Likes" }
);

export default mongoose.model("Like", likeSchema);
