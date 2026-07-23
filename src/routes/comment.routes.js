import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { getVideocomment } from "../controllers/comment.js";

const router = Router()

router.route("/getVideocomment/:videoid").get(getVideocomment)


export default router