import { Router } from "express";
import { createLike, removeLike } from "../controllers/like.js";

const router = Router();

router.post("/like/:postId", createLike);
router.delete("/removeLike/:postId", removeLike);

export default router;