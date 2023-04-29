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
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema);
