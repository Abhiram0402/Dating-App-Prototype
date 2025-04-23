import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.mjs';
import { connectToMongoDb } from './dbConnection/connectToMongoDb.mjs';
import userRouter from './routes/userProfile.routes.mjs';
import { protectRoute } from './middleware/protectRoute.mjs';
import cookieParser from 'cookie-parser';
import postRouter from './routes/post.routes.mjs';
import { requestForAccess } from './contollers/request.controller.mjs';
import requestRouter from './routes/request.routes.mjs';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 6000;

app.get('/', (req, res) => {
    res.send("Hello world");
})


app.use('/auth', authRouter);
app.use('/user', protectRoute, userRouter);
app.use('/post', protectRoute, postRouter);
app.use('/profiles', protectRoute, requestRouter);

app.listen(PORT, (req, res) => {
    connectToMongoDb();
    console.log(`Listening to PORT-${PORT}`);
});