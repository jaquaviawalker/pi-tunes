import express, { Request, Response } from 'express';
import playbackRoutes from './routes/playbackRoutes';

import dotenv from 'dotenv';
dotenv.config();

const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', playbackRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
