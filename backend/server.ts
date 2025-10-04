import express from 'express';
import playbackRoutes from './routes/playbackRoutes';
import authRoutes from './routes/authRoutes';
import scanRoutes from './routes/scanRoutes';
import testRoutes from './routes/testRoutes';
import cors from 'cors';
import dotenv from 'dotenv';

// @ts-ignore
import Mfrc522 from 'mfrc522-rpi';
// @ts-ignore
import SoftSPI from 'rpi-softspi';
dotenv.config();

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
