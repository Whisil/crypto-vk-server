import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    text: String,
    createdBy: Object,
    media: String,
    likes: Array,
  },
  { timestamps: true, versionKey: false, collection: "Post" }
);

export default mongoose.model("Post", postSchema);
