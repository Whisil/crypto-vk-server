import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    text: {
      required: false,
      type: String,
    },
    createdBy: {
      required: true,
      type: mongoose.Types.ObjectId,
    },
    mediaURL: {
      required: false,
      type: String,
    },
    likesCount: {
      required: true,
      default: 0,
      type: Number,
    },
  },
  { timestamps: true, versionKey: false, collection: "Post" }
);

export default mongoose.model("Post", postSchema);
