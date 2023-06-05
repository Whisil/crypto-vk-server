import { Router } from "express";
import {
  getUser,
  getUserPosts,
  setSettings,
  createFollow,
} from "../controllers/user.js";
import { upload } from "../utils/multer.js";

const router = Router();

router.get("/:userWallet", getUser);
router.get("/:userWallet/posts/:media?", getUserPosts);
router.post("/settings", upload.array("files"), setSettings);
router.post("/createFollow/:followsUserId", createFollow);
router.post("/removeFollow/:followsUserId", removeFollow);

export default router;
