import mongoose from "mongoose";
import Comment from "../models/comment.js";
import User from "../models/user.js";
import Post from "../models/cost.js";
import { fileDelete } from "../utils/fileDelete.js";

export const getComments = async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await Comment.find({ onPost: postId }).populate(
      "createdBy"
    );

    res.status(200).json(comments);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createComment = async (req, res) => {
  const { text } = req.body;
  const userId = req.userId;
  const postId = req.params.postId;
  const file = req.file;

  try {
    const newComment = await Comment.create({
      createdBy: new mongoose.Types.ObjectId(req.userId),
      onPost: new mongoose.Types.ObjectId(postId),
      text,
      mediaURL: file
        ? `${req.protocol}://${req.get("host")}/media/${file.filename}`
        : undefined,
    }).then((comment) => comment.populate("createdBy"));

    try {
      await User.findOneAndUpdate(
        { _id: userId },
        { $push: { comments: newComment._id } }
      );
    } catch (err) {
      throw err;
    }

    try {
      await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { comments: newComment._id } }
      );
    } catch (err) {
      throw err;
    }

    res.status(201).json(newComment);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findByIdAndDelete(commentId);

    await User.findByIdAndUpdate(req.userId, {
      $pull: { comments: commentId },
    });

    try {
      await Post.findOneAndUpdate(
        { _id: comment.onPost },
        { $pull: { comments: comment._id } }
      );
    } catch (err) {
      throw err;
    }

    if (comment.mediaURL) {
      fileDelete(comment.mediaURL);
    }

    res.status(204).end();
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
