import { Router } from "express";
import { getUser } from "../controllers/user.js";

const router = Router();

router.get("/:userWallet", getUser);

export default router;