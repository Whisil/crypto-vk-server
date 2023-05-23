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
    let query = User.findOne({ ethAddress: userWallet }).populate({
      path: "posts",
      populate: {
        path: "createdBy",
        model: "User",
      },
    });

    if (req.params.media) {
      query = query.populate({
        path: "posts",
        match: { mediaURL: { $exists: true } },
        populate: {
          path: "createdBy",
          model: "User",
        },
      });
    }

    const populatedUser = await query;

    res.status(200).json(populatedUser.posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const setSettings = async (req, res) => {
  const {
    username,
    displayName,
    bannerURL = null,
    avatarURL = null,
    bio = null,
    websiteURL = null,
  } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (
      username !== undefined &&
      username !== user.username &&
      username.length > 4 &&
      username.length < 35
    ) {
      user.username = username;
    }

    if (
      displayName !== undefined &&
      displayName !== user.displayName &&
      displayName.length > 4 &&
      displayName.length < 35
    ) {
      user.displayName = displayName;
    }

    if (bannerURL !== undefined && bannerURL !== user.bannerURL) {
      user.bannerURL = bannerURL;
    }

    if (avatarURL !== undefined && avatarURL !== user.avatarURL) {
      user.avatarURL = avatarURL;
    }

    if (bio !== undefined && bio !== user.bio) {
      user.bio = bio;
    }

    if (websiteURL !== undefined && websiteURL !== user.websiteURL) {
      user.websiteURL = websiteURL;
    }

    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
