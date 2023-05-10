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
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    mediaURL: {
      required: false,
      type: String,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment"}]
  },
  { timestamps: true, versionKey: false, collection: "Post" }
);

export default mongoose.model("Post", postSchema);
