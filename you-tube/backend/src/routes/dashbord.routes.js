import { Router } from 'express';
import { getChannelStats, getChannelVideos} from "../controllers/dashbord.js"
import { verifyjwt } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/stats").get(verifyjwt,getChannelStats);

router.route("/videos").get(verifyjwt,getChannelVideos);


export default router