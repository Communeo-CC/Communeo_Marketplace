import express from 'express';
import { getAllVideos, addVideo, deleteVideo } from '../controllers/video.controller.js';

const router = express.Router();

// Get all videos
router.get('/', getAllVideos);

// Add a new video
router.post('/', addVideo);

// Delete a video
router.delete('/:id', deleteVideo);

export default router; 