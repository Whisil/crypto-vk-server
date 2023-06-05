import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";
import fs from "fs";
import { fileDelete } from "../utils/fileDelete.js";

export const getPosts = async (req, res) => {
  const postId = req.params.postId;

  try {
    if (postId) {
      const post = await Post.findOne({ _id: postId })
        .populate("createdBy", "-_id -posts -likes -createdAt -updatedAt")
        .populate("comments");

      res.status(200).json(post);
    } else {
      const posts = await Post.find().populate(
        "createdBy",
        "-_id -posts -likes -createdAt -updatedAt -comments"
      ).sort({ createdAt: -1 });

      res.status(200).json(posts);
    }
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
        { $push: { posts: newPost._id } }
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

export const likePost = async (req, res) => {
  const userId = req.userId;
  const postId = req.params.postId;

  try {
    const user = await User.findOne({ _id: userId }, { likes: 1 });
    const postLikes = await Post.findOne({ _id: postId }, { likes: 1 });

    if (!user.likes.includes(postId) && !postLikes.likes.includes(userId)) {
      postLikes.likes.push(user._id);
      await postLikes.save();

      user.likes.push(postId);
      await user.save();
    } else {
      throw new Error("You've already liked it, check your code");
    }

    res.status(204).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const removeLike = async (req, res) => {
  const userId = req.userId;
  const postId = req.params.postId;

  try {
    await User.findOneAndUpdate({ _id: userId }, { $pull: { likes: postId } });

    await Post.findOneAndUpdate({ _id: postId }, { $pull: { likes: userId } });

    res.status(204).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findByIdAndRemove(postId);
    const userId = post.createdBy;

    await User.findByIdAndUpdate(userId, {
      $pull: { posts: postId },
    });

    if (post.mediaURL) {
      fileDelete(post.mediaURL);
    }

    res.status(204).end();
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
