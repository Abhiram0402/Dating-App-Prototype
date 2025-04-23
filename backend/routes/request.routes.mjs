import express from 'express';
import { protectRoute } from '../middleware/protectRoute.mjs';
import { listSentRequests, requestForAccess } from '../contollers/request.controller.mjs';

const requestRouter = express.Router();

requestRouter.post('/requestForAccess', protectRoute, requestForAccess);
requestRouter.get('/listSentRequests', protectRoute, listSentRequests);

export default requestRouter;