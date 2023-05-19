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
