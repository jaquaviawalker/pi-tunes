import express, { Request, Response } from 'express';
import playbackRoutes from './routes/playbackRoutes';
import authRoutes from './routes/authRoutes';
import scanRoutes from './routes/authRoutes';
import testRoutes from './routes/testRoutes';

import dotenv from 'dotenv';
dotenv.config();

const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', playbackRoutes);
app.use('/api', scanRoutes);
app.use('/api', authRoutes);
app.use('/api', testRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
