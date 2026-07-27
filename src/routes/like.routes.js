import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { togglevideolike , togglecommentlike } from "../controllers/like.js";


const router = Router()

router.route("/togglevideolike/v/:videoId").post(verifyjwt,togglevideolike)

router.route("/togglecommentlike/v/:commentId").post(verifyjwt,togglecommentlike)


export default router