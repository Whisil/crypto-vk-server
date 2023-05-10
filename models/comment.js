const Schema = mongoose.Schema;

const commentSchema = new Schema(
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
    onPost: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, versionKey: false, collection: "Comment" }
);

export default mongoose.model("Comment", commentSchema);
