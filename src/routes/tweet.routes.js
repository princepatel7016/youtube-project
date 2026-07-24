import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { createTweet } from "../controllers/tweet.js";

const router = Router()

router.route("/createTweet").post(verifyjwt, createTweet)

export default router