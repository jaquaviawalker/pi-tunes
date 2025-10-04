import express from 'express';
import { handleScanToAlbum } from '../controllers/scanController';

const router = express.Router();

router.post('/scanAlbum', handleScanToAlbum);

export default router;
