import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { createTweet , getTweet} from "../controllers/tweet.js";

const router = Router()

router.route("/createTweet").post(verifyjwt, createTweet)

router.route("/getTweet").get(getTweet)

export default router