import { Router } from "express";
import { getPosts, createPost } from "../controllers/posts.js";
import multer from "multer";
import { extractUserId } from "../middleware/extractUserId.js";

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

router.get("/", getPosts);
router.post("/create", upload.single("file"), createPost);

export default router;
