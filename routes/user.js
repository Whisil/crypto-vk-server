import { Router } from "express";
import {
  getUser,
  getUserPosts,
  setSettings,
  createFollow,
  removeFollow,
} from "../controllers/user.js";
import { upload } from "../utils/multer.js";

const router = Router();

router.get("/:userWallet", getUser);
router.get("/:userWallet/posts/:media?", getUserPosts);
router.post("/settings", upload.array("files"), setSettings);
router.post("/createFollow/:followedUserWallet", createFollow);
router.post("/removeFollow/:followedUserWallet", removeFollow);

export default router;
