import { Router } from "express";
import { getUser, getUserPosts, setSettings } from "../controllers/user.js";

const router = Router();

router.get("/:userWallet", getUser);
router.get("/:userWallet/posts/:media?", getUserPosts);
router.post("/settings", setSettings);

export default router;
