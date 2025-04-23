import express from 'express';
import { createPost, deletePost, editPost, listInterests, listMyPosts } from '../contollers/post.controller.mjs';
import { protectRoute } from '../middleware/protectRoute.mjs';

const postRouter = express.Router();

postRouter.post('/createPost', protectRoute, createPost);
postRouter.get('/listMyPosts', protectRoute, listMyPosts);
postRouter.patch('/editPost', protectRoute, editPost);
postRouter.delete('/deletePost', protectRoute, deletePost);
postRouter.get('/listInterests', protectRoute, listInterests);

export default postRouter;