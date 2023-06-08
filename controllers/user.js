import User from "../models/User.js";
import { fileDelete } from "../utils/fileDelete.js";

const urlParser = (url) => {
  const httpsRegex = /^https:\/\//i;
  const slashRegex = /\/$/;

  if (!httpsRegex.test(url)) {
    url = `https://${url}`;
  }

  if (!slashRegex.test(url)) {
    url += "/";
  }

  return url;
};

export const getUser = async (req, res) => {
  const userWallet = req.params.userWallet;

  try {
    const user = await User.findOne({ ethAddress: userWallet }).select(
      "-follows, -followers"
    );

    const isFollowed = await User.countDocuments({
      _id: req.userId,
      follows: user._id,
    });

    res.status(200).json({ user, isFollowed: !!isFollowed });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  const userWallet = req.params.userWallet;

  try {
    let query = User.findOne({ ethAddress: userWallet })
      .select("-follows -followers")
      .populate({
        path: "posts",
        options: { sort: { createAt: -1 } },
        populate: {
          path: "createdBy",
          model: "User",
          select: "-follows -followers",
        },
      });

    if (req.params.media) {
      query = query.select("-follows -followers").populate({
        path: "posts",
        match: { mediaURL: { $exists: true } },
        options: { sort: { createAt: -1 } },
        populate: {
          path: "createdBy",
          model: "User",
          select: "-follows -followers",
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
    oldBanner = null,
    oldAvatar = null,
    bio = null,
    websiteURL = null,
  } = req.body;
  const userId = req.userId;
  let bannerFile;
  let avatarFile;

  for (let item of req.files) {
    if (item.filename.includes("banner")) {
      bannerFile = item;
    } else {
      avatarFile = item;
    }
  }

  try {
    const user = await User.findById(userId).select("-follows, -followers");

    if (!user) {
      res.status(404).json({ message: "User not found" }).end();
    }

    if (
      username &&
      username !== user.username &&
      username.length > 4 &&
      username.length < 35
    ) {
      user.username = username;
    }

    if (
      displayName &&
      displayName !== user.displayName &&
      displayName.length > 4 &&
      displayName.length < 35
    ) {
      user.displayName = displayName;
    }

    let bannerFileURL;

    if (bannerFile) {
      bannerFile.filename.split(".").pop();
      bannerFileURL = `${req.protocol}://${req.get("host")}/media/${
        bannerFile.filename
      }`;
      if (bannerFileURL !== user.bannerURL) {
        user.bannerURL = bannerFileURL;
      }
    }

    if (oldBanner && bannerFileURL && oldBanner !== bannerFileURL) {
      fileDelete(oldBanner);
    }

    let avatarFileURL;

    if (avatarFile) {
      avatarFile.filename.split(".").pop();
      avatarFileURL = `${req.protocol}://${req.get("host")}/media/${
        avatarFile.filename
      }`;
      if (avatarFileURL !== user.avatarURL) {
        user.avatarURL = avatarFileURL;
      }
    }

    if (oldAvatar && avatarFileURL && oldAvatar !== avatarFileURL) {
      fileDelete(oldAvatar);
    }

    if (bio && bio !== user.bio) {
      user.bio = bio;
    }

    if (websiteURL && websiteURL !== user.websiteURL) {
      const parsedLink = urlParser(websiteURL);
      user.websiteURL = parsedLink;
    }

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createFollow = async (req, res) => {
  try {
    const { _id } = await User.findOne({
      ethAddress: req.params.followedUserWallet,
    }).select("_id");

    const isFollowed = await User.countDocuments({
      _id: req.userId,
      follows: _id,
    });

    if (!!isFollowed) {
      res.status(400).json({ err: "You can't follow a second time..." }).end();
    }

    //current user follows
    await User.findByIdAndUpdate(
      { _id: req.userId },
      {
        $push: { follows: _id },
        $inc: { followsCount: 1 },
      }
    );

    //updating the followed user
    await User.findByIdAndUpdate(
      { _id: _id },
      {
        $push: { followers: req.userId },
        $inc: { followersCount: 1 },
      }
    );

    res.status(200).end();
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

export const removeFollow = async (req, res) => {
  try {
    const { _id } = await User.findOne({
      ethAddress: req.params.followedUserWallet,
    }).select("_id");

    const isFollowed = await User.countDocuments({
      _id: req.userId,
      follows: _id,
    });

    if (!!!isFollowed) {
      res.status(400).json({ err: "You can't unfollow the unfollowed!" }).end();
    }

    //current user unfollows
    await User.findByIdAndUpdate(
      { _id: req.userId },
      {
        $pull: { follows: _id },
        $inc: { followsCount: -1 },
      }
    );

    //updating the followed user
    await User.findByIdAndUpdate(
      { _id: _id },
      {
        $pull: { followers: req.userId },
        $inc: { followersCount: -1 },
      }
    );

    res.status(200).end();
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};
