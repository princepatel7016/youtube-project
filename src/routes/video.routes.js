import { Router } from "express";
import { upload } from "../middleware/multer.middleware";
import {upload} from "../middleware/multer.middleware.js"
import { verifyjwt } from "../middleware/auth.middleware.js";
import {videofile} from "../controllers/video.js"

const router = Router()

router.route("/videoadd").post(
    upload.fields([
        {
            name:"videofile",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    videofileadd)

// router.route("/:videoid")


export default router
