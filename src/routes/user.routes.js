import { Router } from "express";
import { registeruser } from "../controllers/user.js";
import {upload} from "../middleware/multer.middleware.js"

const router = Router() 

router.route("/register").post(
    upload.fields([                    // middleware 
        {
            name:"avtar",
            maxCount:1
        },
        {
            name:"coverimage",
            maxCount:1
        }
    ]),
    registeruser)
// router.route("/login").post(login)

export default router