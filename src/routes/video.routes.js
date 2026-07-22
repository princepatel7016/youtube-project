import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyjwt } from "../middleware/auth.middleware.js";
import {videoupload, getAllvideo , getVideoById} from "../controllers/video.js"

const router = Router()

router.route("/videoadd").post(
    verifyjwt,
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
    videoupload)

router.route("/getallvideo").get(getAllvideo)

router.route("/:videoId").get(getVideoById)



export default router
