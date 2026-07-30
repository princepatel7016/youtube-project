import { Router } from 'express';
import { getChannelStats } from "../controllers/dashbord.js"
import { verifyjwt } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/stats").get(verifyjwt,getChannelStats);


export default router