import express from 'express';
import { deleteAccount, editProfile, getCurrentUser } from '../contollers/userProfile.controller.mjs';
import { protectRoute } from '../middleware/protectRoute.mjs';

const userRouter = express.Router();

userRouter.get('/getCurrentuser', protectRoute, getCurrentUser);
userRouter.patch('/editProfile', protectRoute, editProfile);
userRouter.delete('/deleteAccount', protectRoute, deleteAccount);

export default userRouter;