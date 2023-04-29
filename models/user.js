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
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true, versionKey: false, collection: "User" }
);

export default mongoose.model("User", userSchema);
