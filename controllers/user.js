import Post from "../models/Post.js";
import User from "../models/User.js";

export const getUser = async (req, res) => {
  const userWallet = req.params.userWallet;

  try {
    const user = await User.findOne({ ethAddress: userWallet });

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  const userWallet = req.params.userWallet;

  try {
    const user = await User.findOne({ ethAddress: userWallet }).populate({
      path: "posts",
      populate: {
        path: "createdBy",
        model: "User",
      },
    });

    res.status(200).json(user.posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
