import Post from "../models/post.js";

export const getPosts = async (req, res) => {
  try {
    const postMessages = await Post.find();

    console.log(postMessages);

    res.status(200).json(postMessages);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new Post(post);

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(409).json({ message: error.message });
  }
};
