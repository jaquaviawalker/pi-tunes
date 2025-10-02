import express from 'express';
import { handleScanTagToAlbum } from '../controllers/scanController';

const router = express.Router();

router.post('/scanAlbum', handleScanTagToAlbum);
