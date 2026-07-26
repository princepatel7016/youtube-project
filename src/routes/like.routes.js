import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { togglevideolike } from "../controllers/like.js";


const router = Router()

router.route("/togglevideolike/v/:videoId").post(verifyjwt,togglevideolike)


export default router