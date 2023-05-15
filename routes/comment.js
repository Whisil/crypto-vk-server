import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/comment.js";
import { upload } from "../utils/multer.js";

const router = Router();

router.get("/:postId", getComments);
router.post("/create/:postId", upload.single("file"), createComment);
router.delete("/delete/:commentId", deleteComment);

export default router;
