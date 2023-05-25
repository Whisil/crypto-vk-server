import User from "../models/User.js";
import jwt from "jsonwebtoken";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWTSECRET, { expiresIn: "6h" });
};

export const loginUser = async (req, res) => {
  const { ethAddress } = req.body;
  const user = await User.findOne({ ethAddress });

  if (user) {
    req.user = { id: user._id };
    const token = createToken(user._id);

    res.status(200).json({ user, token });
  } else {
    res.status(404).json(false);
  }
};

export const signupUser = async (req, res) => {
  const { ethAddress, username, displayName } = req.body;

  try {
    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      throw new Error("Username already exists");
    }

    const user = await User.create({ ethAddress, username, displayName });
    const token = createToken(user._id);
    req.user = { id: user._id };

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
