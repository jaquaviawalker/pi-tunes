import express from 'express';
import { handlePlayAlbum } from '../controllers/playbackController';

const router = express.Router();

router.post('play', handlePlayAlbum);

export default router;
