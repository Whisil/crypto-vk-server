import { Router } from "express";
import { getUser, getUserPosts, setSettings } from "../controllers/user.js";
import { upload } from "../utils/multer.js";

const router = Router();

router.get("/:userWallet", getUser);
router.get("/:userWallet/posts/:media?", getUserPosts);
router.post("/settings", upload.array("files"), setSettings);

export default router;
