import express from 'express';
import { login, logout, signup } from '../contollers/auth.controller.mjs';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

export default authRouter;