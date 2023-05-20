import { Router } from "express";
import { getUser, getUserPosts } from "../controllers/user.js";

const router = Router();

router.get("/:userWallet", getUser);
router.get("/:userWallet/posts", getUserPosts)

export default router;