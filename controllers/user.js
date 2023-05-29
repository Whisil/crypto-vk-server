import User from "../models/User.js";

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
    avatarURL = null,
    bio = null,
    websiteURL = null,
  } = req.body;
  const userId = req.userId;
  const file = req.file;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' }).end();
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

    if (file && bannerFileURL !== user.bannerURL) {
      const bannerFileURL = `${req.protocol}://${req.get("host")}/media/${
        file.filename
      }`;
      user.bannerURL = bannerFileURL;
    }

    if (avatarURL && avatarURL !== user.avatarURL) {
      user.avatarURL = avatarURL;
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
