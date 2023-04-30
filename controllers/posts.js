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
  const { text } = req.body;
  const file = req.file;

  try {
    const newPost = new Post({
      createdBy: new mongoose.Types.ObjectId(req.userId),
      text,
      mediaURL: `${req.protocol}://${req.get("host")}/public/media/${
        file.filename
      }`,
    });

    try {
      await User.findOneAndUpdate(
        { _id: req.userId },
        { $push: { posts: newPost._id } },
        { new: true }
      );
    } catch (err) {
      throw err;
    }

    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
