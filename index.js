import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import userRouter from './routes/userRouter.js';

config();
const app = express();

app.use(cors());
app.use(express.json());

// Define routes
app.use('/', userRouter);
app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});