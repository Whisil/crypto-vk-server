const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    text: {
      required: false,
      type: String,
    },
    createdBy: {
      require: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likeCount: {
      required: true,
      default: 0,
      type: Number,
    },
  },
  { timestamps: true, versionKey: false, collection: "Comment" }
);

export default mongoose.model("Comment", commentSchema);
