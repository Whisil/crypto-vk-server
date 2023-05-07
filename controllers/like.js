import Like from "../models/Like.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const createLike = async (req, res) => {
  const userId = req.userId;
  const postId = req.params.postId;

  try {
    const newLike = await Like.create({
      likedBy: new mongoose.Types.ObjectId(userId),
      createdBy: new mongoose.Types.ObjectId(postId),
    });

    await newLike.save();

    try {
      await Post.findByIdAndUpdate(
        { _id: postId },
        { $push: { likes: newLike._id } }
      );
    } catch (err) {
      throw err;
    }

    try {
      await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { likes: newLike._id } }
      );
    } catch (err) {
      throw err;
    }

    res.status(201).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const removeLike = async (req, res) => {
  const postId = req.params.postId;

  try {
    const like = await Like.findOneAndDelete({
      likedBy: req.userId,
      likedPost: postId,
    });

    try {
      await Post.findOneAndUpdate(
        { _id: postId },
        { $pop: { likes: like._id } }
      );
    } catch (err) {
      throw err;
    }

    try {
      await User.findOneAndUpdate(
        { _id: req.userId },
        { $pop: { likes: like._id } }
      );
    } catch (err) {
      throw err;
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};
