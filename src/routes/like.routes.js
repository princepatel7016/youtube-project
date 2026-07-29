import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { togglevideolike , togglecommentlike, toggletweetlike , getlikevideos} from "../controllers/like.js";


const router = Router()

router.route("/togglevideolike/v/:videoId").post(verifyjwt,togglevideolike)

router.route("/togglecommentlike/v/:commentId").post(verifyjwt,togglecommentlike)

router.route("/toggletweetlike/v/:tweetId").post(verifyjwt,toggletweetlike)

router.route("/videos").get(verifyjwt,getlikevideos)


export default router