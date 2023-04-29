import mongoose from "mongoose";
import Post from "../models/post.js";
import User from "../models/user.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  const { text, media } = req.body;

  const newPost = new Post({
    createdBy: new mongoose.Types.ObjectId(req.userId),
    text,
    media,
  });

  try {
    await newPost.save();

    await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { posts: newPost._id } },
      { new: true }
    );

    res.status(201).json(newPost);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
