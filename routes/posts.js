import { Router } from "express";
import { getPosts, createPost, deletePost, likePost, removeLike } from "../controllers/posts.js";
import { upload } from "../utils/multer.js";

const router = Router();

router.get("/:postId?", getPosts);
router.post("/create", upload.single("file"), createPost);
router.post("/like/:postId", likePost);
router.post("/removeLike/:postId", removeLike);
router.delete("/delete/:postId", upload.single("file"), deletePost);

export default router;
