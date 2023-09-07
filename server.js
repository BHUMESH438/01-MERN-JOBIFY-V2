import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import morgan from 'morgan';
import Jobrouter from './router/jobrouter.js';
import mongoose from 'mongoose';
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware.js';
import authRouter from './router/authRouter.js';
import userRouter from './router/userRouter.js';
import { authenticateUser } from './middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';
//public--for imageupload
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import cloudinary from 'cloudinary';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

//image-uploads
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

//the filetoURLPath gives the correct / url slash while reading or woriting , and the dire name gives the dirname of the path
//import.meta.url provides absolute file path module as per in the browser
const __dirname = dirname(fileURLToPath(import.meta.url));
//creates the express static files in the dist
app.use(express.static(path.resolve(__dirname, './client/dist')));

//middlewares - only in dev mode morgan will be used
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//parse the json fn data
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());

//common route middleware
//only user logged in then he must access ohter routes
app.use('/api/v1/jobs', authenticateUser, Jobrouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

//combining the dist folders in the browser and public folders in the server so both the server and client will have the same
//gets the req from the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});

//overall error -404
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'route not found client error' });
});

//internal error -500 MIDDLEWARE
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5100;
//SERVER
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
