import { Router } from "express";
import { getPosts, createPost, deletePost, likePost, removeLike } from "../controllers/posts.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/media");
  },
  filename: (req, file, cb) => {
    const extenstion = file.originalname.split(".").pop();
    const originalName = file.originalname.split(".").shift();
    cb(null, originalName + "-" + Date.now() + '.' + extenstion);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

router.get("/:postId?", getPosts);
router.post("/create", upload.single("file"), createPost);
router.post("/like/:postId", likePost);
router.post("/removeLike/:postId", removeLike);
router.delete("/delete/:postId", upload.single("file"), deletePost);

export default router;
