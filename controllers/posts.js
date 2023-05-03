import mongoose from "mongoose";
import Post from "../models/post.js";
import User from "../models/user.js";
import fs from "fs";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "createdBy",
      "-_id -posts -likes -createdAt -updatedAt"
    );

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  const { text } = req.body;
  const file = req.file;

  try {
    const newPost = await Post.create({
      createdBy: new mongoose.Types.ObjectId(req.userId),
      text,
      mediaURL: file
        ? `${req.protocol}://${req.get("host")}/media/${file.filename}`
        : undefined,
    }).then((post) =>
      post.populate("createdBy", "-_id -posts -likes -createdAt -updatedAt")
    );

    try {
      await User.findOneAndUpdate(
        { _id: req.userId },
        { $push: { posts: newPost._id } },
        { new: true }
      );
    } catch (err) {
      throw err;
    }

    res.status(201).json(newPost);
  } catch (err) {
    if (file) {
      fs.unlinkSync(file.path);
    }

    res.status(409).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.body;

  try {
    const post = await Post.findByIdAndRemove(postId);
    const userId = post.createdBy;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { posts: postId },
      },
      { new: true }
    );

    const filePath = post.mediaURL.split(`/`);

    fs.unlink(__dirname + `/public/media/${filePath[filePath.length - 1]}`, (err) => {
      if (err) throw err;
    });

    res.status(204).json(user.posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
