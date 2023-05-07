import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/comment.js";

const router = Router();

router.get("/", getComments);
router.post("/create", createComment);
router.delete("/delete/:commentId", deleteComment);

export default router;
